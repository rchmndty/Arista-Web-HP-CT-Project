/**
 * ARISTA Component - Filter Component Module Handler
 */

class CatalogFilter {
    constructor(tabsSelector, onFilterCallback) {
        this.tabs = document.querySelectorAll(tabsSelector);
        this.onFilter = onFilterCallback;
        this.activeCategory = "all";

        if (this.tabs.length > 0) {
            this.initListeners();
        }
    }

    initListeners() {
        this.tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                this.setActiveTab(tab);
            });
        });
    }

    setActiveTab(selectedTab) {
        this.tabs.forEach(tab => {
            tab.classList.remove("active");
            tab.setAttribute("aria-selected", "false");
        });

        selectedTab.classList.add("active");
        selectedTab.setAttribute("aria-selected", "true");
        
        this.activeCategory = selectedTab.getAttribute("data-category");
        this.onFilter(this.activeCategory);
    }

    reset() {
        const allTab = Array.from(this.tabs).find(tab => tab.getAttribute("data-category") === "all");
        if (allTab) {
            this.setActiveTab(allTab);
        }
    }
}
