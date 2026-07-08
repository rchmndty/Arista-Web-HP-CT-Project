
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

function initLogoutHandler() {
    const logoutBtn = document.getElementById("btnAdminLogout");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        if (confirm("Apakah Anda yakin ingin keluar dari sesi administrator?")) {
            firebase.auth().signOut()
                .then(() => {
                    // Pengalihan halaman dilakukan secara otomatis oleh session.js
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error("Gagal memutuskan sesi autentikasi server:", error);
                    alert("Terjadi kesalahan sistem saat mencoba keluar.");
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
    const prodCounter = document.getElementById("countProducts");
    const servCounter = document.getElementById("countServices");

    if (prodCounter) prodCounter.textContent = "0";
    if (servCounter) servCounter.textContent = "0";
}
