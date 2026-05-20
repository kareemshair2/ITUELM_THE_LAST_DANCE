/* ═══════════════════════════════════════════
   ITUELM — Cinematic Animation Sequence
   Dark / Dramatic / Mystical / Majestic
   ═══════════════════════════════════════════ */

class CinematicDirector {
    constructor() {
        this.scene1 = document.getElementById('scene1');
        this.scene2 = document.getElementById('scene2');
        this.scene3 = document.getElementById('scene3');
        this.arabicWord = document.getElementById('arabic-word');
        this.mainTitle = document.getElementById('main-title');
        this.letters = document.querySelectorAll('.letter');
        this.titleReflection = document.getElementById('title-reflection');
        this.groundGlow = document.getElementById('ground-glow');
        this.groundBurst = document.getElementById('ground-burst');
        this.subtitleLine = document.getElementById('subtitle-line');
        this.finalTitle = document.getElementById('final-title');
        this.finalReflection = document.getElementById('final-reflection');
        this.bloomLayer = document.querySelector('.bloom-layer');
        this.fogLayers = document.querySelectorAll('.fog-layer');
        this.bgDark = document.querySelector('.bg-dark');

        this.particles = null;
        this.timeline = null;

        this.init();
    }

    init() {
        const checkParticles = setInterval(() => {
            if (window.particleSystem) {
                this.particles = window.particleSystem;
                clearInterval(checkParticles);
                this.startSequence();
            }
        }, 100);
    }

    easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
    easeInExpo(t) { return t === 0 ? 0 : Math.pow(2, 10 * (t - 1)); }
    easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
    easeOutBack(t) { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }

    animateValue(obj, prop, start, end, duration, easing = t => t, onUpdate = null) {
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easing(progress);
            const value = start + (end - start) * eased;

            obj[prop] = value;
            if (onUpdate) onUpdate(value);

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    }

    setOpacity(el, value) { el.style.opacity = value; }
    setTransform(el, value) { el.style.transform = value; }
    setFilter(el, value) { el.style.filter = value; }

