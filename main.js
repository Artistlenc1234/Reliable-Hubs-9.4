const initAOS = () => {
    if (window.AOS) {
        AOS.init({ duration: 1000, once: true, offset: 100 });
    }
};

const closeAllDrawers = () => {
    const drawers = document.querySelectorAll('.side-drawer');
    const overlay = document.getElementById('menuOverlay');

    drawers.forEach(drawer => {
        drawer.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
    });

    if (overlay) {
        overlay.classList.remove('active');
    }

    document.body.style.overflow = '';
    document.querySelectorAll('[data-drawer-target]').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
};

const openDrawer = (drawer, trigger) => {
    if (!drawer) return;
    closeAllDrawers();

    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');

    const overlay = document.getElementById('menuOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }

    if (trigger) {
        trigger.setAttribute('aria-expanded', 'true');
    }

    document.body.style.overflow = 'hidden';
};

const initDrawers = () => {
    const drawerButtons = document.querySelectorAll('[data-drawer-target]');
    const overlay = document.getElementById('menuOverlay');
    const closeButtons = document.querySelectorAll('[data-dismiss="overlay"]');

    drawerButtons.forEach(btn => {
        btn.addEventListener('click', event => {
            const targetId = event.currentTarget.dataset.drawerTarget;
            const drawer = document.getElementById(targetId);
            openDrawer(drawer, event.currentTarget);
        });
    });

    closeButtons.forEach(btn => btn.addEventListener('click', closeAllDrawers));
    overlay?.addEventListener('click', closeAllDrawers);

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeAllDrawers();
        }
    });
};

const initContactDrawerForm = () => {
    const form = document.querySelector('.contact-drawer-form');
    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        form.reset();
        closeAllDrawers();
    });
};

const initDrawerSubmenus = () => {
    const drawer = document.getElementById('sideDrawer');
    if (!drawer) return;

    const submenuItems = drawer.querySelectorAll('.has-submenu');
    submenuItems.forEach(item => item.classList.remove('open'));

    const toggles = drawer.querySelectorAll('.submenu-toggle');
    toggles.forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();

            const parent = toggle.closest('.has-submenu');
            if (!parent) return;

            const isOpen = parent.classList.contains('open');
            parent.classList.toggle('open', !isOpen);
            toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        });
    });
};

const setDropdownState = (wrapper, isOpen) => {
    wrapper.dataset.open = isOpen ? 'true' : 'false';
    const trigger = wrapper.querySelector('.product-trigger');
    trigger?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
};

const initDropdowns = () => {
    const dropdownWrappers = document.querySelectorAll('[data-dropdown]');
    if (!dropdownWrappers.length) return;

    dropdownWrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector('.product-trigger');
        if (!trigger) return;

        const toggleDropdown = () => {
            const isOpen = wrapper.dataset.open === 'true';
            setDropdownState(wrapper, !isOpen);
        };

        trigger.addEventListener('click', event => {
            event.stopPropagation();
            toggleDropdown();
        });

        trigger.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleDropdown();
            }
        });
    });

    const closeAll = () => {
        dropdownWrappers.forEach(wrapper => setDropdownState(wrapper, false));
    };

    document.addEventListener('click', event => {
        dropdownWrappers.forEach(wrapper => {
            if (!wrapper.contains(event.target)) {
                setDropdownState(wrapper, false);
            }
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeAll();
        }
    });
};

const loadPartial = async (containerId, url, onLoad) => {
    const root = document.getElementById(containerId);
    if (!root) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        root.innerHTML = await response.text();
        if (typeof onLoad === 'function') {
            onLoad();
        }
    } catch (error) {
        console.error(error);
    }
};

const loadNavbar = () => {
    loadPartial('navbar-root', 'navbar.html', () => {
        initDrawers();
        initDropdowns();
        initDrawerSubmenus();
        initContactDrawerForm();
    });
};

const loadFooter = () => {
    loadPartial('footer-root', 'footer.html');
};

