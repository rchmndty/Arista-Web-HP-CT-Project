/**
 * ARISTA Page Controller - Homepage Hub
 */
document.addEventListener("DOMContentLoaded", () => {
    const headline = document.getElementById("hero-headline");
    if (headline) {
        const subheadline = document.querySelector(".hero-subheadline");
        const ctaGroup = document.querySelector(".hero-cta-group");
        
        setTimeout(() => {
            headline.classList.add("reveal");
            if (subheadline) subheadline.classList.add("reveal");
            if (ctaGroup) ctaGroup.classList.add("reveal");
        }, 100);
    }
});
