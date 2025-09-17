// Main JavaScript file for Virtual Japan Travel Journal
// Using ES6+ features for modern web development

// Global functions for HTML onclick handlers - defined early
window.scrollToSection = function(sectionId) {
    if (window.japanApp) {
        window.japanApp.scrollToSection(sectionId);
    }
}

window.changeSlide = function(direction) {
    if (window.japanApp) {
        window.japanApp.changeSlide(direction);
    }
}

window.openModal = function(modalKey) {
    if (window.japanApp) {
        window.japanApp.openModal(modalKey);
    }
}

window.closeModal = function() {
    if (window.japanApp) {
        window.japanApp.closeModal();
    }
}

window.sendEmail = function() {
    if (window.japanApp) {
        window.japanApp.sendEmail();
    }
}

class JapanTravelApp {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.modalData = {
            'about': {
                title: 'About This Journey',
                content: 'This virtual travel journal captures the essence of Japan through Happy Moon\'s perspective. Each section represents different adventures, filled with discoveries, cultural insights, and unforgettable moments under the beautiful strawberry moon.',
                images: []
            },
            'tokyo-details': {
                title: 'Tokyo Anime Paradise',
                content: 'Tokyo was absolutely incredible! As an anime lover, I was in heaven exploring Akihabara\'s electronic district and all the anime shops. The shopping malls are endless - from trendy Harajuku fashion to the latest tech gadgets. The neon lights of Shibuya crossing and the energy of this city never stops amazing me. Tokyo truly is the ultimate destination for anime culture and modern Japanese life!',
                images: ['https://images.unsplash.com/photo-1730386114645-1548682d1577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMG5pZ2h0JTIwc2t5bGluZSUyMG5lb258ZW58MXx8fHwxNzU3OTY3ODk1fDA&ixlib=rb-4.0.3&q=80&w=1080']
            },
            'kyoto-details': {
                title: 'Kyoto Cultural Experience',
                content: 'Kyoto was magical! I visited the stunning Kiyomizu-dera Temple with its wooden stage overlooking the city, and walked through the thousands of red torii gates at Fushimi Inari Shrine - it felt like stepping into a dream. Dressing up in traditional kimono was such a special experience, and the tea ceremony with authentic matcha was so peaceful and beautiful. Kyoto truly captures the soul of traditional Japan!',
                images: ['https://images.unsplash.com/photo-1652570935291-aff73d44b1f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreW90byUyMHRlbXBsZSUyMHRyYWRpdGlvbmFsfGVufDF8fHx8MTc1NzkyMjYxM3ww&ixlib=rb-4.0.3&q=80&w=1080']
            },
            'kyoto-temples': {
                title: '🏯 Kiyomizu-dera & Fushimi Inari',
                content: 'These two iconic sites were absolutely breathtaking!<br><br><strong>Kiyomizu-dera Temple:</strong><br>• The wooden stage offers incredible panoramic views of Kyoto<br>• Built without nails - an architectural marvel<br>• The temple\'s name means "pure water" from the nearby waterfall<br><br><strong>Fushimi Inari Shrine:</strong><br>• Thousands of red torii gates create magical tunnels<br>• Each gate is donated by individuals or companies<br>• The hike up the mountain is both spiritual and scenic<br><br>Both places felt like stepping into a different world!',
                images: ['https://images.unsplash.com/photo-1652570935291-aff73d44b1f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreW90byUyMHRlbXBsZSUyMHRyYWRpdGlvbmFsfGVufDF8fHx8MTc1NzkyMjYxM3ww&ixlib=rb-4.0.3&q=80&w=1080']
            },
            'kyoto-tea': {
                title: '🍵 Tea Ceremony',
                content: 'Dressing up in traditional kimono was such a special experience!<br><br><strong>Tea Ceremony:</strong><br>• Participated in an authentic matcha tea ceremony<br>• Learned the proper way to prepare and drink matcha<br>• The peaceful ritual was so meditative and beautiful<br>• Tasted traditional wagashi sweets that complemented the tea perfectly<br><br>It was like stepping back in time to experience traditional Japan!',
                images: ['assets/matcha.jpg']
            },
            'kyoto-geisha': {
                title: '👘 Kimono Experience',
                content: 'Kyoto\'s traditional culture is absolutely mesmerizing!<br><br><strong>Kimono Experience:</strong><br>• Wore a beautiful traditional kimono with obi belt<br>• Learned about the intricate dressing process<br>• Felt so elegant walking through the historic streets<br><br>Kyoto truly preserves the soul of traditional Japan!',
                images: ['assets/kimono.jpg']
            },
            'gallery-1': {
                title: 'Nara Deer',
                content: 'Nara Deer are famous for their friendly nature and playful behavior.',
                images: ['assets/nara.jpg']
            },
            'gallery-2': {
                title: 'Mount Fuji',
                content: 'Japan\'s iconic symbol stands majestically, Mount Fuji\'s beauty is breathtaking. Whether viewed from afar or up close, this sacred mountain radiates a peaceful power.',
                images: ['assets/fuji.jpg']
            },
            'gallery-3': {
                title: 'Pokemon Center',
                content: 'Pokemon Center is a must-visit for any Pokemon fan, it\'s a great place to buy Pokemon merchandise and collectibles.',
                images: ['assets/pokemon.jpg']
            }
        };

