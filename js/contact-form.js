/**
 * Contact Form Functionality
 * Handles form validation, submission, and user feedback
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Get DOM elements
    const contactForm = document.querySelector('.contact-form');
    const formInputs = contactForm ? contactForm.querySelectorAll('input, textarea') : [];
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
    
    // Form configuration
    const FORM_CONFIG = {
        debounceDelay: 300,
        validationRules: {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid name (letters only, min 2 characters)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            subject: {
                required: true,
                minLength: 5,
                message: 'Subject must be at least 5 characters long'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Message must be between 10 and 1000 characters'
            }
        }
    };
    
    /**
     * Validate individual form field
     * @param {HTMLInputElement|HTMLTextAreaElement} field - The field to validate
     * @returns {Object} - Validation result with isValid and message properties
     */
    function validateField(field) {
        const fieldName = field.name;
        const fieldValue = field.value.trim();
        const rules = FORM_CONFIG.validationRules[fieldName];
        
        if (!rules) {
            return { isValid: true, message: '' };
        }
        
        // Check if field is required and empty
        if (rules.required && !fieldValue) {
            return { isValid: false, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` };
        }
        
        // Check minimum length
        if (rules.minLength && fieldValue.length < rules.minLength) {
            return { isValid: false, message: rules.message };
        }
        
        // Check maximum length
        if (rules.maxLength && fieldValue.length > rules.maxLength) {
            return { isValid: false, message: rules.message };
        }
        
        // Check pattern
        if (rules.pattern && !rules.pattern.test(fieldValue)) {
            return { isValid: false, message: rules.message };
        }
        
        return { isValid: true, message: '' };
    }
    
    /**
     * Show validation feedback for a field
     * @param {HTMLInputElement|HTMLTextAreaElement} field - The field to show feedback for
     * @param {boolean} isValid - Whether the field is valid
     * @param {string} message - Validation message to display
     */
    function showFieldFeedback(field, isValid, message) {
        // Remove existing feedback
        const existingFeedback = field.parentNode.querySelector('.field-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Update field styling
        field.classList.remove('valid', 'invalid');
        field.classList.add(isValid ? 'valid' : 'invalid');
        
        // Add feedback message if invalid
        if (!isValid && message) {
            const feedbackElement = document.createElement('div');
            feedbackElement.className = 'field-feedback';
            feedbackElement.textContent = message;
            feedbackElement.style.cssText = `
                color: var(--error-color);
                font-size: 0.875rem;
                margin-top: 0.5rem;
                animation: fadeIn 0.3s ease-out;
            `;
            
            field.parentNode.appendChild(feedbackElement);
        }
    }
    
    /**
     * Validate entire form
     * @returns {boolean} - True if form is valid
     */
    function validateForm() {
        let isFormValid = true;
        
        formInputs.forEach(input => {
            const validation = validateField(input);
            showFieldFeedback(input, validation.isValid, validation.message);
            
            if (!validation.isValid) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    /**
     * Handle real-time field validation
     * Validates fields as user types with debouncing
     */
    function setupRealTimeValidation() {
        const debounceTimers = {};
        
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                const fieldName = input.name;
                
                // Clear existing timer
                if (debounceTimers[fieldName]) {
                    clearTimeout(debounceTimers[fieldName]);
                }
                
                // Set new timer for validation
                debounceTimers[fieldName] = setTimeout(() => {
                    if (input.value.trim()) {
                        const validation = validateField(input);
                        showFieldFeedback(input, validation.isValid, validation.message);
                    }
                }, FORM_CONFIG.debounceDelay);
            });
            
            // Validate on blur
            input.addEventListener('blur', function() {
                const validation = validateField(input);
                showFieldFeedback(input, validation.isValid, validation.message);
            });
        });
    }
    
    /**
     * Show form submission message
     * @param {string} type - 'success' or 'error'
     * @param {string} message - Message to display
     */
    function showFormMessage(type, message) {
        // Remove existing message
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        
        // Add to form
        contactForm.appendChild(messageElement);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
    
    /**
     * Simulate form submission
     * In a real application, this would send data to a server
     * @param {FormData} formData - The form data to submit
     */
    async function submitForm(formData) {
        // Show loading state
        contactForm.classList.add('loading');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulate successful submission
            const response = { success: true, message: 'Message sent successfully!' };
            
            if (response.success) {
                showFormMessage('success', response.message);
                contactForm.reset();
                
                // Clear validation states
                formInputs.forEach(input => {
                    input.classList.remove('valid', 'invalid');
                });
                
                // Trigger success animation
                contactForm.classList.add('animate-bounce-in');
                setTimeout(() => {
                    contactForm.classList.remove('animate-bounce-in');
                }, 1000);
                
            } else {
                showFormMessage('error', response.message || 'Failed to send message. Please try again.');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('error', 'An error occurred. Please try again later.');
        } finally {
            // Remove loading state
            contactForm.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    }
    
    /**
     * Handle form submission
     * Validates form and submits if valid
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            // Shake animation for invalid form
            contactForm.classList.add('animate-shake');
            setTimeout(() => {
                contactForm.classList.remove('animate-shake');
            }, 500);
            
            // Focus first invalid field
            const firstInvalid = contactForm.querySelector('.invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            
            return;
        }
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        console.log('Form data:', formObject);
        
        // Submit form
        submitForm(formData);
    }
    
    /**
     * Add character counter for message field
     * Shows remaining characters as user types
     */
    function setupCharacterCounter() {
        const messageField = document.querySelector('#message');
        if (!messageField) return;
        
        const maxLength = FORM_CONFIG.validationRules.message.maxLength;
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-top: 0.5rem;
        `;
        
        messageField.parentNode.appendChild(counter);
        
        // Update counter on input
        function updateCounter() {
            const remaining = maxLength - messageField.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 50) {
                counter.style.color = 'var(--error-color)';
            } else if (remaining < 100) {
                counter.style.color = 'var(--accent-color)';
            } else {
                counter.style.color = 'var(--text-secondary)';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Initial update
    }
    
    /**
     * Add accessibility improvements
     * Enhances form for screen readers and keyboard navigation
     */
    function improveAccessibility() {
        formInputs.forEach(input => {
            // Add aria-required for required fields
            if (FORM_CONFIG.validationRules[input.name]?.required) {
                input.setAttribute('aria-required', 'true');
            }
            
            // Add aria-describedby for error messages
            const feedbackId = `${input.name}-feedback`;
            input.setAttribute('aria-describedby', feedbackId);
            
            // Update existing feedback elements with proper IDs
            const feedback = input.parentNode.querySelector('.field-feedback');
            if (feedback) {
                feedback.id = feedbackId;
                feedback.setAttribute('role', 'alert');
            }
        });
        
        // Add form submission status for screen readers
        const statusElement = document.createElement('div');
        statusElement.setAttribute('aria-live', 'polite');
        statusElement.setAttribute('aria-atomic', 'true');
        statusElement.className = 'sr-only';
        statusElement.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        
        contactForm.appendChild(statusElement);
        
        // Update status when form messages are shown
        const originalShowFormMessage = showFormMessage;
        showFormMessage = function(type, message) {
            originalShowFormMessage(type, message);
            statusElement.textContent = message;
        };
    }
    
    /**
     * Add custom styles for form validation
     * Creates dynamic styles for valid/invalid states
     */
    function addFormStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            /* Form validation styles */
            .form-group input:valid,
            .form-group textarea:valid {
                border-color: var(--success-color);
            }
            
            .form-group input:invalid:not(:placeholder-shown),
            .form-group textarea:invalid:not(:placeholder-shown) {
                border-color: var(--error-color);
            }
            
            .form-group input.valid,
            .form-group textarea.valid {
                border-color: var(--success-color);
                box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
            }
            
            .form-group input.invalid,
            .form-group textarea.invalid {
                border-color: var(--error-color);
                box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
            }
            
            /* Focus styles */
            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            }
            
            /* Loading state */
            .contact-form.loading {
                opacity: 0.7;
                pointer-events: none;
            }
            
            /* Field feedback animation */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    /**
     * Initialize contact form functionality
     * Sets up event listeners and form features
     */
    function initContactForm() {
        if (!contactForm) {
            console.log('Contact form not found');
            return;
        }
        
        // Setup form features
        setupRealTimeValidation();
        setupCharacterCounter();
        improveAccessibility();
        addFormStyles();
        
        // Add form submission handler
        contactForm.addEventListener('submit', handleFormSubmit);
        
        console.log('Contact form initialized');
    }
    
    // Initialize contact form when DOM is ready
    initContactForm();
    
    // Expose form functions for external use
    window.ContactForm = {
        validate: validateForm,
        submit: function() {
            const formData = new FormData(contactForm);
            submitForm(formData);
        },
        reset: function() {
            contactForm.reset();
            formInputs.forEach(input => {
                input.classList.remove('valid', 'invalid');
            });
        }
    };
});
