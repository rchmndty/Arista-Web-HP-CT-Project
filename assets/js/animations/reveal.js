/**
 * ARISTA Animation Component - Element Scroll Reveal Engine
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-slide-left, .reveal-slide-right');
    if (revealElements.length === 0) return;

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target);
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