        this.init();
    }

     init() {
         this.setupEventListeners();
         this.initializeCarousel();
        this.setupVideo();
        this.setupMobileMenu();
        this.setupNavbarScroll();
        this.ensureModalHidden();
     }


    // Ensure modal is hidden on page load
    ensureModalHidden() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
        }
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.updateActiveNavLink(targetId);
            });
        });

         // Modal close events
         const modal = document.getElementById('modal');
         if (modal) {
             modal.addEventListener('click', (e) => {
                 if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-close')) {
                     this.closeModal();
                 }
             });
         }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // Navigation Functions
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            // Get the actual navbar height dynamically
            const navbar = document.getElementById('navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 60;
            const offsetTop = element.offsetTop - navbarHeight+10; 
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNavLink(activeId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

     // Carousel Functions
     initializeCarousel() {
         this.slides = document.querySelectorAll('.carousel-item');
         if (this.slides.length > 0) {
             this.showSlide(0);
             // Auto-play carousel
             setInterval(() => {
                 this.changeSlide(1);
             }, 5000);
         }
     }

    changeSlide(direction) {
        this.currentSlide += direction;

        if (this.currentSlide >= this.slides.length) {
            this.currentSlide = 0;
        } else if (this.currentSlide < 0) {
            this.currentSlide = this.slides.length - 1;
        }

        this.showSlide(this.currentSlide);
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

     // Modal Functions
     openModal(modalKey) {
         const modal = document.getElementById('modal');
         const modalTitle = document.getElementById('modalTitle');
         const modalText = document.getElementById('modalText');
         const modalImages = document.getElementById('modalImages');

         const data = this.modalData[modalKey];
         if (data) {
             modalTitle.textContent = data.title;
             modalText.innerHTML = data.content;

             // Clear previous images
             modalImages.innerHTML = '';

             // Add images if available
             if (data.images && data.images.length > 0) {
                 data.images.forEach(imageSrc => {
                     const img = document.createElement('img');
                     img.src = imageSrc;
                     img.alt = data.title;
                     img.style.width = '100%';
                     img.style.height = '200px';
                     img.style.objectFit = 'cover';
                     img.style.borderRadius = '0.25rem';
                     img.style.marginBottom = '1rem';
                     modalImages.appendChild(img);
                 });
             }

             modal.style.display = 'flex';
             modal.classList.add('active');
             document.body.style.overflow = 'hidden';
         }
     }

     closeModal() {
         const modal = document.getElementById('modal');
         modal.style.display = 'none';
         modal.classList.remove('active');
         document.body.style.overflow = 'auto';
     }



    // Video Setup
    setupVideo() {
        const video = document.getElementById('travelVideo');
        if (video) {
            // Add video event listeners
            video.addEventListener('loadstart', () => {
                // Video loading started
            });

            video.addEventListener('canplay', () => {
                // Video can start playing
            });

            video.addEventListener('error', (e) => {
                // Video error occurred
                // Show placeholder if video fails to load
                 const container = video.parentElement;
                 container.innerHTML = `
                     <div class="video-placeholder">
                         <div class="play-icon">▶️</div>
                         <p>Video is loading...</p>
                         <p class="video-subtitle">Amazing moments from Japan journey</p>
                     </div>
                 `;
            });
        }
    }

    // Mobile Menu
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                });
            });
        }
    }

    // Navbar Scroll Effect
    setupNavbarScroll() {
        const navbar = document.getElementById('navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // More sensitive scroll detection for navbar resizing
            if (currentScrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Update active navigation link based on scroll position
            this.updateActiveNavOnScroll();

            lastScrollY = currentScrollY;
        });
    }

    updateActiveNavOnScroll() {
        const sections = ['hero', 'tokyo', 'kyoto', 'osaka', 'gallery', 'contact'];
        // Get the actual navbar height dynamically
        const navbar = document.getElementById('navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 60;
        const scrollPos = window.scrollY + navbarHeight + 50; // Add buffer for better detection

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section && section.offsetTop <= scrollPos) {
                this.updateActiveNavLink(sections[i]);
                break;
            }
        }
    }

     // Email Function
     sendEmail() {
         const email = 'happymoon@example.com';
         const subject = 'Questions about Japan Travel';
         const body = 'Hello Happy Moon!\n\nI\'m interested in your Japan travel journal and would like to learn more about...';

         const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
         window.open(mailtoLink);
     }

    // Utility Functions
    handleResize() {
        // Handle responsive adjustments
    }

    // Public API for global functions
    static scrollToSection(sectionId) {
        if (window.japanApp) {
            window.japanApp.scrollToSection(sectionId);
        }
    }

    static changeSlide(direction) {
        if (window.japanApp) {
            window.japanApp.changeSlide(direction);
        }
    }

    static openModal(modalKey) {
        if (window.japanApp) {
            window.japanApp.openModal(modalKey);
        }
    }

    static closeModal() {
        if (window.japanApp) {
            window.japanApp.closeModal();
        }
    }

    static sendEmail() {
        if (window.japanApp) {
            window.japanApp.sendEmail();
        }
    }
}


 // Initialize the application immediately
 window.japanApp = new JapanTravelApp();

 // Also initialize when DOM is loaded (as backup)
 document.addEventListener('DOMContentLoaded', () => {
     if (!window.japanApp) {
         window.japanApp = new JapanTravelApp();
     }
     
     // Add loading animation
     document.body.classList.add('loaded');
 });

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
    } else {
        // Resume animations when page becomes visible
    }
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                // Service Worker registered successfully
            })
            .catch(registrationError => {
                // Service Worker registration failed
            });
    });
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JapanTravelApp;
}
