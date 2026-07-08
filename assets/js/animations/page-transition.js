assets/js/animations/page-transition.js
/**
 * ARISTA Core Animation Engine - Smooth Page Transition Controller
 */
function initPageTransitions() {
    // Inject transition layer element dynamically to preserve previous structural templates
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    // Fade out overlay on load window processing
    requestAnimationFrame(() => {
        overlay.classList.add('fade-out');
    });

    // Handle transition end configuration parameters
    overlay.addEventListener('transitionend', () => {
        if (overlay.classList.contains('fade-out')) {
            overlay.style.display = 'none';
        }
    });

    // Monitor internal routing node clicks
    document.addEventListener('click', (e) => {
        const anchorNode = e.target.closest('a');
        if (!anchorNode) return;

        const urlPath = anchorNode.getAttribute('href');
        const openTarget = anchorNode.getAttribute('target');

        // Verify valid internal page route boundaries
        if (!urlPath || urlPath.startsWith('#') || urlPath.startsWith('javascript:') || urlPath.startsWith('tel:') || urlPath.startsWith('mailto:') || openTarget === '_blank') {
            return;
        }

        // Intercept native browser hard redirection routine
        if (urlPath.endsWith('.html') || urlPath.startsWith('/') || !urlPath.includes('://')) {
            e.preventDefault();
            overlay.style.display = 'block';
            
            requestAnimationFrame(() => {
                overlay.classList.remove('fade-out');
            });

            setTimeout(() => {
                window.location.href = urlPath;
            }, ARISTA_ANIM_CONFIG.timings.transitionSpeed);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initPageTransitions();
});