    // ── Scene 1: ITUELM First Appearance — Dark & Majestic ──
    async playScene1() {
        return new Promise(resolve => {
            this.scene1.style.opacity = '1';

            // Deep dark background fades in
            this.animateValue(
                this.bgDark.style, 'opacity', 0, 1, 2000, this.easeOutExpo.bind(this)
            );

            // Ground glow appears slowly (energy gathering from darkness)
            setTimeout(() => {
                this.animateValue(
                    this.groundGlow.style, 'opacity', 0, 0.7, 2000, this.easeOutExpo.bind(this)
                );
            }, 500);

            // Ground burst
            setTimeout(() => {
                this.animateValue(
                    this.groundBurst.style, 'opacity', 0, 0.5, 1500, this.easeOutExpo.bind(this)
                );
            }, 800);

            // Fog layers fade in
            this.fogLayers.forEach((fog, i) => {
                setTimeout(() => {
                    this.animateValue(fog.style, 'opacity', 0, 0.8, 2500, this.easeOutExpo.bind(this));
                }, i * 400);
            });

            // Bloom layer
            setTimeout(() => {
                this.animateValue(this.bloomLayer.style, 'opacity', 0, 1, 2500, this.easeOutExpo.bind(this));
            }, 800);

            // Letters appear one by one — from darkness
            const letterDelay = 500;
            this.letters.forEach((letter, i) => {
                setTimeout(() => {
                    if (this.particles) {
                        this.particles.spawnSparkBurst(10);
                        this.particles.spawnGroundSparks(5);
                        this.particles.emitEnergyRing();
                    }

                    const startTime = performance.now();
                    const duration = 1400;

                    const animateLetter = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = this.easeOutBack(progress);

                        const opacity = eased;
                        const translateY = 50 * (1 - eased);
                        const scale = 0.75 + 0.25 * eased;
                        const blur = 10 * (1 - eased);

                        letter.style.opacity = opacity;
                        letter.style.transform = `translateY(${translateY}px) scale(${scale})`;
                        letter.style.filter = `blur(${blur}px)`;

                        // Inner glow
                        const beforeOpacity = Math.max(0, (eased - 0.2) * 1.25);
                        letter.style.setProperty('--before-opacity', beforeOpacity);

                        // Outer bloom
                        const afterOpacity = Math.max(0, (eased - 0.4) * 1.67);
                        letter.style.setProperty('--after-opacity', afterOpacity);

                        if (progress < 1) {
                            requestAnimationFrame(animateLetter);
                        } else {
                            letter.classList.add('energized');
                        }
                    };

                    requestAnimationFrame(animateLetter);

                }, 2500 + i * letterDelay);
            });

            // Arabic word appears after letters
            setTimeout(() => {
                const startTime = performance.now();
                const duration = 1800;

                const animateArabic = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = this.easeOutExpo(progress);

                    this.arabicWord.style.opacity = eased;
                    this.arabicWord.style.transform = `translateY(${25 * (1 - eased)}px)`;

                    if (progress < 1) requestAnimationFrame(animateArabic);
                };

                requestAnimationFrame(animateArabic);

                if (this.particles) {
                    this.particles.spawnSparkBurst(20);
                    this.particles.spawnGroundSparks(8);
                }
            }, 2500 + this.letters.length * letterDelay + 600);

            // Title reflection appears
            setTimeout(() => {
                this.animateValue(
                    this.titleReflection.style, 'opacity', 0, 0.25, 2500, this.easeOutExpo.bind(this)
                );
            }, 3000);

            // Start pulsing
            setTimeout(() => {
                this.mainTitle.classList.add('pulsing');

                if (this.particles) {
                    this.particles.setIntensity(0.8);
                }

                resolve();
            }, 2500 + this.letters.length * letterDelay + 2500);
        });
    }

    // ── Scene 1 Exit: Energy Withdrawal ──
    async dissolveScene1() {
        return new Promise(resolve => {
            this.mainTitle.classList.remove('pulsing');
            this.letters.forEach(l => l.classList.remove('energized'));

            if (this.particles) {
                this.particles.spawnDissolveParticles(60);
                this.particles.spawnGroundSparks(20);
                this.particles.setIntensity(0.2);
            }

            const fadeDuration = 3000;
            const startTime = performance.now();

            const animateDissolve = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / fadeDuration, 1);
                const eased = this.easeInExpo(progress);

                const opacity = 1 - eased;

                this.letters.forEach((letter, i) => {
                    const scatterX = Math.sin(i * 1.5) * eased * 80;
                    const scatterY = Math.cos(i * 1.2) * eased * 60 - eased * 40;
                    letter.style.opacity = opacity;
                    letter.style.filter = `blur(${eased * 20}px)`;
                    letter.style.transform = `translate(${scatterX}px, ${scatterY}px) scale(${1 - eased * 0.25})`;
                });

                this.arabicWord.style.opacity = opacity * 0.8;
                this.titleReflection.style.opacity = opacity * 0.25;
                this.groundGlow.style.opacity = opacity * 0.7;
                this.groundBurst.style.opacity = opacity * 0.5;

                if (progress < 1) {
                    requestAnimationFrame(animateDissolve);
                } else {
                    this.scene1.style.opacity = '0';
                    resolve();
                }
            };

            requestAnimationFrame(animateDissolve);
        });
    }

    // ── Scene 2: "THAT WAS THE LAST DANCE" — Dramatic Fade ──
    async playScene2() {
        return new Promise(resolve => {
            this.scene2.style.opacity = '1';
            this.scene2.style.pointerEvents = 'auto';

            const startTime = performance.now();
            const duration = 3500;

            const animateSubtitle = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = this.easeOutExpo(progress);

                this.subtitleLine.style.opacity = eased * 0.8;
                this.subtitleLine.style.transform = `translateY(${35 * (1 - eased)}px)`;
                this.subtitleLine.style.letterSpacing = `${0.4 + (1 - eased) * 0.6}em`;

                const glowIntensity = 0.15 + Math.sin(elapsed * 0.0018) * 0.08;
                this.subtitleLine.style.textShadow = `
                    0 0 ${25 + glowIntensity * 25}px rgba(0, 136, 255, ${glowIntensity}),
                    0 0 ${50 + glowIntensity * 50}px rgba(0, 80, 180, ${glowIntensity * 0.5})
                `;

                if (progress < 1) {
                    requestAnimationFrame(animateSubtitle);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animateSubtitle);
        });
    }

    // ── Scene 2 Exit: Fade to Void ──
    async fadeOutScene2() {
        return new Promise(resolve => {
            const startTime = performance.now();
            const duration = 3000;

            const animateFade = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = this.easeInExpo(progress);

                const opacity = 0.8 * (1 - eased);
                this.subtitleLine.style.opacity = opacity;
                this.subtitleLine.style.filter = `blur(${eased * 10}px)`;
                this.subtitleLine.style.transform = `translateY(${eased * -25}px)`;

                if (progress < 1) {
                    requestAnimationFrame(animateFade);
                } else {
                    this.scene2.style.opacity = '0';
                    this.scene2.style.pointerEvents = 'none';
                    resolve();
                }
            };

            requestAnimationFrame(animateFade);
        });
    }

    // ── Scene 3: ITUELM Final — Legendary Return ──
    async playScene3() {
        return new Promise(resolve => {
            this.scene3.style.opacity = '1';
            this.scene3.style.pointerEvents = 'auto';

            if (this.particles) {
                this.particles.setIntensity(1.0);
                this.particles.spawnSparkBurst(40);
                this.particles.spawnGroundSparks(25);
                this.particles.emitEnergyRing();
                this.particles.emitEnergyRing();
            }

            const startTime = performance.now();
            const duration = 2500;

            const animateFinal = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = this.easeOutBack(progress);

                this.finalTitle.style.opacity = eased;
                this.finalTitle.style.transform = `scale(${0.65 + 0.35 * eased})`;

                // Inner glow
                const beforeOp = Math.max(0, (eased - 0.15) * 1.18);
                this.finalTitle.style.setProperty('--before-opacity', beforeOp);

                // Outer bloom
                const afterOp = Math.max(0, (eased - 0.3) * 1.43);
                this.finalTitle.style.setProperty('--after-opacity', afterOp);

                // Reflection
                this.finalReflection.style.opacity = eased * 0.18;

                // Bloom intensifies
                this.bloomLayer.style.opacity = 1 + eased * 0.8;

                if (progress < 1) {
                    requestAnimationFrame(animateFinal);
                } else {
                    this.finalTitle.classList.add('final-pulsing');

                    this.finalSparkInterval = setInterval(() => {
                        if (this.particles) {
                            this.particles.spawnSparkBurst(6);
                            this.particles.spawnGroundSparks(4);
                        }
                    }, 700);

                    resolve();
                }
            };

            requestAnimationFrame(animateFinal);
        });
    }

    // ── Final Fade to Black — Absolute Darkness ──
    async fadeToBlack() {
        return new Promise(resolve => {
            this.finalTitle.classList.remove('final-pulsing');
            clearInterval(this.finalSparkInterval);

            const overlay = document.createElement('div');
            overlay.className = 'fade-overlay';
            document.body.appendChild(overlay);

            if (this.particles) {
                this.particles.setIntensity(0);
                this.particles.spawnDissolveParticles(50);
                this.particles.spawnGroundSparks(15);
            }

            const startTime = performance.now();
            const duration = 5000;

            const animateFade = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = this.easeInOutCubic(progress);

                overlay.style.opacity = eased;

                this.finalTitle.style.opacity = 1 - eased;
                this.finalReflection.style.opacity = (1 - eased) * 0.18;
                this.bloomLayer.style.opacity = 1 - eased;
                this.fogLayers.forEach(fog => {
                    fog.style.opacity = (1 - eased) * 0.8;
                });

                if (progress < 1) {
                    requestAnimationFrame(animateFade);
                } else {
                    this.scene3.style.opacity = '0';
                    resolve();
                }
            };

            requestAnimationFrame(animateFade);
        });
    }

    // ── Main Sequence — Dark Cinematic Timeline ──
    async startSequence() {
        console.log('🎬 Dark Cinematic sequence starting...');

        // Absolute darkness (2s)
        await this.wait(2000);

        // Scene 1: ITUELM emerges from void
        await this.playScene1();

        // Pulse in darkness (7s)
        await this.wait(7000);

        // Dissolve into void
        await this.dissolveScene1();

        // Void pause
        await this.wait(1200);

        // Scene 2: The farewell
        await this.playScene2();

        // Hold the sorrow (5s)
        await this.wait(5000);

        // Fade to void
        await this.fadeOutScene2();

        // Void pause
        await this.wait(1000);

        // Scene 3: Legendary return
        await this.playScene3();

        // Hold the power (6s)
        await this.wait(6000);

        // Fade to absolute black
        await this.fadeToBlack();

        console.log('🎬 Experience complete.');
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.director = new CinematicDirector();
});
