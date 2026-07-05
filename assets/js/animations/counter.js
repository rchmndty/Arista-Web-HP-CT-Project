/**
 * ARISTA Animation Component - Count Up Engine
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const runCounter = (counterEl) => {
        const parent = counterEl.closest('[data-target]');
        if (!parent) return;

        const target = +parent.getAttribute('data-target');
        const duration = 2000;
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let start = 0;

        const timer = setInterval(() => {
            start += Math.ceil(target / (duration / stepTime));
            if (start >= target) {
                counterEl.textContent = target;
                clearInterval(timer);
            } else {
                counterEl.textContent = start;
            }
        }, stepTime);
    };

    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterEl = entry.target.querySelector('.counter');
                if (counterEl) {
                    runCounter(counterEl);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card').forEach(card => {
        counterObserver.observe(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initCounterAnimation();
});