const initMediaDownloads = () => {
    const modal = document.getElementById('mediaDownloadModal');
    const form = document.getElementById('mediaDownloadForm');
    const triggers = document.querySelectorAll('.media-download-trigger');
    if (!modal || !form || !triggers.length) return;

    const firstInput = form.querySelector('input[name="firstName"]');
    const closes = modal.querySelectorAll('[data-download-close]');
    let pdfUrl = 'uploads/download-pdf/https:reliablehubs.com:wp-content:uploads:2024:10:Reliable-Hubs_Company-Profile.pdf';

    const openModal = targetUrl => {
        if (targetUrl) {
            pdfUrl = targetUrl;
        }
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('media-modal-open');
        window.setTimeout(() => firstInput?.focus(), 40);
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('media-modal-open');
    };

    triggers.forEach(trigger => {
        trigger.addEventListener('click', event => {
            event.preventDefault();
            openModal(trigger.dataset.downloadFile || trigger.getAttribute('href') || pdfUrl);
        });
    });

    closes.forEach(close => close.addEventListener('click', closeModal));

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const previewTab = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
        if (!previewTab) {
            window.location.href = pdfUrl;
        }

        form.reset();
        closeModal();
    });
};

const initMediaGalleryVideos = () => {
    const modal = document.getElementById('mediaVideoModal');
    const frame = document.getElementById('mediaVideoFrame');
    const triggers = document.querySelectorAll('.media-video-trigger');
    if (!modal || !frame || !triggers.length) return;

    const closes = modal.querySelectorAll('[data-video-close]');

    const getVideoId = url => {
        if (!url) return '';

        if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
            return url;
        }

        try {
            const parsed = new URL(url);
            if (parsed.hostname.includes('youtu.be')) {
                return parsed.pathname.replace('/', '').trim();
            }
            if (parsed.hostname.includes('youtube.com')) {
                if (parsed.pathname.startsWith('/embed/')) {
                    return parsed.pathname.split('/embed/')[1].split('/')[0];
                }
                return parsed.searchParams.get('v') || '';
            }
        } catch (error) {
            return '';
        }

        return '';
    };

    const buildEmbedUrl = inputUrl => {
        const videoId = getVideoId(inputUrl);
        if (!videoId) return '';
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    };

    const openModal = embedUrl => {
        frame.src = embedUrl;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('media-modal-open');
    };

    const closeModal = () => {
        frame.src = '';
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('media-modal-open');
    };

    triggers.forEach(trigger => {
        const thumb = trigger.querySelector('.media-video-thumb');
        const videoId = getVideoId(trigger.dataset.youtubeUrl || '');
        if (thumb && videoId) {
            thumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }

        trigger.addEventListener('click', event => {
            event.preventDefault();
            const embedUrl = buildEmbedUrl(trigger.dataset.youtubeUrl || '');
            if (!embedUrl) return;
            openModal(embedUrl);
        });
    });

    closes.forEach(close => close.addEventListener('click', closeModal));

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
};

const initSolutionCardAnimations = () => {
    const cards = document.querySelectorAll('.solution-card');
    if (!cards.length) return;

    cards.forEach((card, index) => {
        card.style.setProperty('--card-index', index.toString());
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
        );

        cards.forEach(card => observer.observe(card));
    } else {
        cards.forEach(card => card.classList.add('is-visible'));
    }

    cards.forEach(card => {
        card.addEventListener('mousemove', event => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const px = (x / rect.width) * 100;
            const py = (y / rect.height) * 100;
            const ry = ((x - rect.width / 2) / rect.width) * 10;
            const rx = -((y - rect.height / 2) / rect.height) * 10;

            card.style.setProperty('--mx', `${px}%`);
            card.style.setProperty('--my', `${py}%`);
            card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
            card.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
            card.classList.add('is-interacting');
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
            card.classList.remove('is-interacting');
        });
    });
};

