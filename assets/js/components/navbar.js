/**
 * ARISTA Core Component - Navbar Controller Engine
 */

document.addEventListener("DOMContentLoaded", () => {
    initStickyNavbar();
    initMobileNavigation();
    setActiveNavigationLink();
});

function initStickyNavbar() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const toggleNavbarState = () => {
        if (window.scrollY > 20) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }
    };

    window.addEventListener("scroll", toggleNavbarState);
    toggleNavbarState(); // Initial check on load execution
}

function initMobileNavigation() {
    const toggleBtn = document.querySelector(".mobile-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        toggleBtn.classList.toggle("open", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close menu when clicking individual navigation links
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            toggleBtn.classList.remove("open");
            document.body.style.overflow = "";
        });
    });
}

function setActiveNavigationLink() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf("/") + 1);
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        const hrefValue = link.getAttribute("href");
        if (pageName === hrefValue || (pageName === "" && hrefValue === "index.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}
