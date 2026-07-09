/**
 * ARISTA Page Component - Admin Dashboard Base Operations Controller (Supabase Fully Migrated)
 */

document.addEventListener("DOMContentLoaded", () => {
    // Berikan sedikit jeda agar session guard menyelesaikan validasi token cloud
    setTimeout(() => {
        initDashboardProfile();
        loadSystemCoreSummary();
    }, 600); 
});

/**
 * Memuat informasi user aktif dari Supabase Auth
 */
async function initDashboardProfile() {
    try {
        if (typeof supabase === 'undefined') return;

        // Mengambil data user yang sedang login secara real-time dari session cloud
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;

        if (user) {
            const email = user.email || "admin@aristaprint.com";
            const emailDisplay = document.getElementById("adminUserEmail");
            const avatarDisplay = document.getElementById("avatarInitial");

            if (emailDisplay) emailDisplay.textContent = email;
            if (avatarDisplay) avatarDisplay.textContent = email.charAt(0).toUpperCase();
        }
    } catch (error) {
        console.error("Gagal mengambil session profile dari Supabase:", error.message);
    }
}

/**
 * Memuat ringkasan sistem dasar
 */
function loadSystemCoreSummary() {
    const versionDisplay = document.getElementById("coreVersion");
    if (versionDisplay && typeof ARISTA_CONFIG !== 'undefined') {
        versionDisplay.textContent = ARISTA_CONFIG.version || "1.0.0";
    }

    const prodCounter = document.getElementById("countProducts");
    const servCounter = document.getElementById("countServices");

    // Default value sebelum disinkronkan dengan table fetcher pada SPRINT berikutnya
    if (prodCounter) prodCounter.textContent = "0";
    if (servCounter) servCounter.textContent = "0";
}
