/**
 * ARISTA Page Controller - Catalog Workflow Pipeline Engine (Supabase Connected)
 */

document.addEventListener("DOMContentLoaded", () => {
    const catalogManager = new CatalogPageManager();
    catalogManager.initialize();
});

class CatalogPageManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.searchQuery = "";
        this.currentCategory = "all";
        
        this.itemsPerPage = 6;
        this.currentPage = 1;

        this.gridElement = document.getElementById("catalogGrid");
        this.emptyStateElement = document.getElementById("emptyState");
        this.resetBtn = document.getElementById("resetFiltersBtn");
    }

    // ==========================================================================
    // 🆕 UTILITY ENGINE: AMBIL DATA STRUKTUR KATEGORI DARI LOCALSTORAGE
    // ==========================================================================
    getDynamicCategories() {
        return JSON.parse(localStorage.getItem("arista_categories")) || [
            { slug: "digital-printing", name: "Digital Printing" },
            { slug: "dokumen-jilid", name: "Dokumen & Jilid" },
            { slug: "cetak-foto", name: "Cetak Foto" }
        ];
    }

    // ==========================================================================
    // 🆕 UTILITY ENGINE: MERENDER TOMBOL FILTER SECARA OTOMATIS KE HTML
    // ==========================================================================
    renderFilterTabs() {
        const tabsContainer = document.querySelector(".filter-tabs");
        if (tabsContainer) {
            const categories = this.getDynamicCategories();
            // Reset tab container, sisakan default "Semua Kategori"
            tabsContainer.innerHTML = `<button class="filter-tab active" data-category="all" role="tab" aria-selected="true">Semua Kategori</button>`;
            
            // Loop data dari CMS untuk membuat tombol baru
            categories.forEach(cat => {
                tabsContainer.innerHTML += `<button class="filter-tab" data-category="${cat.slug}" role="tab" aria-selected="false">${cat.name}</button>`;
            });
        }
    }

    async initialize() {
        await this.loadProductData();
        
        // 🆕 Jalankan render tombol dinamis sebelum script Filter diinisialisasi
        this.renderFilterTabs();
        
        this.searchComponent = new CatalogSearch("catalogSearch", "clearSearch", (query) => {
            this.searchQuery = query;
            this.currentPage = 1;
            this.paginationComponent.reset();
            this.applyFilterAndSearch();
        });

        this.filterComponent = new CatalogFilter(".filter-tab", (category) => {
            this.currentCategory = category;
            this.currentPage = 1;
            this.paginationComponent.reset();
            this.applyFilterAndSearch();
        });

        this.paginationComponent = new CatalogPagination("paginationContainer", this.itemsPerPage, (page) => {
            this.currentPage = page;
            this.renderGrid();
            window.scrollTo({ top: 200, behavior: 'smooth' });
        });

        if (this.resetBtn) {
            this.resetBtn.addEventListener("click", () => this.resetAllControls());
        }

        this.applyFilterAndSearch();
    }

    // ==========================================================================
    // SEKARANG MENGAMBIL DATA LANGSUNG DARI SUPABASE CLOUD (UPDATE TAHAP 17.6)
    // ==========================================================================
    async loadProductData() {
        try {
            // Mengambil seluruh data dari tabel 'products' dan mengurutkan dari yang terbaru
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.products = data || [];
            this.filteredProducts = [...this.products];
        } catch (error) {
            console.error("Kesalahan inisialisasi data katalog produk dari Supabase:", error);
            this.gridElement.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--danger)">Gagal memuat produk dari server. Silakan coba muat ulang halaman.</p>`;
        }
    }

    applyFilterAndSearch() {
        this.filteredProducts = this.products.filter(product => {
            const matchesCategory = this.currentCategory === "all" || product.category === this.currentCategory;
            const matchesSearch = product.title.toLowerCase().includes(this.searchQuery) || 
                                  product.desc.toLowerCase().includes(this.searchQuery);
            return matchesCategory && matchesSearch;
        });

        this.toggleStates();
        this.paginationComponent.render(this.filteredProducts.length);
        this.renderGrid();
    }

    toggleStates() {
        const hasItems = this.filteredProducts.length > 0;
        this.gridElement.style.display = hasItems ? "grid" : "none";
        this.emptyStateElement.style.display = hasItems ? "none" : "block";
    }

    renderGrid() {
        this.gridElement.innerHTML = "";
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageItems = this.filteredProducts.slice(startIndex, endIndex);

        pageItems.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            
            // 🆕 Integrasi Engine CTA WhatsApp dari contact.js (Otomatis Deteksi Produk)
            const whatsappAdmin = "6282198325877"; // Nomor resmi dari contact.js
            const templatePesan = `Halo Admin Arista.\n\nSaya ingin memesan produk dari Katalog:\n- Nama Produk: ${product.title}\n- Kategori: ${this.formatCategoryName(product.category)}\n- Harga: ${product.price} / ${product.unit}\n\nMohon informasi langkah pemesanan selanjutnya. Terima kasih!`;
            const textTerencode = encodeURIComponent(templatePesan);
            const linkWhatsApp = `https://wa.me/${whatsappAdmin}?text=${textTerencode}`;
            
            card.innerHTML = `
                <div class="product-image-wrapper">
                    ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                    <img src="${product.image}" alt="${product.title}" loading="lazy" class="product-img">
                </div>
                <div class="product-info">
                    <span class="product-category">${this.formatCategoryName(product.category)}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-desc">${product.desc}</p>
                    <div class="product-footer">
                        <span class="product-price">${product.price}<small>${product.unit}</small></span>
                        <!-- Tombol diubah dari Detail ke Pesan langsung ke WA Admin -->
                        <a href="${linkWhatsApp}" target="_blank" class="btn-product-cta" aria-label="Pesan ${product.title}">
                            <span>Pesan</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>
            `;
            this.gridElement.appendChild(card);
        });

        // ==========================================================================
        // TRICK AMAN UNTUK ANIMASI KARTU DINAMIS (GSAP / HOVER / REVEAL RE-TRIGGER)
        // ==========================================================================
        if (typeof gsap !== 'undefined' && window.ScrollTrigger) {
            window.ScrollTrigger.refresh(); 
        }
        
        if (typeof initializeHoverEffects === 'function') initializeHoverEffects();
        if (typeof initializeRevealEffects === 'function') initializeRevealEffects();
    }

    // ==========================================================================
    // 🔴 SINKRONISASI FORMAT NAMA KATEGORI DARI CMS (DINAMIS MAPPING)
    // ==========================================================================
    formatCategoryName(slug) {
        const categories = this.getDynamicCategories();
        const found = categories.find(c => c.slug === slug);
        return found ? found.name : slug;
    }

    resetAllControls() {
        this.searchQuery = "";
        this.currentCategory = "all";
        this.currentPage = 1;
        
        this.searchComponent.reset();
        this.filterComponent.reset();
        this.paginationComponent.reset();
        
        this.applyFilterAndSearch();
    }
}
