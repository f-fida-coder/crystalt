document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.padding = '10px 0';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.padding = '15px 0';
            navbar.style.background = '#ffffff';
            navbar.style.boxShadow = 'none';
        }
    });

    // ===== HAMBURGER MENU FUNCTIONALITY =====
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Create overlay element
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close menu when clicking overlay
    navOverlay.addEventListener('click', () => {
        closeMenu();
    });

    // Close menu when clicking a non-dropdown link
    const navLinksItems = document.querySelectorAll('.nav-links > li > a:not(.dropdown > a)');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 968) {
                closeMenu();
            }
        });
    });

    // Handle dropdown clicks on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');

        dropdownLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 968) {
                e.preventDefault();
                e.stopPropagation();

                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });

                // Toggle current dropdown
                dropdown.classList.toggle('active');
            }
        });
    });

    // Close menu when clicking dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-menu a');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 968) {
                closeMenu();
            }
        });
    });

    function toggleMenu() {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';

        // Change hamburger icon to X when active
        const icon = navToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    function closeMenu() {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        body.style.overflow = '';

        // Reset icon
        const icon = navToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');

        // Close all dropdowns
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 968) {
            closeMenu();
        }
    });

    // Prevent body scroll when menu is open
    window.addEventListener('resize', () => {
        if (window.innerWidth > 968 && body.style.overflow === 'hidden') {
            body.style.overflow = '';
        }
    });

    // ===== SCROLL REVEAL ANIMATION =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.service-card, .project-card, .partner-content, .section-header');

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Add visible class styling dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);
});
