
/**
 * ARISTA Core Animation Engine Configuration
 * Base configuration file utilizing modern, optimized parameters
 */

// Register global engine plugins securely
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Global Core Config Parameters
const ARISTA_ANIM_CONFIG = {
    defaults: {
        ease: "power3.out",
        duration: 0.6
    },
    timings: {
        revealDelayFactor: 0.12,
        transitionSpeed: 400
    },
    tweaks: {
        meshSpeedMultiplier: 1,
        performanceMode: true
    }
};

// Set global defaults configuration onto GSAP instance
if (typeof gsap !== 'undefined') {
    gsap.config({
        nullTargetWarn: false,
        trialWarn: false
    });
    gsap.defaults(ARISTA_ANIM_CONFIG.defaults);
}