const initAchievementsAnimations = () => {
    const section = document.querySelector('.achievements-section');
    if (!section) return;

    const header = section.querySelector('.achievements-header');
    const headerTitle = header?.querySelector('h2');
    const headerLabel = header?.querySelector('.achievements-header-label');
    const blocks = section.querySelectorAll('.journey-block');
    const subheaders = section.querySelectorAll('.journey-subheader');
    const items = section.querySelectorAll('.journey-item');
    const timelines = section.querySelectorAll('.journey-timeline');
    const transition = section.querySelector('.journey-transition');
    const defaultHeaderText = headerTitle?.textContent.trim() || '';

    section.classList.add('is-animated');

    const setActiveHeaderLabel = labelText => {
        if (!header || !headerLabel) return;

        const nextText = (labelText || '').trim();
        const isDefault = !nextText || nextText === defaultHeaderText;

        header.classList.toggle('has-active-subheader', !isDefault);
        headerLabel.textContent = isDefault ? '' : nextText;
    };

    if ('IntersectionObserver' in window) {
        const itemObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    entry.target.classList.toggle('is-visible', entry.isIntersecting);
                });
            },
            { threshold: 0.24, rootMargin: '0px 0px -8% 0px' }
        );

        items.forEach(item => itemObserver.observe(item));

        const blockObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    entry.target.classList.toggle('is-visible', entry.isIntersecting);
                    entry.target.classList.toggle('is-active', entry.intersectionRatio >= 0.45);
                });
            },
            { threshold: [0.18, 0.45, 0.7], rootMargin: '-8% 0px -12% 0px' }
        );

        blocks.forEach(block => blockObserver.observe(block));

        if (transition) {
            const transitionObserver = new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        entry.target.classList.toggle('is-visible', entry.isIntersecting);
                    });
                },
                { threshold: 0.2 }
            );

            transitionObserver.observe(transition);
        }
    } else {
        items.forEach(item => item.classList.add('is-visible'));
        blocks.forEach(block => {
            block.classList.add('is-visible');
            block.classList.add('is-active');
        });
        transition?.classList.add('is-visible');
    }

    const clamp = value => Math.max(0, Math.min(1, value));

    const updateTimelineProgress = () => {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const horizontalTravel = Math.min((window.innerWidth || document.documentElement.clientWidth) * 0.18, 220);

        timelines.forEach(timeline => {
            const rect = timeline.getBoundingClientRect();
            const distance = viewportHeight * 0.82 - rect.top;
            const total = rect.height + viewportHeight * 0.25;
            const progress = clamp(distance / total);
            timeline.style.setProperty('--timeline-progress', progress.toFixed(3));
        });

        blocks.forEach(block => {
            const rect = block.getBoundingClientRect();
            const enterStart = viewportHeight * 0.92;
            const enterEnd = viewportHeight * 0.72;
            const enterProgress = clamp((enterStart - rect.top) / (enterStart - enterEnd));

            const exitStart = viewportHeight * 0.36;
            const exitTravel = viewportHeight * 0.42;
            const exitProgress = clamp((exitStart - rect.top) / exitTravel);

            const visibleProgress = enterProgress * (1 - exitProgress);
            const scale = 0.94 + visibleProgress * 0.06;
            const shift = horizontalTravel * exitProgress;

            block.style.setProperty('--subheader-opacity', visibleProgress.toFixed(3));
            block.style.setProperty('--subheader-scale', scale.toFixed(3));
            block.style.setProperty('--subheader-shift', `${shift.toFixed(1)}px`);
        });

        let activeLabel = '';

        if (header && subheaders.length) {
            const headerRect = header.getBoundingClientRect();
            const activationLine = headerRect.bottom - Math.min(headerRect.height * 0.28, 32);

            subheaders.forEach(subheader => {
                const rect = subheader.getBoundingClientRect();
                if (rect.top <= activationLine) {
                    activeLabel = subheader.textContent;
                }
            });
        }

        setActiveHeaderLabel(activeLabel);
    };

    let ticking = false;
    const requestTick = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            updateTimelineProgress();
            ticking = false;
        });
    };

    updateTimelineProgress();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
};

