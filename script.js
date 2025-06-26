// ===== DOM CONTENT LOADED ===== 
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTS ===== 
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    const contactForm = document.getElementById('contactForm');
    const sections = document.querySelectorAll('section[id]');
    
    // ===== HAMBURGER MENU FUNCTIONALITY ===== 
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
    
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Event listeners for hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when nav link is clicked (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu when clicking outside (mobile)
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // ===== SMOOTH SCROLLING ===== 
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = header.offsetHeight;
            const elementPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            if (target === '#' || target === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                smoothScrollTo(target);
            }
        });
    });
    
    // ===== STICKY NAVIGATION & ACTIVE SECTION ===== 
    function updateNavigation() {
        const scrollPosition = window.scrollY + header.offsetHeight + 50;
        
        // Add scrolled class to header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active navigation link
        let current = 'home';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Special case for top of page
        if (window.scrollY < 100) {
            current = 'home';
        }
        
        // Update active link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ===== SCROLL ANIMATIONS ===== 
    function animateOnScroll() {
        const animateElements = document.querySelectorAll(
            '.section-title, .about-content, .skills-category, .project-card, .contact-form-container, .contact-info'
        );
        
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, options);
        
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // ===== FORM VALIDATION & SUBMISSION ===== 
    function validateForm(formData) {
        const errors = [];
        
        // Required fields validation
        if (!formData.name.trim()) {
            errors.push('Imię i nazwisko jest wymagane');
        }
        
        if (!formData.email.trim()) {
            errors.push('Email jest wymagany');
        } else if (!isValidEmail(formData.email)) {
            errors.push('Wprowadź poprawny adres email');
        }
        
        if (!formData.message.trim()) {
            errors.push('Wiadomość jest wymagana');
        } else if (formData.message.trim().length < 10) {
            errors.push('Wiadomość musi mieć co najmniej 10 znaków');
        }
        
        return errors;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFormMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message--${type}`;
        messageElement.innerHTML = `
            <p>${message}</p>
            <button type="button" class="message-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles for form message
        if (!document.querySelector('#form-message-styles')) {
            const styles = document.createElement('style');
            styles.id = 'form-message-styles';
            styles.textContent = `
                .form-message {
                    padding: 1rem;
                    margin-bottom: 1rem;
                    border-radius: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1rem;
                    animation: slideIn 0.3s ease;
                }
                .form-message--success {
                    background-color: rgba(100, 255, 218, 0.1);
                    border: 1px solid var(--accent-color);
                    color: var(--accent-color);
                }
                .form-message--error {
                    background-color: rgba(255, 100, 100, 0.1);
                    border: 1px solid #ff6464;
                    color: #ff6464;
                }
                .form-message p {
                    margin: 0;
                    flex: 1;
                }
                .message-close {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Insert message at the beginning of the form
        contactForm.insertBefore(messageElement, contactForm.firstChild);
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentElement) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }
    
    function setFormLoading(isLoading) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        if (isLoading) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            inputs.forEach(input => input.disabled = true);
        } else {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            inputs.forEach(input => input.disabled = false);
        }
    }
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: this.name.value,
                email: this.email.value,
                subject: this.subject.value,
                message: this.message.value
            };
            
            // Validate form
            const errors = validateForm(formData);
            
            if (errors.length > 0) {
                showFormMessage(
                    'Błędy w formularzu:<br>• ' + errors.join('<br>• '),
                    'error'
                );
                return;
            }
            
            // Show loading state
            setFormLoading(true);
            
            // Simulate form submission (since there's no backend)
            setTimeout(() => {
                setFormLoading(false);
                
                // Show success message
                showFormMessage(
                    `Dziękuję za wiadomość, ${formData.name}! Odpowiem najszybciej jak to możliwe.`,
                    'success'
                );
                
                // Reset form
                contactForm.reset();
                
                // Log form data to console for demo purposes
                console.log('Dane formularza:', formData);
                
            }, 2000); // 2 second delay to simulate network request
        });
        
        // Real-time validation feedback
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                clearInputError(this);
            });
        });
    }
    
    function validateInput(input) {
        const value = input.value.trim();
        const isRequired = input.hasAttribute('required');
        
        clearInputError(input);
        
        if (isRequired && !value) {
            showInputError(input, 'To pole jest wymagane');
            return false;
        }
        
        if (input.type === 'email' && value && !isValidEmail(value)) {
            showInputError(input, 'Wprowadź poprawny adres email');
            return false;
        }
        
        if (input.name === 'message' && value && value.length < 10) {
            showInputError(input, 'Wiadomość musi mieć co najmniej 10 znaków');
            return false;
        }
        
        return true;
    }
    
    function showInputError(input, message) {
        input.style.borderColor = '#ff6464';
        
        let errorElement = input.parentElement.querySelector('.input-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'input-error';
            errorElement.style.cssText = `
                color: #ff6464;
                font-size: 0.85rem;
                margin-top: 0.25rem;
                display: block;
            `;
            input.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    function clearInputError(input) {
        input.style.borderColor = '';
        const errorElement = input.parentElement.querySelector('.input-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // ===== UTILITY FUNCTIONS ===== 
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ===== EVENT LISTENERS ===== 
    
    // Scroll events with debouncing for performance
    const debouncedUpdateNav = debounce(updateNavigation, 10);
    window.addEventListener('scroll', debouncedUpdateNav);
    
    // Resize events
    window.addEventListener('resize', function() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 767) {
            closeMobileMenu();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
        
        // Navigate with arrow keys in desktop menu
        if (e.target.classList.contains('nav-link')) {
            const currentIndex = Array.from(navLinks).indexOf(e.target);
            let nextIndex;
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                nextIndex = currentIndex > 0 ? currentIndex - 1 : navLinks.length - 1;
                navLinks[nextIndex].focus();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                nextIndex = currentIndex < navLinks.length - 1 ? currentIndex + 1 : 0;
                navLinks[nextIndex].focus();
            }
        }
    });
    
    // ===== PERFORMANCE OPTIMIZATIONS ===== 
    
    // Lazy load images when they come into view
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // ===== INITIALIZATION ===== 
    
    // Initialize scroll animations
    animateOnScroll();
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Set initial navigation state
    updateNavigation();
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
    
    // Console welcome message
    console.log(`
    🚀 Portfolio Website Loaded Successfully!
    
    ✅ Features Active:
    • Responsive Navigation
    • Smooth Scrolling  
    • Form Validation
    • Scroll Animations
    • Mobile Menu
    • Accessibility Support
    
    💻 Frontend Developer Portfolio
    Built with HTML5, CSS3, Vanilla JavaScript
    `);
    
    // ===== ANALYTICS & TRACKING (Optional) ===== 
    
    // Track section views for analytics
    function trackSectionView(sectionId) {
        // Here you would integrate with Google Analytics or other tracking service
        console.log(`Section viewed: ${sectionId}`);
    }
    
    // Track form interactions
    if (contactForm) {
        contactForm.addEventListener('focus', function(e) {
            if (e.target.matches('input, textarea')) {
                console.log(`Form field focused: ${e.target.name}`);
            }
        }, true);
    }
    
    // Track button clicks
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn, .hero-cta, .project-link')) {
            console.log(`Button clicked: ${e.target.textContent.trim()}`);
        }
    });
    
    // ===== ERROR HANDLING ===== 
    
    // Global error handler
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        
        // You could send this to an error tracking service
        // trackError(e.error);
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        e.preventDefault();
    });
    
});
// ===== EXTERNAL UTILITIES ===== 
// Utility function to check if user prefers reduced motion
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
// Utility function to get current section
function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    for (let section of sections) {
        if (scrollPosition >= section.offsetTop && 
            scrollPosition < section.offsetTop + section.offsetHeight) {
            return section.id;
        }
    }
    return 'home';
}
// Utility function to smoothly scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
// Export utilities for external use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentSection,
        scrollToTop,
        prefersReducedMotion
    };
}