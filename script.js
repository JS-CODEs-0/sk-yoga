document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // Trigger hero animations immediately since intro video is removed
    triggerHeroAnimations();

    // 2. Navbar Scroll Effect & Active Links
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (navMenu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // 4. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If it's a staggered card list, add slight delays
                if (entry.target.classList.contains('animate-card')) {
                    const cards = Array.from(entry.target.parentElement.querySelectorAll('.animate-card'));
                    const index = cards.indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('in-view');
                    }, index * 60);
                } 
                // Images
                else if (entry.target.tagName.toLowerCase() === 'img') {
                    entry.target.classList.add('fade-in-view');
                }
                // Value Strip Icons
                else if (entry.target.classList.contains('animate-scale')) {
                    entry.target.classList.add('scale-in-view');
                }
                // General elements
                else {
                    // Hero text staggering handled by triggerHeroAnimations
                    if (!entry.target.closest('.hero-text')) {
                        entry.target.classList.add('in-view');
                    }
                }
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Grab all elements to animate
    const animateElements = document.querySelectorAll('.animate-element, .animate-card, .animate-scale');
    animateElements.forEach(el => {
        // Don't observe hero elements initially until video finishes
        if (!el.closest('.hero')) {
            observer.observe(el);
        }
    });

    // Function to trigger hero animations with stagger
    function triggerHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero-text .animate-element');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('in-view');
            }, index * 150);
        });
        
        const heroImg = document.querySelector('.hero-image .animate-element');
        if (heroImg) {
            heroImg.classList.add('fade-in-view');
        }
    }

    // 5. Gallery Lightbox
    const masonryItems = document.querySelectorAll('.masonry-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxImg = document.getElementById('lightbox-img');

    if (masonryItems && lightbox && lightboxImg) {
        masonryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                    body.style.overflow = 'hidden';
                }
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            body.style.overflow = '';
        });

        // Close on clicking outside content
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    // 6. View More Practices Toggle
    const viewMoreBtn = document.getElementById('view-more-classes-btn');
    const classesGrid = document.querySelector('.classes-grid');

    if (viewMoreBtn && classesGrid) {
        viewMoreBtn.addEventListener('click', () => {
            const isExpanded = classesGrid.classList.toggle('show-all');
            viewMoreBtn.textContent = isExpanded ? 'View Less Practices' : 'View More Practices';
            
            // If shrinking back, scroll to the top of the classes section smoothly
            if (!isExpanded) {
                const classesSection = document.getElementById('classes');
                if (classesSection) {
                    classesSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
});
