/**
 * Main Dynamic Background & Interface Orchestrator
 */

document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === 'undefined') return;

    // Advanced Fluid Mesh Motion Sequencing Configurations
    function initMeshAnimation() {
        // Blob 1 Animation Configuration Loop
        gsap.to(".blob-1", {
            x: "25vw",
            y: "15vh",
            duration: 18,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Blob 2 Animation Configuration Loop
        gsap.to(".blob-2", {
            x: "-20vw",
            y: "-25vh",
            duration: 22,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Blob 3 Animation Configuration Loop
        gsap.to(".blob-3", {
            x: "-15vw",
            y: "20vh",
            duration: 15,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // Initialize UI Component Entry Sequences
    function initEntranceSequence() {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero-content h1", {
            y: 30,
            opacity: 0,
            duration: 1.2,
            delay: 0.2
        })
        .from(".hero-content p", {
            y: 20,
            opacity: 0,
            duration: 1.0
        }, "-=0.8")
        .from(".hero-content .badge-base", {
            scale: 0.8,
            opacity: 0,
            duration: 0.6
        }, "-=1.0");
    }

    // Execute core engine sequences safely
    initMeshAnimation();
    initEntranceSequence();
});