const initProductDetailBackLink = () => {
    const detailSection = document.querySelector('.product-detail');
    if (!detailSection) return;

    const categoryLabels = {
        'racking-solutions': 'Racking Solutions',
        'shelving-solutions': 'Shelving Solutions',
        'automated-solutions': 'Automated Solutions',
        warehouse: 'Warehouse Storage Solutions',
        retail: 'Retail Solutions',
        furniture: 'Furniture Solutions',
        'office-storage': 'Office Storage Solutions',
        'data-center': 'Data Center Racks',
        'material-handling': 'Material Handling Trolleys'
    };

    const categoryByProductSlug = {
        'racking-solutions': 'warehouse',
        'shelving-solutions': 'warehouse',
        'automated-solutions': 'warehouse',
        'selective-pallet-racking': 'racking-solutions',
        'drive-in-racking': 'racking-solutions',
        'pallet-flow-racking': 'racking-solutions',
        'multi-tier-racking': 'racking-solutions',
        'mezzanine-racking': 'racking-solutions',
        'cantilever-racking': 'racking-solutions',
        'slotted-angle-racks': 'shelving-solutions',
        'boltless-shelving': 'shelving-solutions',
        'longspan-shelving': 'shelving-solutions',
        'carton-live-shelving': 'shelving-solutions',
        'mobile-motorized-racking': 'automated-solutions',
        'pallet-shuttle-racking-system': 'automated-solutions',
        asrs: 'automated-solutions',
        gondala: 'retail',
        'checkout-counter': 'retail',
        rack: 'retail',
        'stall-bin': 'retail',
        cages: 'retail',
        'football-fixtures': 'retail',
        'nesting-table': 'retail',
        'vegetable-fruit-racks': 'retail',
        'display-fixtures': 'retail',
        'two-three-seater-benches': 'furniture',
        'locker-cabinets': 'furniture',
        'computer-tables': 'furniture',
        'director-tables': 'furniture',
        'meeting-tables': 'furniture',
        'study-table-chairs': 'furniture',
        'teacher-tables': 'furniture',
        pedestals: 'furniture',
        'filling-cabinets': 'office-storage',
        'locker-cabinats': 'office-storage',
        'mobile-compactor': 'office-storage',
        'office-aimirah': 'office-storage',
        'wall-mounts': 'data-center',
        'open-racks': 'data-center',
        'outdoor-racks': 'data-center',
        'floor-standing-server-networking-racks': 'data-center',
        'customized-racks-consoles': 'data-center',
        'european-shopping-trolley': 'material-handling',
        'asian-shopping-trolley': 'material-handling',
        'german-shopping-trolley': 'material-handling',
        'american-shopping-trolley': 'material-handling',
        'plastic-shopping-trolley': 'material-handling',
        'hand-basket-trolley': 'material-handling',
        'warehouse-trolley': 'material-handling',
        'other-trolley': 'material-handling'
    };

    const getSlug = value => value.split('/').pop().replace('.html', '').toLowerCase();

    const pageSlug = getSlug(window.location.pathname);
    let categorySlug = categoryByProductSlug[pageSlug];

    if (document.referrer.startsWith(window.location.origin)) {
        const refSlug = getSlug(new URL(document.referrer).pathname);
        if (categoryLabels[refSlug]) {
            categorySlug = refSlug;
        }
    }

    if (!categorySlug || !categoryLabels[categorySlug]) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'product-back-wrap';

    const backLink = document.createElement('a');
    backLink.className = 'product-back-link';
    backLink.href = `${categorySlug}.html`;
    backLink.textContent = `← Back to ${categoryLabels[categorySlug]}`;

    wrapper.appendChild(backLink);
    const productIntro = document.querySelector('.product-intro');
    if (productIntro) {
        productIntro.before(wrapper);
    } else {
        detailSection.before(wrapper);
    }
};

const initProductDetailLayout = () => {
    const detailSection = document.querySelector('.product-detail');
    const summaryHeading = detailSection?.querySelector('.product-summary h1');
    if (!detailSection || !summaryHeading || document.querySelector('.product-intro')) return;

    const intro = document.createElement('div');
    intro.className = 'product-intro';

    const title = document.createElement('h1');
    title.className = 'product-intro-title';
    title.textContent = summaryHeading.textContent.trim();

    intro.appendChild(title);
    detailSection.before(intro);
    summaryHeading.remove();
};

window.addEventListener('DOMContentLoaded', () => {
    initAOS();
    loadNavbar();
    loadFooter();
    initMediaDownloads();
    initMediaGalleryVideos();
    initSolutionCardAnimations();
    initAchievementsAnimations();
    initProductDetailLayout();
    initProductDetailBackLink();
});



// ------------------------------------- Home Page baeer--------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    if (!slides.length || !dots.length) return;

    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function showSlide(index) {
        // Remove active class from all
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Trigger AOS animation again for the new slide content
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function previousSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function restartAutoSlide() {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, slideInterval);
    }

    // Auto-play
    let autoSlide = setInterval(nextSlide, slideInterval);

    // Click on dots to change slide
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            restartAutoSlide();
        });
    });

    prevArrow?.addEventListener('click', () => {
        previousSlide();
        restartAutoSlide();
    });

    nextArrow?.addEventListener('click', () => {
        nextSlide();
        restartAutoSlide();
    });

});
