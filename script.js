document.addEventListener('DOMContentLoaded', () => {
    // Loader
    const loader = document.getElementById('loader');

    // Page load animations
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    });

    // Typing animation
    const typingText = document.querySelector('.typing-text');
    const textToType = typingText.getAttribute('data-text');
    const cursor = typingText.querySelector('.typing-cursor');

    let i = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentText = textToType.substring(0, i);
        typingText.innerHTML = currentText + '<span class="typing-cursor">|</span>';

        if (!isDeleting && i < textToType.length) {
            i++;
            setTimeout(typeWriter, 100);
        } else if (isDeleting && i > 0) {
            i--;
            setTimeout(typeWriter, 50);
        } else if (!isDeleting && i === textToType.length) {
            setTimeout(() => {
                isDeleting = true;
                typeWriter();
            }, 2000);
        } else if (isDeleting && i === 0) {
            isDeleting = false;
            setTimeout(typeWriter, 500);
        }
    }

    setTimeout(typeWriter, 1500);

    // Smooth scroll for scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('main').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Floating particles
    function createParticles() {
        const container = document.getElementById('particles-container');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            createParticle(container);
        }

        setInterval(() => {
            createParticle(container);
        }, 300);
    }

    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';

        const colors = ['#00d4ff', '#ff6b6b', '#4ecdc4'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(particle);

        setTimeout(() => {
            if (particle && particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 8000);
    }

    createParticles();

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Stagger animation for projects
                if (entry.target.classList.contains('project')) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    entry.target.style.animationDelay = delay + 'ms';
                }
            }
        });
    }, observerOptions);

    // Observe all projects
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
        observer.observe(project);
    });

    // Enhanced pagination system
    const projectsContainer = document.querySelector('.projects-grid');
    const projectItems = Array.from(projectsContainer.querySelectorAll('.project'));
    const paginationContainer = document.getElementById('pagination-controls');
    const itemsPerPage = 3;
    const totalProjects = projectItems.length;
    const totalPages = Math.ceil(totalProjects / itemsPerPage);
    let currentPage = 1;

    function displayPage(page, animated = true) {
        currentPage = page;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Hide all projects with animation
        projectItems.forEach((item, index) => {
            if (animated) {
                item.style.transform = 'translateY(20px)';
                item.style.opacity = '0';

                setTimeout(() => {
                    item.style.display = 'none';
                }, 200);
            } else {
                item.style.display = 'none';
            }
        });

        // Show current page projects with staggered animation
        const projectsToShow = projectItems.slice(startIndex, endIndex);

        projectsToShow.forEach((item, index) => {
            setTimeout(() => {
                item.style.display = 'block';

                setTimeout(() => {
                    item.style.transform = 'translateY(0)';
                    item.style.opacity = '1';
                    item.classList.add('animate');
                }, animated ? 100 : 0);
            }, animated ? 300 + (index * 100) : 0);
        });

        setupPaginationControls();

        // Scroll to projects section
        if (animated && page > 1) {
            setTimeout(() => {
                document.querySelector('.projects-grid').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 400);
        }
    }

    function setupPaginationControls() {
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i> Önceki';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                displayPage(currentPage - 1);
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;

            if (i === currentPage) {
                pageButton.classList.add('active');
            }

            pageButton.addEventListener('click', () => {
                if (i !== currentPage) {
                    displayPage(i);
                }
            });

            paginationContainer.appendChild(pageButton);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'Sonraki <i class="fas fa-chevron-right"></i>';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                displayPage(currentPage + 1);
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    // Initialize pagination
    if (totalProjects > 0) {
        displayPage(1, false);
    } else {
        paginationContainer.style.display = 'none';
    }

    // Enhanced project hover effects
    projectItems.forEach(project => {
        const projectIcon = project.querySelector('.project-icon');
        const techTags = project.querySelectorAll('.tech-tag');

        project.addEventListener('mouseenter', () => {
            // Add glow effect
            project.style.boxShadow = '0 20px 60px rgba(0, 212, 255, 0.4)';

            // Animate tech tags
            techTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-3px) scale(1.05)';
                }, index * 50);
            });
        });

        project.addEventListener('mouseleave', () => {
            // Reset effects
            techTags.forEach(tag => {
                tag.style.transform = 'translateY(0) scale(1)';
            });
        });
    });

    // Parallax effect for header
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('header');
        const headerBg = document.querySelector('.header-bg');

        if (header && headerBg) {
            const rate = scrolled * -0.5;
            headerBg.style.transform = `translateY(${rate}px)`;
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);

    // Add smooth transitions to all elements on load
    setTimeout(() => {
        document.body.style.transition = 'all 0.3s ease';
    }, 2000);

    // Mouse trail effect
    let mouseTrail = [];
    const trailLength = 5;

    document.addEventListener('mousemove', (e) => {
        mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

        if (mouseTrail.length > trailLength) {
            mouseTrail.shift();
        }

        // Create trail particles occasionally
        if (Math.random() < 0.1) {
            createTrailParticle(e.clientX, e.clientY);
        }
    });

    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'var(--primary-color)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.style.transition = 'all 0.5s ease-out';
        particle.style.opacity = '0.6';

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.style.transform = 'scale(0)';
            particle.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 500);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentPage > 1) {
            displayPage(currentPage - 1);
        } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
            displayPage(currentPage + 1);
        }
    });

    // Performance optimization: throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
            // Update any scroll-dependent animations here
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
        }, 10);
    });
});

// Add some extra interactive features
window.addEventListener('load', () => {
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.8)';
        img.style.transition = 'all 0.5s ease';

        img.addEventListener('load', () => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        });
    });

    // Add random floating animation to some elements
    const floatingElements = document.querySelectorAll('.project-icon');
    floatingElements.forEach((element, index) => {
        element.style.animation = `float 6s ease-in-out infinite ${index * 0.5}s`;
    });
});

// Add CSS for floating animation
const floatingKeyframes = `
@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-5px) rotate(1deg); }
    66% { transform: translateY(5px) rotate(-1deg); }
}
`;

const style = document.createElement('style');
style.textContent = floatingKeyframes;
document.head.appendChild(style);
