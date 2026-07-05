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
        ease: "power2.out",
        duration: 0.8
    },
    tweaks: {
        meshSpeedMultiplier: 1,
        performanceMode: false
    }
};

// Set global defaults configuration onto GSAP instance
if (typeof gsap !== 'undefined') {
    gsap.config({
        nullTargetWarn: false,
        trialWarn: false
    });
}
