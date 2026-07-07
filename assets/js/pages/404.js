/**
 * ARISTA Page Component - 404 Interactive Parallax Engine
 */
document.addEventListener("mousemove", (e) => {
    const backgroundBlur = document.querySelector(".error-blur-bg");
    if (!backgroundBlur) return;

    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    // Geser glow tipis mengikuti arah pergerakan pointer mouse
    backgroundBlur.style.transform = `translate(calc(-50% + ${mouseX * 40}px), calc(-50% + ${mouseY * 40}px))`;
});
