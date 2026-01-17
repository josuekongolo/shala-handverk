/**
 * Shala Håndverk AS - Main JavaScript
 * Professional Carpentry Website
 */

(function() {
    'use strict';

    // ================================================
    // Mobile Menu Toggle
    // ================================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ================================================
    // Header Scroll Effect
    // ================================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ================================================
    // Smooth Scroll for Anchor Links
    // ================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const target = document.querySelector(targetId);

            if (target) {
                e.preventDefault();

                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================================
    // Contact Form Handling
    // ================================================
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Hide any existing messages
            if (successMessage) successMessage.classList.remove('show');
            if (errorMessage) errorMessage.classList.remove('show');

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim(),
                projectType: document.getElementById('projectType').value,
                description: document.getElementById('description').value.trim(),
                wantSiteVisit: document.getElementById('siteVisit').checked
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.phone || !formData.projectType || !formData.description) {
                alert('Vennligst fyll ut alle obligatoriske felter.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Vennligst oppgi en gyldig e-postadresse.');
                return;
            }

            // Disable submit button and show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Sender...</span>';

            try {
                // For now, simulate form submission
                // In production, this would send to Resend API or backend
                await simulateFormSubmission(formData);

                // Show success message
                if (successMessage) {
                    successMessage.classList.add('show');
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                // Reset form
                contactForm.reset();

            } catch (error) {
                console.error('Form submission error:', error);

                // Show error message
                if (errorMessage) {
                    errorMessage.classList.add('show');
                    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }

    // Simulate form submission (replace with actual API call in production)
    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            console.log('Form data submitted:', data);

            // Simulate network delay
            setTimeout(() => {
                // Simulate success (in production, handle actual response)
                resolve({ success: true });
            }, 1500);
        });
    }

    // ================================================
    // Form Input Validation Feedback
    // ================================================
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });

        input.addEventListener('input', function() {
            // Remove error state on input
            this.classList.remove('error');
        });
    });

    function validateInput(input) {
        const value = input.value.trim();
        const isRequired = input.hasAttribute('required');

        if (isRequired && !value) {
            input.classList.add('error');
            return false;
        }

        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                input.classList.add('error');
                return false;
            }
        }

        input.classList.remove('error');
        return true;
    }

    // ================================================
    // Lazy Loading Images (Intersection Observer)
    // ================================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Add fade-in effect
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';

                    img.onload = function() {
                        img.style.opacity = '1';
                    };

                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ================================================
    // Scroll to Top on Page Load (for hash links)
    // ================================================
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);

        if (target) {
            setTimeout(() => {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // ================================================
    // Accessibility: Focus Management
    // ================================================
    // Add focus visible class for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('user-is-tabbing');
    });

    // ================================================
    // Service Cards Animation on Scroll
    // ================================================
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.service-card, .feature-item, .value-card, .project-card');

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            animationObserver.observe(el);
        });
    }

    // ================================================
    // Phone Number Click Tracking (Analytics Ready)
    // ================================================
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Analytics tracking placeholder
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Call',
                    'value': this.href
                });
            }
            console.log('Phone click tracked:', this.href);
        });
    });

    // ================================================
    // Email Link Click Tracking (Analytics Ready)
    // ================================================
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Analytics tracking placeholder
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Email',
                    'value': this.href
                });
            }
            console.log('Email click tracked:', this.href);
        });
    });

    // ================================================
    // Console Welcome Message
    // ================================================
    console.log('%cShala Håndverk AS', 'font-size: 24px; font-weight: bold; color: #2C3E50;');
    console.log('%cKvalitetshåndverk i Sandefjord', 'font-size: 14px; color: #3498A2;');
    console.log('Website developed with care. Contact us at post@shalahandverk.no');

})();
