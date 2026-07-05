document.addEventListener('DOMContentLoaded', () => {
    const scene = document.getElementById('parallax-scene');
    if (!scene) return;

    const layers = scene.querySelectorAll('.layer');

    window.addEventListener('mousemove', (e) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const mouseX = (e.clientX - width / 2) / (width / 2);
        const mouseY = (e.clientY - height / 2) / (height / 2);

        layers.forEach((layer) => {
            const depth = parseFloat(layer.getAttribute('data-depth')) || 0.2;
            const moveX = mouseX * (depth * 40);
            const moveY = mouseY * (depth * 40);

            if (layer.classList.contains('hero-visual-card')) {
                layer.style.transform = `rotateY(${mouseX * 10}deg) rotateX(${-mouseY * 10}deg) translate3d(${moveX}px, ${moveY}px, 0px)`;
            } else {
                layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px)`;
            }
        });
    });

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            const gamma = e.gamma ? Math.min(Math.max(e.gamma, -30), 30) : 0;
            const beta = e.beta ? Math.min(Math.max(e.beta, -30), 30) : 0;

            const tiltX = (gamma / 30);
            const tiltY = (beta / 30);

            layers.forEach((layer) => {
                const depth = parseFloat(layer.getAttribute('data-depth')) || 0.2;
                const moveX = tiltX * (depth * 30);
                const moveY = tiltY * (depth * 30);

                if (layer.classList.contains('hero-visual-card')) {
                    layer.style.transform = `rotateY(${tiltX * 8}deg) rotateX(${-tiltY * 8}deg) translate3d(${moveX}px, ${moveY}px, 0px)`;
                } else {
                    layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px)`;
                }
            });
        });
    }
});
