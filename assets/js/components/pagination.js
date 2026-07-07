/**
 * ARISTA Component - Pagination Control Module Handler
 */

class CatalogPagination {
    constructor(containerId, itemsPerPage, onPageChangeCallback) {
        this.container = document.getElementById(containerId);
        this.itemsPerPage = itemsPerPage;
        this.onPageChange = onPageChangeCallback;
        this.currentPage = 1;
        this.totalItems = 0;
    }

    render(totalItemsCount) {
        this.totalItems = totalItemsCount;
        if (!this.container) return;

        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.container.innerHTML = "";

        if (totalPages <= 1) return;

        // Previous button
        const prevBtn = document.createElement("button");
        prevBtn.className = "page-btn";
        prevBtn.innerHTML = "&larr;";
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.addEventListener("click", () => this.goToPage(this.currentPage - 1));
        this.container.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.className = `page-btn ${this.currentPage === i ? "active" : ""}`;
            pageBtn.innerText = i;
            pageBtn.addEventListener("click", () => this.goToPage(i));
            this.container.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement("button");
        nextBtn.className = "page-btn";
        nextBtn.innerHTML = "&rarr;";
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.addEventListener("click", () => this.goToPage(this.currentPage + 1));
        this.container.appendChild(nextBtn);
    }

    goToPage(pageNumber) {
        this.currentPage = pageNumber;
        this.onPageChange(this.currentPage);
    }

    reset() {
        this.currentPage = 1;
    }
}
