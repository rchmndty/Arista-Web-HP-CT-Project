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
                <a href="dashboard.html" class="menu-item ${currentPage === 'dashboard.html' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                    <span>Ringkasan</span>
                </a>
                
                <a href="homepage.html" class="menu-item ${currentPage === 'homepage.html' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    <span>Manajemen Beranda</span>
                </a>

                <a href="products.html" class="menu-item ${currentPage === 'products.html' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                    <span>Katalog Produk</span>
                </a>
                <a href="services.html" class="menu-item ${currentPage === 'services.html' || currentPage === 'services_2.html' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    <span>Layanan</span>
                </a>
                <a href="testimonials.html" class="menu-item ${currentPage === 'testimonials.html' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <span>Testimonial</span>
                </a>
                <a href="faq.html" class="menu-item ${currentPage === 'faq.html' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    <span>FAQ</span>
                </a>
                <a href="company.html" class="menu-item ${currentPage === 'company.html' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="4" r="4"></circle></svg>
                    <span>Profil Bisnis</span>
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
                    window.location.href = "login.html";
                }
            }
        });
    }
}
