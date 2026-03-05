document.addEventListener('DOMContentLoaded', () => {
    // 0. Page Transitions Logic
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);

    // Intercept links for smooth exit transition
    document.querySelectorAll('a').forEach(link => {
        const isInternal = link.hostname === window.location.hostname;
        const isMailOrTel = link.href.includes('mailto:') || link.href.includes('tel:');
        const isNewTab = link.target === '_blank';
        const isSamePageAnchor = link.pathname === window.location.pathname && link.hash;

        if (isInternal && !isMailOrTel && !isNewTab && !isSamePageAnchor) {
            link.addEventListener('click', e => {
                const targetUrl = link.href;
                if (!targetUrl.includes('javascript:')) {
                    e.preventDefault();
                    document.body.classList.add('page-exit');
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 400);
                }
            });
        }
    });

    // 1. Mobile Menu Drawer
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');

    window.toggleMenu = function () {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : '';
    }

    // 2. Sticky Header with Premium Glassmorphism
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Parallax effect on hero shapes
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            shape.style.transform = `translateY(${window.scrollY * speed}px) rotate(${window.scrollY * speed * 0.5}deg)`;
        });
    });

    // 3. Smooth Scroll Reveal (More fluid in 2026)
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            // Staggering effect for children
            const children = entry.target.querySelectorAll('.stagger');
            children.forEach((child, idx) => {
                setTimeout(() => {
                    child.classList.add('active');
                }, idx * 100);
            });
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // 4. Product Filtering with Smooth Animations
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                card.style.transform = 'scale(0.9)';
                card.style.opacity = '0';

                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 300);
            });
        });
    });

    // 5. FAQ Accordion with Dynamic Height
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(faq => faq.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 6. Modal Logic
    window.openModal = function (modalId, context = '') {
        const targetModal = document.getElementById(modalId);
        if (targetModal) {
            targetModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (context) {
                if (targetModal.querySelector('#modal-title')) {
                    targetModal.querySelector('#modal-title').textContent = context.includes('Consultar') ? context : 'Agendar: ' + context;
                }
                if (targetModal.querySelector('#modal-context')) {
                    targetModal.querySelector('#modal-context').value = context;
                }
            }
        }
    }

    window.closeModal = function (modalId) {
        const targetModal = document.getElementById(modalId);
        if (targetModal) {
            targetModal.classList.remove('active');
            document.body.style.overflow = '';

            const form = targetModal.querySelector('form');
            if (form) form.reset();

            if (targetModal.querySelector('#modal-title')) {
                targetModal.querySelector('#modal-title').textContent = 'Agendar evaluación';
            }
        }
    }

    // 6.1 Product Detail Modal Logic
    window.openProductDetail = function (image, title, description) {
        const modal = document.getElementById('productDetailsModal');
        if (modal) {
            modal.querySelector('#detail-image').src = image;
            modal.querySelector('#detail-title').textContent = title;
            modal.querySelector('#detail-description').textContent = description;

            // Quote button
            const quoteBtn = modal.querySelector('#detail-quote-btn');
            if (quoteBtn) {
                quoteBtn.onclick = () => {
                    window.closeModal('productDetailsModal');
                    window.openModal('agendarModal', 'Cotizar: ' + title);
                };
            }

            // WhatsApp button
            const waBtn = modal.querySelector('#detail-whatsapp-btn');
            if (waBtn) {
                const message = encodeURIComponent(`Hola Sleep Better, me gustaría solicitar una cotización para el producto: ${title}. ¿Podrían brindarme más información?`);
                waBtn.href = `https://wa.me/18099608092?text=${message}`;
            }

            window.openModal('productDetailsModal');
        }
    }

    window.quoteProduct = function (title) {
        const message = encodeURIComponent(`Hola Sleep Better, me gustaría solicitar una cotización para el producto: ${title}. ¿Podrían brindarme más información?`);
        window.open(`https://wa.me/18099608092?text=${message}`, '_blank');
    }

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            window.closeModal(e.target.id);
        }
    });

    // 7. Premium 2026 Tilt Effect for Cards
    const tiltCards = document.querySelectorAll('.service-card, .product-card, .symptom-card, .contact-method');

    // Only apply on desktop
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Calculate rotation (inverted for natural feel)
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

                // Add metallic sheen effect if not exists
                let sheen = card.querySelector('.sheen');
                if (!sheen) {
                    sheen = document.createElement('div');
                    sheen.classList.add('sheen');
                    card.appendChild(sheen);
                }

                const percentageX = (x / rect.width) * 100;
                const percentageY = (y / rect.height) * 100;
                sheen.style.background = `radial-gradient(circle at ${percentageX}% ${percentageY}%, rgba(255,255,255,0.2) 0%, transparent 60%)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
                card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';

                const sheen = card.querySelector('.sheen');
                if (sheen) sheen.style.background = 'transparent';
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none'; // remove transition for smooth tracking
            });
        });
    }

    // 8. Sleep Themed "Zzz" Emoji Background
    const canvas = document.getElementById('product-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: false });
        const section = document.getElementById('productos');

        let width, height;
        let particles = [];
        let mouse = { x: -1000, y: -1000, active: false };
        let currentMouse = { x: -1000, y: -1000 };

        function resize() {
            if (!section) return;
            width = section.offsetWidth;
            height = section.offsetHeight;

            // Support high definition displays to remove pixelation
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;

            // CSS logical scale
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';

            // Scale rendering context to match device
            ctx.scale(dpr, dpr);

            init();
        }

        window.addEventListener('resize', resize);

        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        });

        section.addEventListener('mouseleave', () => {
            mouse.active = false;
        });

        class EmojiParticle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                // If initial, spawn anywhere on screen, otherwise spawn at bottom
                // Use logical width/height instead of canvas width/height to match DPR scaling
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : height + 50;

                // Varied emoji sizes for depth
                this.size = Math.random() * 25 + 15;

                // Very slow, relaxing upward speed to remove jitters and feel fluid
                this.speedY = Math.random() * 0.5 + 0.15;
                this.speedX = (Math.random() - 0.5) * 0.2;

                // Keep opacity low to remain elegant and not distracting
                this.baseOpacity = Math.random() * 0.3 + 0.15;
                this.opacity = this.baseOpacity;

                // Seamless smooth wobble motion parameters
                this.wobblePhase = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.015 + 0.005;
            }

            update() {
                // Float upwards
                this.y -= this.speedY;

                // Smooth wobble
                this.wobblePhase += this.wobbleSpeed;
                this.x += Math.sin(this.wobblePhase) * 0.5 + this.speedX;

                // Mouse interaction: smoothly bend away from cursor
                if (mouse.active) {
                    const dx = this.x - currentMouse.x;
                    const dy = this.y - currentMouse.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < 60000) { // Approx 245px radius
                        const force = Math.exp(-distSq / 20000);
                        this.x += (dx > 0 ? 1 : -1) * force * 1.5;
                        this.y += (dy > 0 ? 1 : -1) * force * 1.5;

                        // Slightly glow opacity when interacting
                        this.opacity = Math.min(this.baseOpacity + force * 0.5, 0.8);
                    } else {
                        // Return to base opacity
                        this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                    }
                } else {
                    this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                }

                // Reset when floating out of view
                if (this.y < -50 || this.x < -50 || this.x > width + 50) {
                    this.reset(false);
                }

                // Draw emoji
                ctx.globalAlpha = this.opacity;
                ctx.font = `${this.size}px "Segoe UI Emoji", "Apple Color Emoji", NotoColorEmoji, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("💤", this.x, this.y);
            }
        }

        function init() {
            particles = [];
            // Calculate a reasonable density of emojis based on screen size
            const count = Math.min(100, Math.floor((width * height) / 15000));
            for (let i = 0; i < count; i++) {
                particles.push(new EmojiParticle());
            }
        }

        function animate() {
            // Smooth mouse interpolation (easing)
            currentMouse.x += (mouse.x - currentMouse.x) * 0.05;
            currentMouse.y += (mouse.y - currentMouse.y) * 0.05;

            if (!mouse.active) {
                // Drift mouse away smoothly
                mouse.x += (width / 2 - mouse.x) * 0.01;
                mouse.y += (height * 2 - mouse.y) * 0.01;
            }

            // Clean white background
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }

            requestAnimationFrame(animate);
        }

        resize();
        animate();
    }
});
