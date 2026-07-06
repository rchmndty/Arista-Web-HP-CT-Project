/**
 * ARISTA UI Components - Smooth Height Accordion Handler
 */
class AristaAccordion {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.items = Array.from(this.container.querySelectorAll('.accordion-item'));
        this.init();
    }

    init() {
        this.items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            if (header && content) {
                header.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleItem(item, content);
                });
            }
        });
    }

    toggleItem(targetItem, content) {
        const isActive = targetItem.classList.contains('active');

        // Collapse item lain agar hanya ada 1 FAQ yang terbuka secara bersamaan (Sistem fokus tunggal)
        this.items.forEach(item => {
            if (item !== targetItem && item.classList.contains('active')) {
                item.classList.remove('active');
                const openContent = item.querySelector('.accordion-content');
                if (openContent) openContent.style.height = '0px';
            }
        });

        // Toggle item terpilih menggunakan properti scrollHeight untuk kalkulasi tinggi presisi secara dinamis
        if (isActive) {
            targetItem.classList.remove('active');
            content.style.height = '0px';
        } else {
            targetItem.classList.add('active');
            content.style.height = `${content.scrollHeight}px`;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new AristaAccordion('.faq-container');
});
