/**
 * Theme Toggle Functionality
 * Handles dark/light mode switching with local storage persistence
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Get DOM elements
    const themeToggle = document.querySelector('#theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const htmlElement = document.documentElement;
    
    // Theme configuration
    const THEMES = {
        DARK: 'dark',
        LIGHT: 'light'
    };
    
    const ICONS = {
        DARK: '🌙',
        LIGHT: '☀️'
    };
    
    /**
     * Get the preferred theme from local storage or system preference
     * @returns {string} - The preferred theme ('dark' or 'light')
     */
    function getPreferredTheme() {
        // Check if theme is saved in local storage
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return THEMES.LIGHT;
        }
        
        // Default to dark theme
        return THEMES.DARK;
    }
    
    /**
     * Apply the specified theme to the document
     * @param {string} theme - The theme to apply ('dark' or 'light')
     */
    function applyTheme(theme) {
        // Remove existing theme attribute
        htmlElement.removeAttribute('data-theme');
        
        // Apply new theme
        if (theme === THEMES.LIGHT) {
            htmlElement.setAttribute('data-theme', THEMES.LIGHT);
            themeIcon.textContent = ICONS.LIGHT;
        } else {
            // Dark theme is default, no attribute needed
            themeIcon.textContent = ICONS.DARK;
        }
        
        // Save preference to local storage
        localStorage.setItem('portfolio-theme', theme);
        
        // Update toggle button title for accessibility
        themeToggle.setAttribute('title', `Switch to ${theme === THEMES.DARK ? 'light' : 'dark'} mode`);
        
        // Dispatch custom event for theme change
        const themeChangeEvent = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        document.dispatchEvent(themeChangeEvent);
        
        console.log(`Theme changed to: ${theme}`);
    }
    
    /**
     * Toggle between dark and light themes
     * Switches the current theme and applies the new one
     */
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
        
        // Add animation class
        themeToggle.classList.add('animate-rotate-in');
        
        // Apply new theme
        applyTheme(newTheme);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            themeToggle.classList.remove('animate-rotate-in');
        }, 1000);
    }
    
    /**
     * Handle system theme changes
     * Automatically updates theme when system preference changes
     */
    function handleSystemThemeChange(e) {
        // Only auto-change if user hasn't manually set a preference
        if (!localStorage.getItem('portfolio-theme')) {
            const systemTheme = e.matches ? THEMES.LIGHT : THEMES.DARK;
            applyTheme(systemTheme);
        }
    }
    
    /**
     * Initialize theme functionality
     * Sets up event listeners and applies initial theme
     */
    function initThemeToggle() {
        // Apply preferred theme on load
        const preferredTheme = getPreferredTheme();
        applyTheme(preferredTheme);
        
        // Add click event listener to theme toggle button
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
            
            // Add keyboard support
            themeToggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: light)');
            colorSchemeQuery.addEventListener('change', handleSystemThemeChange);
        }
        
        console.log('Theme toggle initialized');
    }
    
    /**
     * Add theme transition styles
     * Creates smooth transitions when switching themes
     */
    function addThemeTransitions() {
        const style = document.createElement('style');
        style.textContent = `
            /* Theme transition styles */
            * {
                transition: background-color 0.3s ease, 
                           color 0.3s ease, 
                           border-color 0.3s ease, 
                           box-shadow 0.3s ease !important;
            }
            
            /* Prevent transitions on load */
            body.no-transitions * {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // Remove no-transitions class after a short delay
        setTimeout(() => {
            document.body.classList.remove('no-transitions');
        }, 100);
    }
    
    /**
     * Add accessibility improvements
     * Enhances keyboard navigation and screen reader support
     */
    function improveAccessibility() {
        if (themeToggle) {
            // Add ARIA attributes
            themeToggle.setAttribute('role', 'button');
            themeToggle.setAttribute('tabindex', '0');
            themeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
            
            // Add initial title
            const currentTheme = getPreferredTheme();
            themeToggle.setAttribute('title', `Switch to ${currentTheme === THEMES.DARK ? 'light' : 'dark'} mode`);
        }
    }
    
    /**
     * Add theme indicator to page
     * Creates a visual indicator showing current theme
     */
    function addThemeIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'theme-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--surface-color);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            border: 1px solid var(--border-color);
            opacity: 0.7;
            transition: all 0.3s ease;
            z-index: 1000;
            pointer-events: none;
        `;
        
        // Update indicator text when theme changes
        function updateIndicator() {
            const currentTheme = htmlElement.getAttribute('data-theme') || THEMES.DARK;
            indicator.textContent = currentTheme === THEMES.DARK ? '🌙 Dark' : '☀️ Light';
        }
        
        document.addEventListener('themeChanged', updateIndicator);
        updateIndicator();
        
        // Add hover effect
        indicator.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1.05)';
        });
        
        indicator.addEventListener('mouseleave', function() {
            this.style.opacity = '0.7';
            this.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(indicator);
    }
    
    // Initialize theme functionality
    initThemeToggle();
    addThemeTransitions();
    improveAccessibility();
    
    // Add theme indicator (optional - can be removed if not needed)
    // addThemeIndicator();
    
    // Expose functions for external use
    window.ThemeToggle = {
        toggle: toggleTheme,
        setTheme: applyTheme,
        getCurrentTheme: function() {
            return htmlElement.getAttribute('data-theme') || THEMES.DARK;
        },
        THEMES: THEMES
    };
    
    // Add no-transitions class initially to prevent flash
    document.body.classList.add('no-transitions');
});
