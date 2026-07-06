/**
 * ARISTA UI Components - Auto Carousel Slider Engine
 */
class AristaCarousel {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.track = this.container.querySelector('.carousel-track');
        this.items = Array.from(this.container.querySelectorAll('.carousel-item'));
        this.btnNext = this.container.querySelector('.btn-next');
        this.btnPrev = this.container.querySelector('.btn-prev');
        this.dotsContainer = this.container.querySelector('.carousel-dots');
        
        this.currentIndex = 0;
        this.autoPlayDelay = 5000; // Auto-slide setiap 5 detik
        this.autoPlayTimer = null;
        this.itemsPerView = this.getItemsPerView();

        this.init();
    }

    getItemsPerView() {
        return window.innerWidth >= 768 ? 2 : 1;
    }

    init() {
        if (this.items.length === 0) return;

        this.createDots();
        this.updateSlider();
        this.startAutoPlay();

        if (this.btnNext) this.btnNext.addEventListener('click', () => this.next());
        if (this.btnPrev) this.btnPrev.addEventListener('click', () => this.prev());
        
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());

        window.addEventListener('resize', () => {
            const newItemsPerView = this.getItemsPerView();
            if (newItemsPerView !== this.itemsPerView) {
                this.itemsPerView = newItemsPerView;
                this.createDots();
                this.currentIndex = Math.min(this.currentIndex, this.maxIndex());
                this.updateSlider();
            }
        });
    }

    maxIndex() {
        return Math.ceil(this.items.length / this.itemsPerView) - 1;
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';
        const count = this.maxIndex() + 1;
        
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === this.currentIndex) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    updateSlider() {
        const moveAmount = (this.currentIndex * 100);
        this.track.style.transform = `translateX(-${moveAmount / this.itemsPerView}%)`;

        const dots = Array.from(this.dotsContainer.querySelectorAll('.carousel-dot'));
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    next() {
        if (this.currentIndex >= this.maxIndex()) {
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }
        this.updateSlider();
    }

    prev() {
        if (this.currentIndex <= 0) {
            this.currentIndex = this.maxIndex();
        } else {
            this.currentIndex--;
        }
        this.updateSlider();
    }

    goTo(index) {
        this.currentIndex = index;
        this.updateSlider();
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => this.next(), this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new AristaCarousel('.carousel-container');
});
