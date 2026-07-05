/**
 * ARISTA Animation Component - Element Scroll Reveal Engine
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-slide-left, .reveal-slide-right, .reveal-fade-up');
    if (revealElements.length === 0) return;

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-delay');
                
                if (delay) {
                    setTimeout(() => {
                        el.classList.add('active-reveal');
                    }, delay * 120);
                } else {
                    el.classList.add('active-reveal');
                }
                observer.unobserve(el);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
});
