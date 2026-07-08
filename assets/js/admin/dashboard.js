
/**
 * ARISTA Page Component - Admin Dashboard Base Operations Controller
 */

document.addEventListener("DOMContentLoaded", () => {
    initDashboardProfile();
    initLogoutHandler();
    loadSystemCoreSummary();
});

function initDashboardProfile() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const email = user.email || "admin@aristaprint.com";
            const emailDisplay = document.getElementById("adminUserEmail");
            const avatarDisplay = document.getElementById("avatarInitial");

            if (emailDisplay) emailDisplay.textContent = email;
            if (avatarDisplay) avatarDisplay.textContent = email.charAt(0).toUpperCase();
        }
    });
}

// GANTI FUNCTION INITLOGOUTHANDLER DI DASHBOARD.JS
function initLogoutHandler() {
    const logoutBtn = document.getElementById("btnAdminLogout");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Mencegah reload halaman bawaan
        
        if (confirm("Apakah Anda yakin ingin keluar dari sesi administrator?")) {
            // Pasang tanda penanda resmi ke localStorage agar session.js tidak mencegat rute
            localStorage.setItem('logout_redirect_index', 'true');
            
            firebase.auth().signOut()
                .then(() => {
                    window.location.href = '../index.html';
                })
                .catch((error) => {
                    console.error("Gagal memutuskan sesi autentikasi server:", error);
                    window.location.href = '../index.html'; // Tetap arahkan ke depan jika gagal koneksi
                });
        }
    });
}



function loadSystemCoreSummary() {
    const versionDisplay = document.getElementById("coreVersion");
    if (versionDisplay && typeof ARISTA_CONFIG !== 'undefined') {
        versionDisplay.textContent = ARISTA_CONFIG.version || "1.0.0";
    }

    // Placeholder inisialisasi awal untuk pembacaan koleksi Firebase di modul SPRINT berikutnya
    const prodCounter = 


function loadSystemCoreSummary() {
    const versionDisplay = document.getElementById("coreVersion");
    if (versionDisplay && typeof ARISTA_CONFIG !== 'undefined') {
        versionDisplay.textContent = ARISTA_CONFIG.version || "1.0.0";
    }

    // Placeholder inisialisasi awal untuk pembacaan koleksi Firebase di modul SPRINT berikutnya
    const prodCounter = document.getElementById("countProducts");
    const servCounter = document.getElementById("countServices");

    if (prodCounter) prodCounter.textContent = "0";
    if (servCounter) servCounter.textContent = "0";
}
