/**
 * Animation Controller
 * Handles scroll-triggered animations, intersection observers, and performance optimizations
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Animation configuration
    const ANIMATION_CONFIG = {
        threshold: 0.1,        // Trigger when 10% of element is visible
        rootMargin: '0px',     // No margin around viewport
        debounceDelay: 100,    // Debounce delay for resize events
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
    
    /**
     * Check if animations should be enabled
     * Respects user's motion preferences
     */
    function shouldEnableAnimations() {
        return !ANIMATION_CONFIG.reducedMotion;
    }
    
    /**
     * Create intersection observer for scroll animations
     * Monitors elements and triggers animations when they come into view
     */
    function createScrollObserver() {
        if (!shouldEnableAnimations()) {
            return null;
        }
        
        const observerOptions = {
            threshold: ANIMATION_CONFIG.threshold,
            rootMargin: ANIMATION_CONFIG.rootMargin
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Add visible class to trigger animation
                    element.classList.add('visible');
                    
                    // Add specific animation classes based on data attributes
                    const animationType = element.dataset.animation;
                    if (animationType) {
                        element.classList.add(`animate-${animationType}`);
                    }
                    
                    // Stop observing after animation is triggered
                    observer.unobserve(element);
                    
                    // Dispatch custom event
                    const animationEvent = new CustomEvent('elementAnimated', {
                        detail: { element: element, type: animationType }
                    });
                    document.dispatchEvent(animationEvent);
                }
            });
        }, observerOptions);
        
        return observer;
    }
    
    /**
     * Setup scroll animations for elements
     * Finds elements with animation classes and sets up observation
     */
    function setupScrollAnimations() {
        const observer = createScrollObserver();
        if (!observer) return;
        
        // Find all elements with scroll animation classes
        const animatedElements = document.querySelectorAll('.scroll-animate, .animate-on-scroll');
        
        animatedElements.forEach(element => {
            // Add initial animation class if not present
            if (!element.classList.contains('scroll-animate')) {
                element.classList.add('scroll-animate');
            }
            
            // Start observing the element
            observer.observe(element);
        });
        
        // Setup staggered animations
        setupStaggeredAnimations(observer);
        
        console.log(`Scroll animations setup for ${animatedElements.length} elements`);
    }
    
    /**
     * Setup staggered animations for groups of elements
     * Creates sequential animations for elements in containers
     */
    function setupStaggeredAnimations(observer) {
        const staggerContainers = document.querySelectorAll('.stagger-animation');
        
        staggerContainers.forEach(container => {
            const children = container.children;
            const delay = 100; // Delay between each child animation
            
            Array.from(children).forEach((child, index) => {
                // Add stagger class and delay
                child.classList.add('scroll-animate');
                child.style.animationDelay = `${index * delay}ms`;
                
                // Start observing
                observer.observe(child);
            });
        });
    }
    
    /**
     * Add hover animations to interactive elements
     * Enhances user interaction with subtle animations
     */
    function addHoverAnimations() {
        // Animate project cards on hover
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.classList.add('animate-float');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('animate-float');
            });
        });
        
        // Animate skill tags on hover
        const skillTags = document.querySelectorAll('.skill-tag');
        skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.classList.add('animate-pulse');
            });
            
            tag.addEventListener('mouseleave', function() {
                this.classList.remove('animate-pulse');
            });
        });
    }
    
    /**
     * Setup typing animation for hero title
     * Creates a typewriter effect for the main heading
     */
    function setupTypingAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;
        
        const originalText = "Hi, I'm Emre Kaplan";
        heroTitle.textContent = '';
        heroTitle.classList.add('typing-animation');
        
        let charIndex = 0;
        const typingSpeed = 50; // milliseconds per character
        
        function typeChar() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, typingSpeed);
            } else {
                // Remove typing animation class when complete
                setTimeout(() => {
                    heroTitle.classList.remove('typing-animation');
                }, 3000);
            }
        }
        
        // Start typing animation after a short delay
        setTimeout(typeChar, 100);
    }
    
    /**
     * Add parallax effect to background elements
     * Creates depth with subtle movement on scroll
     */
    function addParallaxEffect() {
        if (!shouldEnableAnimations()) return;
        
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        function updateParallax() {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
        
        // Throttle scroll events for performance
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
                setTimeout(() => { ticking = false; }, 100);
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    /**
     * Optimize animation performance
     * Reduces animations on low-end devices and during rapid scrolling
     */
    function optimizePerformance() {
        // Reduce animations on mobile devices
        if (window.innerWidth <= 768) {
            document.body.classList.add('reduce-animations');
        }
        
        // Pause animations during rapid scrolling
        let scrollTimer;
        window.addEventListener('scroll', function() {
            document.body.classList.add('scrolling');
            
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
                document.body.classList.remove('scrolling');
            }, 150);
        });
        
        // Add performance CSS
        const performanceStyles = document.createElement('style');
        performanceStyles.textContent = `
            /* Performance optimizations */
            .scrolling .animate-float,
            .scrolling .animate-swing,
            .scrolling .animate-wobble {
                animation-play-state: paused !important;
            }
            
            .reduce-animations * {
                animation-duration: 0.5s !important;
                transition-duration: 0.2s !important;
            }
            
            /* GPU acceleration for smooth animations */
            .animate-fade-in,
            .animate-slide-up,
            .animate-fade-in-left,
            .animate-fade-in-right,
            .animate-fade-in-up {
                transform: translateZ(0);
                backface-visibility: hidden;
                perspective: 1000px;
            }
        `;
        document.head.appendChild(performanceStyles);
    }
    
    /**
     * Handle window resize events
     * Reinitializes animations when viewport changes significantly
     */
    function handleResize() {
        let resizeTimer;
        
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // Re-setup animations if needed
                if (window.innerWidth <= 768) {
                    document.body.classList.add('reduce-animations');
                } else {
                    document.body.classList.remove('reduce-animations');
                }
            }, ANIMATION_CONFIG.debounceDelay);
        });
    }
    
    /**
     * Initialize all animation functionality
     * Sets up event listeners and starts animation systems
     */
    function initAnimations() {
        if (!shouldEnableAnimations()) {
            console.log('Animations disabled due to user preference');
            return;
        }
        
        // Setup different animation types
        setupScrollAnimations();
        addHoverAnimations();
        setupTypingAnimation();
        addParallaxEffect();
        
        // Performance optimizations
        optimizePerformance();
        handleResize();
        
        console.log('Animation system initialized');
    }
    
    /**
     * Add animation utilities to global scope
     * Provides helper functions for manual animation control
     */
    window.Animations = {
        /**
         * Manually trigger animation on an element
         * @param {Element} element - Element to animate
         * @param {string} animationType - Type of animation to trigger
         */
        triggerAnimation: function(element, animationType) {
            if (element && animationType) {
                element.classList.add(`animate-${animationType}`);
                
                // Remove animation class after completion
                setTimeout(() => {
                    element.classList.remove(`animate-${animationType}`);
                }, 1000);
            }
        },
        
        /**
         * Add scroll animation to element
         * @param {Element} element - Element to observe
         * @param {string} animationType - Type of animation to trigger
         */
        addScrollAnimation: function(element, animationType) {
            if (element) {
                element.classList.add('scroll-animate');
                if (animationType) {
                    element.dataset.animation = animationType;
                }
                
                const observer = createScrollObserver();
                if (observer) {
                    observer.observe(element);
                }
            }
        },
        
        /**
         * Check if animations are enabled
         * @returns {boolean} - True if animations are enabled
         */
        isEnabled: function() {
            return shouldEnableAnimations();
        }
    };
    
    // Start animation system
    initAnimations();
    
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});
