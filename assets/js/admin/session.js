/**
 * ARISTA Core Admin - Universal Session Guard Engine (Supabase Migrated)
 */

// Global Safe Fallback Object Rule untuk meredam potensi error dari page-transition.js
if (typeof window.ARISTA_ANIM_CONFIG === 'undefined') {
    window.ARISTA_ANIM_CONFIG = { timings: { transitionSpeed: 0 } };
}

function checkAdminSession(requireAuth = true) {
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('login.html');

    // Memastikan SDK Supabase Client global sudah dimuat dengan benar
    if (typeof supabase !== 'undefined' && supabase.auth) {
        // Menggunakan realtime event listener bawaan Supabase Auth untuk memantau sesi token aktif
        supabase.auth.onAuthStateChange((event, session) => {
            const hasActiveUser = session && session.user;

            if (hasActiveUser) {
                // Jika token admin aktif tapi masih mencoba akses halaman login, lempar ke dashboard
                if (isLoginPage) {
                    window.location.href = 'dashboard.html';
                }
            } else {
                // Jika sesi kosong/habis dan mencoba mengakses halaman admin berproteksi
                if (requireAuth && !isLoginPage) {
                    handleUnauthenticatedState();
                }
            }
        });
    } else {
        console.error("Kesalahan Sistem: SDK Supabase Client gagal diinisialisasi.");
    }
}

/**
 * Fungsi pembantu penanganan rute keluar/tidak sah
 */
function handleUnauthenticatedState() {
    // VALIDASI: Cek apakah admin keluar secara resmi lewat klik tombol logout di sidebar
    if (localStorage.getItem('logout_redirect_index') === 'true') {
        localStorage.removeItem('logout_redirect_index'); // Bersihkan penanda rute luar
        window.location.href = '../index.html'; // Pindahkan ke halaman utama luar website Arista
    } else {
        window.location.href = 'login.html'; // Jika menyusup paksa lewat URL, tendang kembali ke login admin
    }
}

// Deteksi otomatis kebutuhan autentikasi berdasarkan lokasi berkas halaman yang dibuka
document.addEventListener("DOMContentLoaded", () => {
    const isLoginPage = window.location.pathname.includes('login.html');
    checkAdminSession(!isLoginPage);
});
