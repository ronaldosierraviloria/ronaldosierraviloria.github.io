(() => {
    const language = new URLSearchParams(window.location.search).get('lang') === 'en'
        ? 'en'
        : 'es';

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
        const setMenuOpen = (isOpen) => {
            navigation.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute(
                'aria-label',
                isOpen
                    ? (language === 'en' ? 'Close navigation menu' : 'Cerrar menú de navegación')
                    : (language === 'en' ? 'Open navigation menu' : 'Abrir menú de navegación')
            );
            menuToggle.textContent = isOpen ? '✕' : '☰';
        };

        menuToggle.addEventListener('click', () => {
            setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
        });

        navigation.querySelectorAll('.has-dropdown').forEach((dropdown) => {
            const button = dropdown.querySelector('.dropdown-toggle');
            const submenu = dropdown.querySelector('.dropdown-menu');
            const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            if (!button || !submenu) {
                return;
            }

            const setDropdownOpen = (isOpen) => {
                dropdown.classList.toggle('open', isOpen);
                button.setAttribute('aria-expanded', String(isOpen));
                button.setAttribute(
                    'aria-label',
                    isOpen
                        ? (language === 'en' ? 'Hide dishes submenu' : 'Ocultar submenú de platos')
                        : (language === 'en' ? 'Show dishes submenu' : 'Mostrar submenú de platos')
                );
                submenu.hidden = !isOpen;
            };

            if (hoverCapable) {
                dropdown.addEventListener('mouseover', () => setDropdownOpen(true));
                dropdown.addEventListener('mouseout', (event) => {
                    if (!dropdown.contains(event.relatedTarget)) {
                        setDropdownOpen(false);
                    }
                });
            }
            dropdown.addEventListener('focusin', () => setDropdownOpen(true));
            dropdown.addEventListener('focusout', (event) => {
                if (!dropdown.contains(event.relatedTarget)) {
                    setDropdownOpen(false);
                }
            });
            button.addEventListener('click', () => {
                setDropdownOpen(button.getAttribute('aria-expanded') !== 'true');
            });
            dropdown.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    button.focus();
                    setDropdownOpen(false);
                }
            });
        });

        navigation.addEventListener('click', (event) => {
            if (event.target.closest('.nav-list a')) {
                setMenuOpen(false);
            }
        });

        document.addEventListener('click', (event) => {
            if (!navigation.contains(event.target)) {
                navigation.querySelectorAll('.has-dropdown.open').forEach((dropdown) => {
                    const button = dropdown.querySelector('.dropdown-toggle');
                    const submenu = dropdown.querySelector('.dropdown-menu');
                    dropdown.classList.remove('open');
                    if (button && submenu) {
                        button.setAttribute('aria-expanded', 'false');
                        submenu.hidden = true;
                    }
                });
            }
        });
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
        let currentSlide = slides.findIndex((slide) => slide.classList.contains('is-active'));
        let timer = null;
        let userPaused = false;
        const interval = 5000;

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
                !slider.matches(':hover') &&
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
            pauseButton.textContent = isPaused
                ? (language === 'en' ? 'Resume' : 'Reanudar')
                : (language === 'en' ? 'Pause' : 'Pausar');
            pauseButton.setAttribute(
                'aria-label',
                isPaused
                    ? (language === 'en' ? 'Resume slideshow' : 'Reanudar presentación')
                    : (language === 'en' ? 'Pause slideshow' : 'Pausar presentación')
            );
            pauseButton.hidden = reducedMotion.matches;
        };

        previousButton.addEventListener('click', () => showSlide(currentSlide - 1));
        nextButton.addEventListener('click', () => showSlide(currentSlide + 1));
        pauseButton.addEventListener('click', () => {
            userPaused = !userPaused;
            updatePauseButton();
            if (userPaused) {
                stopTimer();
            } else {
                startTimer();
            }
        });

        slider.addEventListener('mouseover', stopTimer);
        slider.addEventListener('mouseout', (event) => {
            if (!slider.contains(event.relatedTarget)) {
                startTimer();
            }
        });
        slider.addEventListener('focusin', stopTimer);
        slider.addEventListener('focusout', (event) => {
            if (!slider.contains(event.relatedTarget)) {
                startTimer();
            }
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopTimer();
            } else {
                startTimer();
            }
        });
        const handleMotionPreferenceChange = () => {
            updatePauseButton();
            startTimer();
        };
        if (typeof reducedMotion.addEventListener === 'function') {
            reducedMotion.addEventListener('change', handleMotionPreferenceChange);
        } else {
            reducedMotion.addListener(handleMotionPreferenceChange);
        }

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
        window.addEventListener('hashchange', updateActiveRecipe);
        updateActiveRecipe();
    }
})();
