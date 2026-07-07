/**
 * ARISTA Page Controller - Catalog Workflow Pipeline Engine
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

    async initialize() {
        await this.loadProductData();
        
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

    async loadProductData() {
        try {
            const response = await fetch("data/products.json");
            if (!response.ok) throw new Error("Gagal mengambil data JSON katalog");
            this.products = await response.json();
            this.filteredProducts = [...this.products];
        } catch (error) {
            console.error("Kesalahan inisialisasi data katalog produk:", error);
            this.gridElement.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--danger)">Gagal memuat produk. Silakan coba muat ulang halaman.</p>`;
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
                        <a href="product.html?id=${product.id}" class="btn-product-cta" aria-label="Detail ${product.title}">
                            <span>Detail</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>
            `;
            this.gridElement.appendChild(card);
        });
    }

    formatCategoryName(slug) {
        const categories = {
            "digital-printing": "Digital Printing",
            "dokumen-jilid": "Dokumen & Jilid",
            "cetak-foto": "Cetak Foto"
        };
        return categories[slug] || slug;
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
