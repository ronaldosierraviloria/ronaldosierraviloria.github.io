(() => {
    'use strict';

    if (window.ItaliaComidaSabores && typeof window.ItaliaComidaSabores.destroy === 'function') {
        window.ItaliaComidaSabores.destroy();
    }

    const cleanups = [];

    const listen = (target, type, handler, options) => {
        target.addEventListener(type, handler, options);
        cleanups.push(() => target.removeEventListener(type, handler, options));
    };

    const listenMediaQuery = (mediaQueryList, handler) => {
        if (typeof mediaQueryList.addEventListener === 'function') {
            listen(mediaQueryList, 'change', handler);
        } else if (typeof mediaQueryList.addListener === 'function') {
            mediaQueryList.addListener(handler);
            cleanups.push(() => mediaQueryList.removeListener(handler));
        }
    };

    const language = new URLSearchParams(window.location.search).get('lang') === 'en'
        ? 'en'
        : 'es';

    const t = (es, en) => (language === 'en' ? en : es);

    document.querySelectorAll('.language a').forEach((link) => {
        const linkLanguage = new URL(link.href, window.location.href).searchParams.get('lang');
        if (linkLanguage === language) {
            link.setAttribute('aria-current', 'true');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        const hour = new Date().getHours();
        const period = hour >= 5 && hour < 12
            ? 'morning'
            : hour >= 12 && hour < 19
                ? 'afternoon'
                : 'evening';
        const messages = {
            es: {
                morning: '¡Buenos días! Descubre los sabores de la cocina italiana.',
                afternoon: '¡Buenas tardes! Inspírate con platos y recetas tradicionales de Italia.',
                evening: '¡Buenas noches! Disfruta un recorrido por la gastronomía italiana.'
            },
            en: {
                morning: 'Good morning! Discover the flavors of Italian cuisine.',
                afternoon: 'Good afternoon! Find inspiration in Italy’s traditional dishes and recipes.',
                evening: 'Good evening! Enjoy a journey through Italian cuisine.'
            }
        };
        welcomeMessage.textContent = messages[language][period];
    }

    const navigation = document.getElementById('mainNav');
    const menuToggle = navigation && navigation.querySelector('.nav-toggle');
    if (navigation && menuToggle) {
        const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        const dropdownControllers = [];

        const closeAllDropdowns = (except) => {
            dropdownControllers.forEach((controller) => {
                if (controller !== except) {
                    controller.setOpen(false);
                }
            });
        };

        const setMenuOpen = (isOpen) => {
            navigation.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute(
                'aria-label',
                isOpen
                    ? t('Cerrar menú de navegación', 'Close navigation menu')
                    : t('Abrir menú de navegación', 'Open navigation menu')
            );
            menuToggle.textContent = isOpen ? '✕' : '☰';
            if (!isOpen) {
                closeAllDropdowns();
            }
        };

        navigation.querySelectorAll('.has-dropdown').forEach((dropdown) => {
            const button = dropdown.querySelector('.dropdown-toggle');
            const submenu = dropdown.querySelector('.dropdown-menu');
            if (!button || !submenu) {
                return;
            }

            const getItems = () => Array.from(submenu.querySelectorAll('a[href]'));
            const isOpen = () => button.getAttribute('aria-expanded') === 'true';

            const setDropdownOpen = (open) => {
                dropdown.classList.toggle('open', open);
                button.setAttribute('aria-expanded', String(open));
                button.setAttribute(
                    'aria-label',
                    open
                        ? t('Ocultar submenú de platos', 'Hide dishes submenu')
                        : t('Mostrar submenú de platos', 'Show dishes submenu')
                );
                submenu.hidden = !open;
            };

            const controller = { dropdown, setOpen: setDropdownOpen };
            dropdownControllers.push(controller);

            const focusItem = (index) => {
                const items = getItems();
                if (items.length > 0) {
                    items[(index + items.length) % items.length].focus();
                }
            };

            if (hoverCapable) {
                listen(dropdown, 'pointerenter', (event) => {
                    if (event.pointerType === 'mouse') {
                        closeAllDropdowns(controller);
                        setDropdownOpen(true);
                    }
                });
                listen(dropdown, 'pointerleave', (event) => {
                    if (event.pointerType === 'mouse') {
                        setDropdownOpen(false);
                    }
                });
            }

            listen(dropdown, 'focusin', () => {
                closeAllDropdowns(controller);
                setDropdownOpen(true);
            });
            listen(dropdown, 'focusout', (event) => {
                if (!dropdown.contains(event.relatedTarget)) {
                    setDropdownOpen(false);
                }
            });
            listen(button, 'click', () => {
                setDropdownOpen(!isOpen());
            });

            listen(dropdown, 'keydown', (event) => {
                const items = getItems();
                const currentIndex = items.indexOf(document.activeElement);

                switch (event.key) {
                    case 'Escape':
                        if (isOpen()) {
                            event.preventDefault();
                            button.focus();
                            setDropdownOpen(false);
                        }
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        setDropdownOpen(true);
                        focusItem(currentIndex + 1);
                        break;
                    case 'ArrowUp':
                        event.preventDefault();
                        setDropdownOpen(true);
                        focusItem(currentIndex < 0 ? -1 : currentIndex - 1);
                        break;
                    case 'Home':
                        if (currentIndex >= 0) {
                            event.preventDefault();
                            focusItem(0);
                        }
                        break;
                    case 'End':
                        if (currentIndex >= 0) {
                            event.preventDefault();
                            focusItem(items.length - 1);
                        }
                        break;
                    default:
                        break;
                }
            });
        });

        listen(menuToggle, 'click', () => {
            setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
        });

        listen(navigation, 'click', (event) => {
            if (event.target.closest('.nav-list a')) {
                setMenuOpen(false);
            }
        });

        listen(navigation, 'keydown', (event) => {
            if (
                event.key === 'Escape' &&
                !event.defaultPrevented &&
                menuToggle.getAttribute('aria-expanded') === 'true'
            ) {
                setMenuOpen(false);
                menuToggle.focus();
            }
        });

        listen(document, 'click', (event) => {
            if (!navigation.contains(event.target)) {
                closeAllDropdowns();
            }
        });

        setMenuOpen(false);
    }

    document.querySelectorAll('[data-slider]').forEach((slider) => {
        const slides = Array.from(slider.querySelectorAll('.hero-slide'));
        const previousButton = slider.querySelector('[data-slider-previous]');
        const nextButton = slider.querySelector('[data-slider-next]');
        const pauseButton = slider.querySelector('[data-slider-pause]');
        if (slides.length < 2 || !previousButton || !nextButton || !pauseButton) {
            return;
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const interval = 5000;
        let currentSlide = slides.findIndex((slide) => slide.classList.contains('is-active'));
        let timer = null;
        let userPaused = false;
        let pointerInside = false;

        if (currentSlide < 0) {
            currentSlide = 0;
        }

        const showSlide = (nextIndex) => {
            currentSlide = (nextIndex + slides.length) % slides.length;
            slides.forEach((slide, index) => {
                const isActive = index === currentSlide;
                slide.classList.toggle('is-active', isActive);
                slide.hidden = !isActive;
            });
        };

        const stopTimer = () => {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }
        };

        const startTimer = () => {
            if (
                timer === null &&
                !userPaused &&
                !reducedMotion.matches &&
                !document.hidden &&
                !pointerInside &&
                !slider.contains(document.activeElement)
            ) {
                timer = window.setInterval(() => {
                    showSlide(currentSlide + 1);
                }, interval);
            }
        };

        const updatePauseButton = () => {
            const isPaused = userPaused;
            pauseButton.setAttribute('aria-pressed', String(isPaused));
            pauseButton.textContent = isPaused ? t('Reanudar', 'Resume') : t('Pausar', 'Pause');
            pauseButton.setAttribute(
                'aria-label',
                isPaused
                    ? t('Reanudar presentación', 'Resume slideshow')
                    : t('Pausar presentación', 'Pause slideshow')
            );
            pauseButton.hidden = reducedMotion.matches;
        };

        listen(previousButton, 'click', () => showSlide(currentSlide - 1));
        listen(nextButton, 'click', () => showSlide(currentSlide + 1));
        listen(pauseButton, 'click', () => {
            userPaused = !userPaused;
            updatePauseButton();
            if (userPaused) {
                stopTimer();
            } else {
                startTimer();
            }
        });

        listen(slider, 'pointerenter', (event) => {
            if (event.pointerType === 'mouse') {
                pointerInside = true;
                stopTimer();
            }
        });
        listen(slider, 'pointerleave', (event) => {
            if (event.pointerType === 'mouse') {
                pointerInside = false;
                startTimer();
            }
        });

        listen(slider, 'focusin', stopTimer);
        listen(slider, 'focusout', (event) => {
            if (!slider.contains(event.relatedTarget)) {
                startTimer();
            }
        });

        listen(document, 'visibilitychange', () => {
            if (document.hidden) {
                stopTimer();
            } else {
                startTimer();
            }
        });

        listenMediaQuery(reducedMotion, () => {
            updatePauseButton();
            if (reducedMotion.matches) {
                stopTimer();
            } else {
                startTimer();
            }
        });

        cleanups.push(stopTimer);

        showSlide(currentSlide);
        updatePauseButton();
        startTimer();
    });

    const recipePills = document.querySelectorAll('.recipe-nav a');
    const updateActiveRecipe = () => {
        const hash = window.location.hash || '#pizza-napolitana';
        recipePills.forEach((pill) => {
            const isActive = pill.getAttribute('href') === hash;
            pill.classList.toggle('active', isActive);
            if (isActive) {
                pill.setAttribute('aria-current', 'location');
            } else {
                pill.removeAttribute('aria-current');
            }
        });
    };

    if (recipePills.length > 0) {
        listen(window, 'hashchange', updateActiveRecipe);
        updateActiveRecipe();
    }

    let destroyed = false;

    const destroy = () => {
        if (destroyed) {
            return;
        }
        destroyed = true;
        while (cleanups.length > 0) {
            cleanups.pop()();
        }
    };

    window.ItaliaComidaSabores = Object.freeze({ destroy });
})();
