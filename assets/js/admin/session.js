
/**
 * ARISTA Core Admin - Session Guard Engine
 */

// Global Safe Fallback Object Rule untuk meredam potensi error dari page-transition.js
if (typeof window.ARISTA_ANIM_CONFIG === 'undefined') {
    window.ARISTA_ANIM_CONFIG = { timings: { transitionSpeed: 0 } };
}

// Inisialisasi Firebase secara terpusat untuk modul admin
if (typeof firebase !== 'undefined' && typeof ARISTA_CONFIG !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(ARISTA_CONFIG.firebaseConfig);
    }
}

function checkAdminSession(requireAuth = true) {
    firebase.auth().onAuthStateChanged((user) => {
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.includes('login.html');

        if (user) {
            // Jika user sudah login dan berada di halaman login, lempar ke dashboard
            if (isLoginPage) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // Jika user belum login dan berada di halaman dashboard
            if (requireAuth && !isLoginPage) {
                // VALIDASI: Cek apakah user keluar secara resmi lewat klik tombol logout
                if (localStorage.getItem('logout_redirect_index') === 'true') {
                    localStorage.removeItem('logout_redirect_index'); // Bersihkan token penanda
                    window.location.href = '../index.html'; // Lempar langsung ke index luar
                } else {
                    window.location.href = 'login.html'; // Jika menyusup langsung tanpa login, lempar ke login
                }
            }
        }
    });
}


// Deteksi otomatis kebutuhan autentikasi berdasarkan lokasi file berkas halaman
document.addEventListener("DOMContentLoaded", () => {
    const isLoginPage = window.location.pathname.includes('login.html');
    checkAdminSession(!isLoginPage);
});
