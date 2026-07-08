
/**
 * ARISTA Animation Component - Element Scroll Reveal Engine
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-slide-left, .reveal-slide-right, .reveal-fade-up');
    if (revealElements.length === 0) return;

    // Check availability of enhanced GSAP Engine rules
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        revealElements.forEach(el => {
            let startVariables = { opacity: 0 };
            
            if (el.classList.contains('reveal-fade-up')) startVariables.y = 30;
            if (el.classList.contains('reveal-slide-left')) startVariables.x = -30;
            if (el.classList.contains('reveal-slide-right')) startVariables.x = 30;

            const delayAttr = el.getAttribute('data-delay');
            const calculatedDelay = delayAttr ? parseFloat(delayAttr) * ARISTA_ANIM_CONFIG.timings.revealDelayFactor : 0;

            gsap.fromTo(el, startVariables, {
                opacity: 1,
                x: 0,
                y: 0,
                delay: calculatedDelay,
                duration: ARISTA_ANIM_CONFIG.defaults.duration,
                ease: ARISTA_ANIM_CONFIG.defaults.ease,
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    toggleActions: "play none none none"
                }
            });
        });
    } else {
        // High-performance Native IntersectionObserver Fallback Strategy
        const revealOptions = {
            threshold: 0.08,
            rootMargin: "0px 0px -20px 0px"
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
}

document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
});
