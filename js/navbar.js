/**
 * Navigation Bar Functionality
 * Handles mobile menu toggle, smooth scrolling, and scroll effects
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Get DOM elements
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    /**
     * Toggle mobile menu
     * Opens/closes the hamburger menu on mobile devices
     */
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    /**
     * Close mobile menu
     * Closes the hamburger menu and re-enables body scroll
     */
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    /**
     * Handle smooth scrolling to sections
     * Updates active navigation link based on scroll position
     */
    function handleSmoothScroll(e) {
        const targetId = e.target.getAttribute('href');
        
        // Check if it's an internal link
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Close mobile menu if open
                closeMobileMenu();
                
                // Calculate offset for fixed navbar
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                updateActiveLink(targetId);
            }
        }
    }
    
    /**
     * Update active navigation link based on current section
     * @param {string} activeId - ID of the active section
     */
    function updateActiveLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Handle scroll events
     * Updates navbar appearance and active navigation links
     */
    function handleScroll() {
        const scrollPosition = window.scrollY;
        
        // Add scrolled class to navbar for styling changes
        if (scrollPosition > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active navigation link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navbarHeight = navbar.offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                updateActiveLink('#' + sectionId);
            }
        });
    }
    
    /**
     * Handle keyboard navigation
     * Allows closing mobile menu with Escape key
     */
    function handleKeyboard(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }
    
    /**
     * Handle window resize
     * Closes mobile menu when switching to desktop view
     */
    function handleResize() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }
    
    /**
     * Initialize navigation functionality
     * Sets up event listeners and initial state
     */
    function initNavigation() {
        // Mobile menu toggle
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }
        
        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });
        
        // Scroll event listener - delayed to respect initial hash
        // window.addEventListener('scroll', handleScroll);
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
        
        // Window resize handler
        window.addEventListener('resize', handleResize);
        
        // Initial scroll check - delayed to respect initial hash
        // handleScroll();
        
        // Set initial active link based on URL hash
        const currentHash = window.location.hash || '#home';
        updateActiveLink(currentHash);
        
        console.log('Navigation initialized successfully');
    }
    
    /**
     * Accessibility improvements
     * Adds ARIA attributes for better screen reader support
     */
    function improveAccessibility() {
        // Add ARIA attributes to hamburger button
        if (hamburger) {
            hamburger.setAttribute('aria-label', 'Toggle navigation menu');
            hamburger.setAttribute('aria-expanded', 'false');
            
            // Update ARIA expanded state when menu toggles
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'class') {
                        const isActive = hamburger.classList.contains('active');
                        hamburger.setAttribute('aria-expanded', isActive.toString());
                    }
                });
            });
            
            observer.observe(hamburger, { attributes: true });
        }
        
        // Add role to navigation menu
        if (navMenu) {
            navMenu.setAttribute('role', 'navigation');
        }
    }
    
    // Initialize everything when DOM is ready
    initNavigation();
    improveAccessibility();
    
    // Wait a bit before handling scroll to respect initial hash navigation
    setTimeout(() => {
        handleScroll();
        window.addEventListener('scroll', handleScroll);
    }, 100);
    
    // Expose functions for potential external use
    window.NavBar = {
        toggleMenu: toggleMobileMenu,
        closeMenu: closeMobileMenu,
        scrollToSection: function(sectionId) {
            const section = document.querySelector(sectionId);
            if (section) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = section.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                updateActiveLink(sectionId);
            }
        }
    };
});
