document.addEventListener("DOMContentLoaded", () => {
    console.log(`${ARISTA_CONFIG.brandName} v${ARISTA_CONFIG.version} - Core Infrastructure Loaded.`);
    initAppCore();
});

function initAppCore() {
    setupGlobalErrorHandling();
}

function setupGlobalErrorHandling() {
    window.addEventListener("error", (event) => {
        console.error("Runtime error caught in main context:", event.message);
    });
}
