/**
 * ARISTA Animation Component - Premium Micro-interactions & Hover Effects
 */
function initServiceCardHover() {
    const cards = document.querySelectorAll('.service-card');
    if (cards.length === 0) return;
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width) - 0.5;
            const yPercent = (y / rect.height) - 0.5;
            
            card.style.transform = `translateY(-8px) rotateX(${yPercent * -6}deg) rotateY(${xPercent * 6}deg)`;
            card.style.boxShadow = `0 20px 40px rgba(59, 130, 246, 0.12)`;
            card.style.borderColor = `rgba(139, 92, 246, 0.3)`;
            
            const iconWrapper = card.querySelector('.service-icon-wrapper');
            if (iconWrapper) {
                iconWrapper.style.transform = 'scale(1.1) rotate(4deg)';
                iconWrapper.style.backgroundColor = 'rgba(139, 92, 246, 0.15)';
                iconWrapper.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                const svg = iconWrapper.querySelector('svg');
                if (svg) svg.style.stroke = 'var(--accent)';
            }

            const link = card.querySelector('.service-link');
            if (link) {
                link.style.color = 'var(--accent)';
                const svgLink = link.querySelector('svg');
                if (svgLink) svgLink.style.transform = 'translateX(4px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            card.style.boxShadow = 'none';
            card.style.borderColor = 'var(--border)';
            
            const iconWrapper = card.querySelector('.service-icon-wrapper');
            if (iconWrapper) {
                iconWrapper.style.transform = 'scale(1) rotate(0deg)';
                iconWrapper.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                iconWrapper.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                const svg = iconWrapper.querySelector('svg');
                if (svg) svg.style.stroke = 'var(--primary)';
            }

            const link = card.querySelector('.service-link');
            if (link) {
                link.style.color = 'var(--primary)';
                const svgLink = link.querySelector('svg');
                if (svgLink) svgLink.style.transform = 'translateX(0)';
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initServiceCardHover();
});
