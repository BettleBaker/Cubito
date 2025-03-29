// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3RE82Byf8U5BXQylBmSQbNiD9QUxHm0I",
    authDomain: "cubito-9a323.firebaseapp.com",
    projectId: "cubito-9a323",
    storageBucket: "cubito-9a323.firebasestorage.app",
    messagingSenderId: "669607737596",
    appId: "1:669607737596:web:0b8bc424f8eb2cac9ebf79",
    measurementId: "G-ND7JEJYKRG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const analytics = firebase.analytics();

// Form submission handling
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const cubingLevel = document.getElementById('cubingLevel').value;
    const platformPreference = document.querySelector('input[name="platform-preference"]:checked').value;
    
    try {
        // Add data to Firestore
        await db.collection('signups').add({
            name: name,
            email: email,
            cubingLevel: cubingLevel,
            platformPreference: platformPreference,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Log event to analytics
        analytics.logEvent('signup_completed', {
            cubing_level: cubingLevel,
            platform_preference: platformPreference
        });
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        e.target.reset();
    } catch (error) {
        console.error('Error saving data:', error);
        alert('There was an error submitting the form. Please try again.');
    }
});

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('signupForm');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <h3>Thank You!</h3>
        <p>Your submission has been received. We'll be in touch soon!</p>
    `;
    
    form.innerHTML = '';
    form.appendChild(successMessage);
    
    // Reset form after 5 seconds
    setTimeout(() => {
        location.reload();
    }, 5000);
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    // Initialize aesthetic cube animation
    initCubeAnimation();
    
    // Fix scroll margin for all sections to prevent header overlap
    adjustSectionScrollMargins();
    
    // Add extra offset for hero section to prevent headline hiding
    ensureHeroVisibility();
    
    // Function to ensure hero headline is visible
    function ensureHeroVisibility() {
        const heroSection = document.querySelector('.hero');
        const header = document.querySelector('header');
        const headerHeight = header.offsetHeight;
        const isMobile = window.innerWidth <= 768;
        
        if (heroSection) {
            const heroHeading = heroSection.querySelector('h1');
            if (heroHeading) {
                // Ensure the heading is properly visible below the navbar
                const currentPadding = parseInt(window.getComputedStyle(heroSection).paddingTop);
                
                // Add more padding on mobile devices
                const extraPadding = isMobile ? 50 : 50;
                
                // If padding is not sufficient, adjust it
                if (currentPadding < (headerHeight + extraPadding)) {
                    heroSection.style.paddingTop = (headerHeight + extraPadding) + 'px';
                }
            }
        }
        
        // Also ensure visibility on resize
        window.addEventListener('resize', () => {
            const updatedHeaderHeight = header.offsetHeight;
            const updatedIsMobile = window.innerWidth <= 768;
            const updatedExtraPadding = updatedIsMobile ? 50 : 50;
            
            if (heroSection) {
                const heroHeading = heroSection.querySelector('h1');
                if (heroHeading) {
                    // Adjust padding on resize
                    heroSection.style.paddingTop = (updatedHeaderHeight + updatedExtraPadding) + 'px';
                }
            }
        });
    }
    
    // Function to set proper scroll margins on all sections based on header height
    function adjustSectionScrollMargins() {
        const header = document.querySelector('header');
        const headerHeight = header.offsetHeight;
        const sections = document.querySelectorAll('section');
        
        // Add a buffer to ensure text is not hidden
        const scrollMargin = headerHeight + 30;
        
        sections.forEach(section => {
            section.style.scrollMarginTop = `${scrollMargin}px`;
        });
        
        // Also update when window resizes
        window.addEventListener('resize', () => {
            const updatedHeaderHeight = header.offsetHeight;
            const updatedScrollMargin = updatedHeaderHeight + 30;
            
            sections.forEach(section => {
                section.style.scrollMarginTop = `${updatedScrollMargin}px`;
            });
        });
    }
    
    // Function to initialize and animate the cube with GSAP
    function initCubeAnimation() {
        const heroCube = document.getElementById('hero-cube');
        const cubeGlow = document.querySelector('.cube-glow');
        
        if (!heroCube) return;
        
        // Make sure images are loaded
        if (heroCube.complete) {
            startCubeAnimation();
        } else {
            heroCube.addEventListener('load', startCubeAnimation);
        }
        
        function startCubeAnimation() {
            // Check if GSAP is available for enhanced animations
            if (typeof gsap !== 'undefined') {
                // Enhanced hover effect with GSAP
                const cubeAnimation = document.querySelector('.cube-animation');
                
                cubeAnimation.addEventListener('mousemove', function(e) {
                    const boundingRect = this.getBoundingClientRect();
                    const centerX = boundingRect.left + boundingRect.width / 2;
                    const centerY = boundingRect.top + boundingRect.height / 2;
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;
                    
                    // Calculate rotation based on mouse position
                    const rotateY = ((mouseX - centerX) / (boundingRect.width / 2)) * 15;
                    const rotateX = ((centerY - mouseY) / (boundingRect.height / 2)) * 15;
                    
                    // Apply rotation with GSAP
                    gsap.to(heroCube, {
                        rotateY: rotateY,
                        rotateX: rotateX,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                    
                    // Move glow effect slightly
                    gsap.to(cubeGlow, {
                        x: rotateY * -0.5,
                        y: rotateX * -0.5,
                        duration: 0.8,
                        ease: "power1.out"
                    });
                });
                
                cubeAnimation.addEventListener('mouseleave', function() {
                    // Reset to default position on mouse leave
                    gsap.to(heroCube, {
                        rotateY: 0,
                        rotateX: 0,
                        duration: 1,
                        ease: "elastic.out(1, 0.5)"
                    });
                    
                    gsap.to(cubeGlow, {
                        x: 0,
                        y: 0,
                        duration: 1.2,
                        ease: "elastic.out(1, 0.5)"
                    });
                });
            }
        }
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle hamburger animation
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle.classList.contains('active')) {
                menuToggle.click();
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerHeight - 30, // Increased buffer to 30px
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            header.style.padding = '5px 0';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.padding = '10px 0';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const level = this.querySelector('select').value;
            
            // You would normally send this data to a server
            console.log('Form submitted with:', { name, email, level });
            
            // Show success message
            const formElements = this.querySelectorAll('input, select, button');
            formElements.forEach(el => el.disabled = true);
            
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <h3>Thank you, ${name}!</h3>
                <p>We're excited to have you join the Cubito community.</p>
                <p>We'll be in touch soon at ${email}.</p>
            `;
            
            this.innerHTML = '';
            this.appendChild(successMessage);
        });
        
        // Form Validation Enhancement
        const formInputs = contactForm.querySelectorAll('input, select');
        
        formInputs.forEach(input => {
            // Show validation status on blur
            input.addEventListener('blur', function() {
                validateInput(input);
            });
            
            // Real-time validation while typing
            input.addEventListener('input', function() {
                validateInput(input);
            });
        });
        
        function validateInput(input) {
            // Add your validation logic here
            if (input.value.trim() === '') {
                input.classList.add('invalid');
                input.classList.remove('valid');
            } else {
                input.classList.add('valid');
                input.classList.remove('invalid');
            }
            
            // Additional validation for email
            if (input.type === 'email' && input.value.trim() !== '') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value)) {
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                }
            }
        }
    }
    
    // Animate elements on scroll
    const animateOnScrollElements = document.querySelectorAll('.feature-card, .gallery-item, .testimonial');
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Add animation classes when elements come into view
    function checkVisibility() {
        animateOnScrollElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial style for elements to be animated
    animateOnScrollElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Check visibility on scroll and on initial load
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    checkVisibility();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const isMenuToggle = e.target.closest('#mobile-menu');
        const isNavMenu = e.target.closest('.nav-menu');
        
        if (!isMenuToggle && !isNavMenu && menuToggle && menuToggle.classList.contains('active')) {
            menuToggle.click();
        }
    });
    
    // Better touch support for mobile devices
    const touchElements = document.querySelectorAll('.feature-card, .gallery-item, .testimonial');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, {passive: true});
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, {passive: true});
    });
    
    // Responsive image loading
    function handleResponsiveImages() {
        const viewportWidth = window.innerWidth;
        const imagesToOptimize = document.querySelectorAll('img[data-src]');
        
        imagesToOptimize.forEach(img => {
            if (viewportWidth <= 480) {
                img.src = img.getAttribute('data-src-sm') || img.getAttribute('data-src');
            } else if (viewportWidth <= 768) {
                img.src = img.getAttribute('data-src-md') || img.getAttribute('data-src');
            } else {
                img.src = img.getAttribute('data-src') || img.src;
            }
            
            img.onload = function() {
                img.classList.add('loaded');
            };
        });
    }
    
    // Handle viewport changes for responsive design
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            handleResponsiveImages();
            checkVisibility();
        }, 250);
    });
    
    // Fix for iOS Safari 100vh issue
    function setVhVariable() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    window.addEventListener('resize', setVhVariable);
    window.addEventListener('orientationchange', setVhVariable);
    setVhVariable();
    
    // Premium section animations
    const premiumCard = document.querySelector('.premium-card');
    const priceElement = document.querySelector('.amount');
    
    if (premiumCard) {
        // Add subtle floating animation
        premiumCard.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            // Calculate rotation based on mouse position (limited to small values)
            const rotateX = ((y - rect.height / 2) / rect.height) * 2; // Max 2 degrees
            const rotateY = ((rect.width / 2 - x) / rect.width) * 2;   // Max 2 degrees
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        premiumCard.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
        
        // Price hover effect
        if (priceElement) {
            priceElement.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.transition = 'transform 0.3s ease';
                this.style.color = '#3366ff';
            });
            
            priceElement.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.color = '';
            });
        }
        
        // Intersection Observer for animation when scrolling into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('premium-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(premiumCard);
    }
    
    // Countdown Timer
    const countdownTimer = document.getElementById('countdown-timer');
    
    if (countdownTimer) {
        // Set the countdown date - 3 days from now
        const countdownDate = new Date();
        countdownDate.setDate(countdownDate.getDate() + 2);
        countdownDate.setHours(23, 59, 59, 0);
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countdownDate - now;
            
            // Time calculations
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Display the result
            countdownTimer.innerHTML = `${days} days ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // If the countdown is finished, show expired message
            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownTimer.innerHTML = "EXPIRED";
            }
        }
        
        // Update every second
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
    
    // Exit Intent Detection (for desktop)
    document.addEventListener('mouseleave', function(e) {
        // If mouse leaves through the top of the page
        if (e.clientY < 20 && !sessionStorage.getItem('exitShown')) {
            // Here you would show an exit popup
            console.log('Exit intent detected');
            sessionStorage.setItem('exitShown', 'true');
        }
    });
    
    // Animate numbered statistics
    const animateNumbers = () => {
        const numberElements = document.querySelectorAll('.number-stat');
        
        numberElements.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 2000; // ms
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const counter = setInterval(() => {
                current += step;
                el.textContent = Math.round(current);
                
                if (current >= target) {
                    el.textContent = target.toLocaleString();
                    clearInterval(counter);
                }
            }, 16);
        });
    };
    
    // Observer for statistics animation
    const statsSection = document.querySelector('.trust-indicators');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsSection);
    }
}); 