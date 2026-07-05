/**
 * ARISTA Core Component - Footer Engine Handler
 */

document.addEventListener("DOMContentLoaded", () => {
    updateCopyrightYear();
});

function updateCopyrightYear() {
    const yearNode = document.getElementById("footerCurrentYear");
    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }
}
