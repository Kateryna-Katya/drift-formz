/**
 * DRIFT-FORMZ.BLOG - Core Engine
 * Version: 1.0.2
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК ---
    const initIcons = () => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // --- 2. ПЛАВНЫЙ СКРОЛЛ (LENIS) ---
    const initSmoothScroll = () => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Синхронизация ScrollTrigger с Lenis
        lenis.on('scroll', ScrollTrigger.update);
        
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        
        gsap.ticker.lagSmoothing(0);
    };

    // --- 3. МОБИЛЬНОЕ МЕНЮ ---
    const initMobileMenu = () => {
        const burger = document.getElementById('burger-menu');
        const menu = document.getElementById('mobile-menu');
        const links = document.querySelectorAll('.mobile-nav__link');
        const body = document.body;

        const toggleMenu = () => {
            burger.classList.toggle('active');
            menu.classList.toggle('active');
            // Блокируем скролл при открытом меню
            body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        };

        burger.addEventListener('click', toggleMenu);

        links.forEach(link => {
            link.addEventListener('click', () => {
                if (menu.classList.contains('active')) toggleMenu();
            });
        });
    };

    // --- 4. HEADER ЭФФЕКТЫ ---
    const initHeader = () => {
        const header = document.querySelector('.header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        });
    };

    // --- 5. GSAP АНИМАЦИИ (HERO & SCROLL) ---
    const initAnimations = () => {
        // Регистрация плагина
        gsap.registerPlugin(ScrollTrigger);

        // Анимация заголовка (SplitType)
        const titleElement = document.querySelector('#hero-title');
        if (titleElement) {
            const splitText = new SplitType(titleElement, { 
                types: 'words, chars',
                tagName: 'span' 
            });

            const tl = gsap.timeline();

            tl.from(splitText.chars, {
                opacity: 0,
                y: 100,
                rotateX: -90,
                stagger: 0.02,
                duration: 1.2,
                ease: "expo.out",
                clearProps: "all"
            })
            .from('.hero__subtitle', {
                opacity: 0,
                y: 20,
                duration: 1
            }, "-=0.8")
            .from('.hero__actions', {
                opacity: 0,
                y: 20,
                duration: 1
            }, "-=0.8");
        }

        // Появление секций при скролле
        gsap.utils.toArray('.benefit-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom-=100",
                    toggleActions: "play none none reverse"
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: i * 0.1
            });
        });

        // Эффект параллакса для изображений
        gsap.to('.img-tilt', {
            scrollTrigger: {
                trigger: '.platform',
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            y: -50,
            rotate: 0
        });
    };

    // --- 6. ФОРМА ОБРАТНОЙ СВЯЗИ & ВАЛИДАЦИЯ ---
    const initContactForm = () => {
        const form = document.getElementById('main-form');
        if (!form) return;

        const phoneInput = document.getElementById('phone-input');
        const captchaLabel = document.getElementById('captcha-label');
        const captchaInput = document.getElementById('captcha-input');
        const formMessage = document.getElementById('form-message');

        // Генерация капчи
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        const correctAnswer = n1 + n2;
        
        if (captchaLabel) {
            captchaLabel.innerText = `Подтвердите, что вы не робот: ${n1} + ${n2} = ?`;
        }

        // Валидация телефона (только цифры)
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d+]/g, '');
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Проверка капчи
            if (parseInt(captchaInput.value) !== correctAnswer) {
                formMessage.textContent = 'Ошибка: Неверный ответ капчи.';
                formMessage.style.color = '#ff4d4d';
                return;
            }

            // Имитация отправки (AJAX)
            const submitBtn = form.querySelector('button');
            const originalBtnText = submitBtn.innerText;
            
            submitBtn.disabled = true;
            submitBtn.innerText = 'Отправка...';
            formMessage.textContent = '';

            try {
                // Имитируем задержку сервера
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                form.reset();
                formMessage.style.color = 'var(--color-accent)';
                formMessage.textContent = 'Успешно! Мы перезвоним вам в течение дня.';
                
                // Сброс сообщения через 5 сек
                setTimeout(() => { formMessage.textContent = ''; }, 5000);
            } catch (err) {
                formMessage.textContent = 'Произошла ошибка. Попробуйте позже.';
                formMessage.style.color = '#ff4d4d';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    };

    // --- 7. COOKIE POPUP ---
    const initCookies = () => {
        const popup = document.getElementById('cookie-popup');
        const acceptBtn = document.getElementById('accept-cookies');

        if (!localStorage.getItem('drift_cookies_accepted')) {
            setTimeout(() => {
                popup.classList.add('show');
            }, 3000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('drift_cookies_accepted', 'true');
            popup.classList.remove('show');
        });
    };

    // --- ЗАПУСК ВСЕХ МОДУЛЕЙ ---
    initIcons();
    initSmoothScroll();
    initMobileMenu();
    initHeader();
    initAnimations();
    initContactForm();
    initCookies();

    console.log('%c Drift-Formz Blog Engine Loaded ', 'background: #CCFF00; color: #000; font-weight: bold;');
});