/**
 * ARISTA Core Admin - Universal Session Guard Engine (Patience Patch)
 */

document.addEventListener("DOMContentLoaded", async () => {
    const isLoginPage = window.location.pathname.includes('login.html');

    // 1. Berikan sedikit waktu agar SDK Supabase inisialisasi sempurna
    setTimeout(async () => {
        if (typeof supabase === 'undefined' || !supabase.auth) {
            console.error("Supabase tidak terbaca!");
            return;
        }

        const { data } = await supabase.auth.getSession();
        const hasActiveUser = data.session !== null;

        // 2. Logika "Tegas tapi Sabar"
        if (hasActiveUser && isLoginPage) {
            window.location.replace('dashboard.html');
        } else if (!hasActiveUser && !isLoginPage) {
            // Jika benar-benar tidak ada user, baru tendang
            window.location.replace('login.html');
        }
    }, 500); // Tunggu 500ms agar storage terbaca
});
