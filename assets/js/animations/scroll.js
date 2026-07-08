assets/js/animations/scroll.js
/**
 * Scroll Driven Dynamic Visual Architecture Handler
 */

document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Subtle background dampening effect on scroll
    gsap.to(".background-wrapper", {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2
        },
        opacity: 0.45,
        y: 40,
        ease: "none"
    });

    // Soft parallax effect on the specialized floating blurs
    gsap.to(".blur-primary", {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 2
        },
        y: -100,
        x: 50,
        ease: "none"
    });

    gsap.to(".blur-accent", {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 2.5
        },
        y: 120,
        x: -40,
        ease: "none"
    });
});
