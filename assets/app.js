(() => {
    const header = document.querySelector('.site-header');
    let lastY = window.scrollY;
    let ticking = false;

    if (header) {
        window.addEventListener('scroll', () => {
            if (ticking) return;

            ticking = true;

            requestAnimationFrame(() => {
                const y = window.scrollY;

                if (y > 130 && y > lastY + 4) {
                    header.classList.add('hidden');
                } else if (y < lastY - 4 || y < 60) {
                    header.classList.remove('hidden');
                }

                lastY = y;
                ticking = false;
            });
        }, { passive: true });
    }

    // Общие настройки анимаций и доступности.
    const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    // Мягкое появление основного содержимого страницы.
    const mainContent = document.querySelector('main');

    if (mainContent) {
        mainContent.classList.add('page-transition');
    }

    // Модальное окно связи.
    const isEnglish = document.documentElement.lang
        .toLowerCase()
        .startsWith('en');

    const modalCopy = isEnglish ? {
        eyebrow: 'CONTACT MARN',
        title: 'Let’s talk about your task.',
        text: 'Call the MARN team directly. We will help you find the right contact.',
        button: 'Call 8 800 250 70 70',
        close: 'Close contact window'
    } : {
        eyebrow: 'СВЯЗАТЬСЯ С МАРН',
        title: 'Обсудим вашу задачу.',
        text: 'Позвоните в МАРН напрямую — поможем определить нужное направление.',
        button: 'Позвонить 8 800 250 70 70',
        close: 'Закрыть окно связи'
    };

    const contactModal = document.createElement('div');

    contactModal.className = 'contact-modal';
    contactModal.hidden = true;
    contactModal.setAttribute('role', 'dialog');
    contactModal.setAttribute('aria-modal', 'true');
    contactModal.setAttribute('aria-labelledby', 'contact-modal-title');

    contactModal.innerHTML = `
        <div class="contact-modal__panel">
            <button
                class="contact-modal__close"
                type="button"
                aria-label="${modalCopy.close}"
            >×</button>

            <p class="contact-modal__eyebrow">
                ${modalCopy.eyebrow}
            </p>

            <h2
                class="contact-modal__title"
                id="contact-modal-title"
            >
                ${modalCopy.title}
            </h2>

            <p class="contact-modal__text">
                ${modalCopy.text}
            </p>

            <a
                class="contact-modal__phone"
                href="tel:+78002507070"
            >
                ${modalCopy.button}
            </a>
        </div>
    `;

    document.body.append(contactModal);

    const modalClose = contactModal.querySelector(
        '.contact-modal__close'
    );

    let lastModalTrigger = null;

    function openContactModal(event) {
        event?.preventDefault();

        lastModalTrigger =
            event?.currentTarget || document.activeElement;

        contactModal.hidden = false;
        document.body.classList.add('modal-open');

        modalClose.focus();
    }

    function closeContactModal() {
        contactModal.hidden = true;
        document.body.classList.remove('modal-open');

        if (
            lastModalTrigger &&
            typeof lastModalTrigger.focus === 'function'
        ) {
            lastModalTrigger.focus();
        }
    }

    document
        .querySelectorAll('[data-contact-modal]')
        .forEach(link => {
            link.addEventListener('click', openContactModal);
        });

    modalClose.addEventListener('click', closeContactModal);

    contactModal.addEventListener('click', event => {
        if (event.target === contactModal) {
            closeContactModal();
        }
    });

    document.addEventListener('keydown', event => {
        if (
            event.key === 'Escape' &&
            !contactModal.hidden
        ) {
            closeContactModal();
        }
    });

    // Мобильное меню.
    const menu = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');

    if (menu && nav) {
        menu.addEventListener('click', () => {
            const open = nav.classList.toggle('open');

            menu.setAttribute(
                'aria-expanded',
                String(open)
            );

            menu.setAttribute(
                'aria-label',
                open ? 'Закрыть меню' : 'Открыть меню'
            );

            document.body.classList.toggle(
                'menu-open',
                open
            );
        });

        nav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                nav.classList.remove('open');

                menu.setAttribute(
                    'aria-expanded',
                    'false'
                );

                document.body.classList.remove('menu-open');
            });
        });
    }

    // =========================================
    // SCROLL REVEAL
    // =========================================

    if (!reduceMotion && 'IntersectionObserver' in window) {
        const revealSelector = [
            '.hero-topline',
            '.hero-content',
            '.hero-bottom',
            '.section-heading',
            '.service-card',
            '.stat',
            '.feature-copy',
            '.feature-image',
            '.geo-copy',
            '.geo-city-group',
            '.globe-wrap',
            '.contact-band',
            '.content-layout',
            '.content-section',
            '.page-hero',
            '.page-cta',
            '.contact-cards article'
        ].join(',');

        const revealTargets = document.querySelectorAll(
            revealSelector
        );

        // Последовательное появление карточек.
        document
            .querySelectorAll(
                '.service-card, .stat, .contact-cards article'
            )
            .forEach((element, index) => {
                element.style.setProperty(
                    '--reveal-delay',
                    `${Math.min(index * 100, 400)}ms`
                );
            });

        revealTargets.forEach(element => {
            element.classList.add('reveal');
        });

        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('is-visible');

                    revealObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -35px 0px'
            }
        );

        revealTargets.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        document
            .querySelectorAll('.reveal')
            .forEach(element => {
                element.classList.add('is-visible');
            });
    }

    // =========================================
    // ANIMATED STATISTICS
    // =========================================

    if (!reduceMotion && 'IntersectionObserver' in window) {
        const counters = document.querySelectorAll(
            '.stat strong'
        );

        const counterObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const element = entry.target;

                    const textNode = Array
                        .from(element.childNodes)
                        .find(node =>
                            node.nodeType === Node.TEXT_NODE &&
                            /\d/.test(node.textContent)
                        );

                    if (
                        textNode &&
                        !element.dataset.counterAnimated
                    ) {
                        element.dataset.counterAnimated = 'true';

                        const originalText = textNode.textContent;

                        const target = Number.parseInt(
                            originalText.replace(/[^\d]/g, ''),
                            10
                        );

                        if (Number.isFinite(target)) {
                            const duration = 1400;
                            const startTime = performance.now();

                            const updateCounter = now => {
                                const progress = Math.min(
                                    (now - startTime) / duration,
                                    1
                                );

                                const eased =
                                    1 - Math.pow(1 - progress, 4);

                                const current = Math.round(
                                    target * eased
                                );

                                textNode.textContent =
                                    originalText.replace(
                                        /\d+/,
                                        String(current)
                                    );

                                if (progress < 1) {
                                    requestAnimationFrame(
                                        updateCounter
                                    );
                                } else {
                                    textNode.textContent =
                                        originalText.replace(
                                            /\d+/,
                                            String(target)
                                        );
                                }
                            };

                            requestAnimationFrame(updateCounter);
                        }
                    }

                    counterObserver.unobserve(element);
                });
            },
            {
                threshold: 0.5
            }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // =========================================
    // INTERACTIVE 3D GLOBE: RUSSIA AND CHINA
    // =========================================

    (async function init3DGlobe() {
        const oldCanvas = document.getElementById('globe');

        if (!oldCanvas) return;

        const wrap = oldCanvas.closest('.globe-wrap');

        if (!wrap) return;

        // Загрузка Three.js и OrbitControls.
        let THREE;
        let OrbitControls;

        try {
            THREE = await import(
                'https://esm.sh/three@0.170.0'
            );

            ({ OrbitControls } = await import(
                'https://esm.sh/three@0.170.0/examples/jsm/controls/OrbitControls.js'
            ));
        } catch (error) {
            console.error(
                'Не удалось загрузить Three.js:',
                error
            );

            return;
        }

        const cities = [
            {
                name: 'VLADIVOSTOK',
                lat: 43.1155,
                lon: 131.8855
            },
            {
                name: 'NOVOSIBIRSK',
                lat: 55.0084,
                lon: 82.9357
            },
            {
                name: 'ST. PETERSBURG',
                lat: 59.9311,
                lon: 30.3609
            },
            {
                name: 'YUZHNO-SAKHALINSK',
                lat: 46.9591,
                lon: 142.7380
            },
            {
                name: 'KALININGRAD',
                lat: 54.7104,
                lon: 20.4522
            },
            {
                name: 'NOVOROSSIYSK',
                lat: 44.7239,
                lon: 37.7689
            },
            {
                name: 'NAKHODKA',
                lat: 42.8240,
                lon: 132.8928
            },
            {
                name: 'MURMANSK',
                lat: 68.9707,
                lon: 33.0750
            },
            {
                name: 'ARKHANGELSK',
                lat: 64.5393,
                lon: 40.5187
            },
            {
                name: 'MAKHACHKALA',
                lat: 42.9849,
                lon: 47.5047
            },
            {
                name: 'SHANGHAI',
                lat: 31.2304,
                lon: 121.4737
            },
            {
                name: 'SHENZHEN',
                lat: 22.5431,
                lon: 114.0579
            },
            {
                name: 'DALIAN',
                lat: 38.9140,
                lon: 121.6147
            }
        ];

        const cityButton = wrap.querySelector('.globe-city');
        const cityButtonLabel = cityButton?.querySelector('span');
        const globeHint = wrap.querySelector('.globe-hint');

        // Создаём новый WebGL canvas на месте старого.
        oldCanvas.remove();

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        renderer.domElement.id = 'globe';

        renderer.domElement.setAttribute(
            'aria-label',
            'Интерактивный трёхмерный глобус с городами России и Китая'
        );

        renderer.domElement.style.display = 'block';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.touchAction = 'none';

        wrap.prepend(renderer.domElement);

        const scene = new THREE.Scene();

        scene.background = new THREE.Color('#101D2C');

        const camera = new THREE.PerspectiveCamera(
            38,
            1,
            0.1,
            100
        );

        // Начальный ракурс: Россия и Китай.
        const initialDirection = latLonToVector(48, 105);

        camera.position.copy(
            initialDirection.multiplyScalar(3.25)
        );

        const controls = new OrbitControls(
            camera,
            renderer.domElement
        );

        controls.enableDamping = true;
        controls.dampingFactor = 0.055;

        // Левая кнопка — вращение, колесо — масштаб.
        controls.enableRotate = true;
        controls.enableZoom = true;

        // Не даём утащить глобус в сторону от центра.
        controls.enablePan = false;

        controls.minDistance = 1.45;
        controls.maxDistance = 6.5;

        controls.rotateSpeed = 0.65;
        controls.zoomSpeed = 0.8;

        controls.minPolarAngle = 0.08;
        controls.maxPolarAngle = Math.PI - 0.08;

        const globeGroup = new THREE.Group();

        scene.add(globeGroup);

        // Автовращение отключается на время ручного управления.
        let globeIsInteracting = false;

        controls.addEventListener('start', () => {
            globeIsInteracting = true;
        });

        controls.addEventListener('end', () => {
            globeIsInteracting = false;
        });

        // Освещение.
        scene.add(
            new THREE.AmbientLight(0xffffff, 2.0)
        );

        const sunlight = new THREE.DirectionalLight(
            0xffffff,
            1.8
        );

        sunlight.position.set(4, 3, 5);

        scene.add(sunlight);

        // Основная сфера Земли.
        const globeGeometry = new THREE.SphereGeometry(
            1,
            96,
            96
        );

        const textureLoader = new THREE.TextureLoader();

        textureLoader.setCrossOrigin('anonymous');

        const earthTexture = await new Promise(resolve => {
            textureLoader.load(
                'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
                texture => resolve(texture),
                undefined,
                error => {
                    console.warn(
                        'Не удалось загрузить текстуру Земли:',
                        error
                    );

                    resolve(null);
                }
            );
        });

        const globeMaterial = new THREE.MeshPhongMaterial({
            color: earthTexture ? 0xffffff : 0x29445a,
            map: earthTexture,
            shininess: 8,
            specular: new THREE.Color('#253b4c')
        });

        const globe = new THREE.Mesh(
            globeGeometry,
            globeMaterial
        );

        globeGroup.add(globe);

        // Атмосфера — тонкое свечение по краю сферы.
        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(1.018, 96, 96),
            new THREE.MeshBasicMaterial({
                color: 0x7199b5,
                transparent: true,
                opacity: 0.09,
                side: THREE.BackSide
            })
        );

        globeGroup.add(atmosphere);

        // Перевод широты и долготы в точку на сфере.
        function latLonToVector(lat, lon, radius = 1) {
            const phi = THREE.MathUtils.degToRad(
                90 - lat
            );

            const theta = THREE.MathUtils.degToRad(
                lon + 180
            );

            return new THREE.Vector3(
                -radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
        }

        // Тонкая географическая сетка.
        const gridMaterial = new THREE.LineBasicMaterial({
            color: 0xa8bdca,
            transparent: true,
            opacity: 0.19
        });

        function addGridLine(points) {
            const geometry =
                new THREE.BufferGeometry().setFromPoints(points);

            const line = new THREE.Line(
                geometry,
                gridMaterial
            );

            globeGroup.add(line);
        }

        // Линии широт.
        for (let lat = -80; lat <= 80; lat += 20) {
            const points = [];

            for (let lon = -180; lon <= 180; lon += 3) {
                points.push(
                    latLonToVector(lat, lon, 1.003)
                );
            }

            addGridLine(points);
        }

        // Линии долгот.
        for (let lon = -180; lon < 180; lon += 20) {
            const points = [];

            for (let lat = -90; lat <= 90; lat += 3) {
                points.push(
                    latLonToVector(lat, lon, 1.003)
                );
            }

            addGridLine(points);
        }

        // Маркеры городов и их мягкое свечение.
        const cityMarkers = [];
        const glowMarkers = [];

        const markerGeometry = new THREE.SphereGeometry(
            0.009,
            16,
            16
        );

        const markerMaterial = new THREE.MeshBasicMaterial({
            color: 0xE99A42
        });

        const selectedMarkerMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffc078
            });

        cities.forEach(city => {
            const marker = new THREE.Mesh(
                markerGeometry,
                markerMaterial
            );

            marker.position.copy(
                latLonToVector(
                    city.lat,
                    city.lon,
                    1.012
                )
            );

            marker.userData.city = city;
            marker.userData.baseScale = 1;

            globeGroup.add(marker);

            cityMarkers.push(marker);

            // Мягкое свечение вокруг точки.
            const glow = new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.019,
                    16,
                    16
                ),
                new THREE.MeshBasicMaterial({
                    color: 0xE99A42,
                    transparent: true,
                    opacity: 0.2
                })
            );

            glow.position.copy(marker.position);

            globeGroup.add(glow);

            glowMarkers.push(glow);
        });

        // Большая точка Владивостока.
        const vladivostokMarker = cityMarkers[0];

        vladivostokMarker.material =
            selectedMarkerMaterial;

        vladivostokMarker.scale.setScalar(1.7);

        // Геометрии дуг хранятся для постепенной прорисовки.
        const arcLines = [];

        // Построение дуги между двумя городами.
        function createArc(startCity, endCity) {
            const start = latLonToVector(
                startCity.lat,
                startCity.lon
            );

            const end = latLonToVector(
                endCity.lat,
                endCity.lon
            );

            const angle = start.angleTo(end);

            const points = [];
            const segments = 100;

            for (let i = 0; i <= segments; i++) {
                const t = i / segments;

                const point = start.clone().lerp(end, t);

                // Плавное возвышение дуги над поверхностью.
                const elevation =
                    0.025 +
                    Math.sin(Math.PI * t) * 0.055;

                point.normalize().multiplyScalar(
                    1 + elevation
                );

                points.push(point);
            }

            const curve = new THREE.CatmullRomCurve3(
                points
            );

            const geometry =
                new THREE.BufferGeometry().setFromPoints(
                    curve.getPoints(segments)
                );

            const material = new THREE.LineBasicMaterial({
                color: 0xE99A42,
                transparent: true,
                opacity: 0.58
            });

            const arc = new THREE.Line(
                geometry,
                material
            );

            // Сначала дуга почти не видна.
            geometry.setDrawRange(0, 1);

            globeGroup.add(arc);

            arcLines.push(geometry);
        }

        // Все города соединяются с Владивостоком.
        const mainCity = cities[0];

        cities.slice(1).forEach(city => {
            createArc(mainCity, city);
        });

        // Выбор города.
        let selectedCity = 'VLADIVOSTOK';

        function selectCity(city) {
            selectedCity = city.name;

            cityMarkers.forEach(marker => {
                const isSelected =
                    marker.userData.city.name === selectedCity;

                marker.material = isSelected
                    ? selectedMarkerMaterial
                    : markerMaterial;

                marker.scale.setScalar(
                    isSelected ? 1.7 : 1
                );
            });

            if (cityButtonLabel) {
                cityButtonLabel.textContent = city.name;
            }

            if (cityButton) {
                cityButton.setAttribute(
                    'aria-label',
                    `Выбран город ${city.name}`
                );
            }
        }

        // Клик по маркеру города.
        const raycaster = new THREE.Raycaster();

        const pointer = new THREE.Vector2();

        let pointerDownPosition = null;

        renderer.domElement.addEventListener(
            'pointerdown',
            event => {
                pointerDownPosition = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
        );

        renderer.domElement.addEventListener(
            'pointerup',
            event => {
                if (!pointerDownPosition) return;

                const moved = Math.hypot(
                    event.clientX - pointerDownPosition.x,
                    event.clientY - pointerDownPosition.y
                );

                pointerDownPosition = null;

                // Если мышь двигалась, это вращение, а не клик.
                if (moved > 5) return;

                const rect =
                    renderer.domElement.getBoundingClientRect();

                pointer.x =
                    ((event.clientX - rect.left) / rect.width) * 2 - 1;

                pointer.y =
                    -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(pointer, camera);

                const hits = raycaster.intersectObjects(
                    cityMarkers
                );

                if (hits.length) {
                    selectCity(
                        hits[0].object.userData.city
                    );
                }
            }
        );

        // Кнопка выбора Владивостока.
        if (cityButton) {
            cityButton.addEventListener('click', () => {
                selectCity(cities[0]);
            });
        }

        if (globeHint) {
            globeHint.textContent =
                'ЗАЖМИТЕ И ПЕРЕТАСКИВАЙТЕ ДЛЯ ВРАЩЕНИЯ · КОЛЁСИКО — ПРИБЛИЖЕНИЕ';
        }

        // Адаптация размеров.
        function resize() {
            const width = wrap.clientWidth;
            const height = wrap.clientHeight;

            if (!width || !height) return;

            renderer.setPixelRatio(
                Math.min(window.devicePixelRatio || 1, 2)
            );

            renderer.setSize(width, height, false);

            camera.aspect = width / height;

            camera.updateProjectionMatrix();
        }

        const resizeObserver = new ResizeObserver(resize);

        resizeObserver.observe(wrap);

        window.addEventListener('resize', resize);

        resize();

        // =========================================
        // GLOBE ANIMATION LOOP
        // =========================================

        let previousFrameTime = 0;

        function animate(time = 0) {
            requestAnimationFrame(animate);

            const delta = previousFrameTime
                ? Math.min(
                    (time - previousFrameTime) / 16.67,
                    2
                )
                : 1;

            previousFrameTime = time;

            // Медленное вращение в состоянии покоя.
            if (!globeIsInteracting && !reduceMotion) {
                globeGroup.rotation.y += 0.00022 * delta;
            }

            // Пульсация свечения городов.
            if (!reduceMotion) {
                glowMarkers.forEach((glow, index) => {
                    const pulse =
                        1 +
                        Math.sin(
                            time * 0.0018 + index * 0.7
                        ) * 0.13;

                    glow.scale.setScalar(pulse);

                    glow.material.opacity =
                        0.17 +
                        Math.sin(
                            time * 0.0018 + index * 0.7
                        ) * 0.045;
                });
            }

            // Постепенное появление дуг.
            arcLines.forEach(geometry => {
                const current = geometry.drawRange.count;

                const total =
                    geometry.attributes.position.count;

                if (current < total) {
                    geometry.setDrawRange(
                        0,
                        Math.min(
                            current + 1.25 * delta,
                            total
                        )
                    );
                }
            });

            controls.update();

            renderer.render(scene, camera);
        }

        animate();

        // Владивосток выбран по умолчанию.
        selectCity(cities[0]);

    })();

})();