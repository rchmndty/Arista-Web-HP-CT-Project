/**
 * ARISTA Component - Search Module Component Handler
 */

class CatalogSearch {
    constructor(inputElementId, clearBtnId, onSearchCallback) {
        this.input = document.getElementById(inputElementId);
        this.clearBtn = document.getElementById(clearBtnId);
        this.onSearch = onSearchCallback;
        this.query = "";

        if (this.input) {
            this.initListeners();
        }
    }

    initListeners() {
        this.input.addEventListener("input", (e) => {
            this.query = e.target.value.trim().toLowerCase();
            this.toggleClearButton();
            this.onSearch(this.query);
        });

        if (this.clearBtn) {
            this.clearBtn.addEventListener("click", () => {
                this.reset();
            });
        }
    }

    toggleClearButton() {
        if (!this.clearBtn) return;
        this.clearBtn.style.display = this.query.length > 0 ? "block" : "none";
    }

    reset() {
        if (!this.input) return;
        this.input.value = "";
        this.query = "";
        this.toggleClearButton();
        this.onSearch("");
    }
}
