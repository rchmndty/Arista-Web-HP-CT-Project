/**
 * ARISTA Admin Workspace - Shared Sidebar Component Loader (Supabase Migrated)
 * Automatically handles active states and secure logout fallback sync.
 */
document.addEventListener("DOMContentLoaded", () => {
    renderAdminSidebar();
});

function renderAdminSidebar() {
    const wrapper = document.querySelector(".dashboard-wrapper");
    if (!wrapper) return;

    // Ambil nama file saat ini untuk menentukan class 'active'
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    // Template Navigasi Utama (Tetap mempertahankan UI aslimu)
    const sidebarHtml = `
        <aside class="admin-sidebar">
            <div class="sidebar-brand">ARISTA<span>.</span></div>
            <nav class="sidebar-menu">
            
                
                

                <a href="products.html" class="menu-item ${currentPage === 'products.html' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                    <span>Katalog Produk</span>
                </a>



              
                <button id="logoutBtn" class="menu-item logout-btn" style="background:none; border:none; width:100%; text-align:left; cursor:pointer;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    <span>Keluar</span>
                </button>
            </nav>
        </aside>
    `;

    wrapper.insertAdjacentHTML("afterbegin", sidebarHtml);

    // ✅ HUBUNGAN FUNGSI KONTROL LOGOUT TERPUSAT (SUPABASE MIGRATED)
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            
            if (confirm("Apakah Anda yakin ingin keluar dari panel administrator Arista?")) {
                try {
                    if (typeof supabase !== 'undefined' && supabase.auth) {
                        // Bersihkan token session dari server Supabase & Local Storage global
                        await supabase.auth.signOut();
                    }
                } catch (error) {
                    console.error("Gagal memutuskan sesi autentikasi server Supabase:", error.message);
                } finally {
                    // Tendang kembali ke halaman login (login.html satu direktori dengan dashboard.html)
                    window.location.href = "../index.html";
                }
            }
        });
    }
}
