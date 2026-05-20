/* ═══════════════════════════════════════════
   ITUELM — Particle System
   Dark Energy / Mystical Sparks / Ambient Dust
   ═══════════════════════════════════════════ */

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.sparks = [];
        this.energyRings = [];
        this.energyColumns = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.active = true;
        this.intensity = 0;
        this.targetIntensity = 0;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        // Ambient dust particles — subtle, dark
        const dustCount = Math.min(120, Math.floor(this.width * this.height / 10000));
        for (let i = 0; i < dustCount; i++) {
            this.particles.push(this.createDustParticle());
        }

        // Energy sparks
        const sparkCount = 100;
        for (let i = 0; i < sparkCount; i++) {
            this.sparks.push(this.createSpark());
        }
    }

    createDustParticle() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 1.2 + 0.2,
            speedX: (Math.random() - 0.5) * 0.25,
            speedY: (Math.random() - 0.5) * 0.15 - 0.08,
            opacity: Math.random() * 0.25 + 0.05,
            color: Math.random() > 0.6 ? '160, 210, 255' : '0, 136, 255',
            life: Math.random() * 1000,
            maxLife: 1000 + Math.random() * 3000
        };
    }

    createSpark() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 250 + 80;

        return {
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            originX: centerX,
            originY: centerY,
            size: Math.random() * 2.5 + 0.5,
            speed: Math.random() * 2 + 0.5,
            angle: angle,
            opacity: 0,
            color: Math.random() > 0.4 ? '0, 204, 255' : '0, 136, 255',
            trail: [],
            maxTrail: 10,
            life: 0,
            maxLife: 50 + Math.random() * 120,
            active: false
        };
    }

    createEnergyRing() {
        const centerX = this.width / 2;
        const centerY = this.height / 2 + 60;

        return {
            x: centerX,
            y: centerY,
            radius: 15,
            maxRadius: Math.min(this.width, this.height) * 0.35,
            opacity: 0.5,
            speed: 2.5,
            width: 2.5,
            color: '0, 136, 255'
        };
    }

    createEnergyColumn(x) {
        return {
            x: x,
            y: this.height,
            height: 0,
            maxHeight: Math.random() * 150 + 80,
            width: Math.random() * 3 + 1,
            opacity: Math.random() * 0.4 + 0.2,
            speed: Math.random() * 3 + 2,
            color: Math.random() > 0.5 ? '0, 180, 255' : '0, 136, 255'
        };
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        });
    }

    setIntensity(value) {
        this.targetIntensity = Math.max(0, Math.min(1, value));
    }

    spawnSparkBurst(count = 12) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spark = {
                x: centerX + (Math.random() - 0.5) * 350,
                y: centerY + (Math.random() - 0.5) * 120,
                originX: centerX,
                originY: centerY,
                size: Math.random() * 4 + 1,
                speed: Math.random() * 5 + 2,
                angle: angle,
                opacity: Math.random() * 0.9 + 0.1,
                color: Math.random() > 0.3 ? '0, 204, 255' : '120, 220, 255',
                trail: [],
                maxTrail: 12,
                life: 0,
                maxLife: 35 + Math.random() * 70,
                active: true,
                vx: Math.cos(angle) * (Math.random() * 4 + 1.5),
                vy: Math.sin(angle) * (Math.random() * 4 + 1.5) - 1.5
            };
            this.sparks.push(spark);
        }
    }

    spawnDissolveParticles(count = 40) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spark = {
                x: centerX + (Math.random() - 0.5) * 450,
                y: centerY + (Math.random() - 0.5) * 180,
                originX: centerX,
                originY: centerY,
                size: Math.random() * 3 + 0.5,
                speed: Math.random() * 2.5 + 0.8,
                angle: angle,
                opacity: Math.random() * 0.7 + 0.15,
                color: Math.random() > 0.4 ? '0, 136, 255' : '80, 190, 255',
                trail: [],
                maxTrail: 8,
                life: 0,
                maxLife: 70 + Math.random() * 120,
                active: true,
                vx: Math.cos(angle) * (Math.random() * 3 + 0.8),
                vy: Math.sin(angle) * (Math.random() * 3 + 0.8) - 0.8
            };
            this.sparks.push(spark);
        }
    }

    spawnGroundSparks(count = 15) {
        const groundY = this.height * 0.85;
        const centerX = this.width / 2;

        for (let i = 0; i < count; i++) {
            const spark = {
                x: centerX + (Math.random() - 0.5) * 500,
                y: groundY + Math.random() * 30,
                originX: centerX,
                originY: groundY,
                size: Math.random() * 2.5 + 0.5,
                speed: Math.random() * 3 + 1,
                angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.8,
                opacity: Math.random() * 0.8 + 0.2,
                color: Math.random() > 0.4 ? '0, 180, 255' : '0, 136, 255',
                trail: [],
                maxTrail: 8,
                life: 0,
                maxLife: 40 + Math.random() * 80,
                active: true,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 4 - 1
            };
            this.sparks.push(spark);
        }
    }

    emitEnergyRing() {
        this.energyRings.push(this.createEnergyRing());
    }

    emitEnergyColumn() {
        const centerX = this.width / 2;
        const x = centerX + (Math.random() - 0.5) * 400;
        this.energyColumns.push(this.createEnergyColumn(x));
    }

    update() {
        this.intensity += (this.targetIntensity - this.intensity) * 0.04;

        // Update dust
        this.particles.forEach(p => {
            p.x += p.speedX * (1 + this.intensity * 2);
            p.y += p.speedY * (1 + this.intensity * 0.5);
            p.life++;

            if (p.x < -10) p.x = this.width + 10;
            if (p.x > this.width + 10) p.x = -10;
            if (p.y < -10) p.y = this.height + 10;
            if (p.y > this.height + 10) p.y = -10;

            if (p.life > p.maxLife) {
                p.life = 0;
                p.x = Math.random() * this.width;
                p.y = Math.random() * this.height;
            }
        });

        // Update sparks
        this.sparks = this.sparks.filter(s => {
            if (!s.active) return false;

            s.life++;
            s.x += s.vx || (Math.cos(s.angle) * s.speed);
            s.y += s.vy || (Math.sin(s.angle) * s.speed);

            if (s.vy !== undefined) {
                s.vy += 0.025;
            }

            s.trail.push({ x: s.x, y: s.y, opacity: s.opacity });
            if (s.trail.length > s.maxTrail) s.trail.shift();

            const lifeRatio = s.life / s.maxLife;
            s.opacity = (1 - lifeRatio) * (this.intensity * 0.85 + 0.15);

            return s.life < s.maxLife && s.opacity > 0.008;
        });

        // Auto-spawn
        if (this.intensity > 0.3 && Math.random() < this.intensity * 0.12) {
            this.spawnSparkBurst(4);
        }
        if (this.intensity > 0.5 && Math.random() < this.intensity * 0.08) {
            this.spawnGroundSparks(3);
        }
        if (this.intensity > 0.6 && Math.random() < 0.03) {
            this.emitEnergyColumn();
        }

        // Update energy rings
        this.energyRings = this.energyRings.filter(r => {
            r.radius += r.speed;
            r.opacity -= 0.007;
            r.width -= 0.015;
            return r.opacity > 0 && r.width > 0;
        });

        // Update energy columns
        this.energyColumns = this.energyColumns.filter(c => {
            c.height += c.speed;
            c.opacity -= 0.012;
            return c.opacity > 0 && c.height < c.maxHeight;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw energy columns (rising from ground)
        this.energyColumns.forEach(c => {
            const gradient = this.ctx.createLinearGradient(c.x, this.height, c.x, this.height - c.height);
            gradient.addColorStop(0, `rgba(${c.color}, ${c.opacity})`);
            gradient.addColorStop(0.5, `rgba(${c.color}, ${c.opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(${c.color}, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(c.x - c.width / 2, this.height - c.height, c.width, c.height);
        });

        // Draw energy rings
        this.energyRings.forEach(r => {
            this.ctx.beginPath();
            this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(${r.color}, ${r.opacity})`;
            this.ctx.lineWidth = Math.max(0.5, r.width);
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = `rgba(${r.color}, ${r.opacity * 0.6})`;
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        });

        // Draw dust particles
        this.particles.forEach(p => {
            const flicker = Math.sin(p.life * 0.04) * 0.25 + 0.75;
            const alpha = p.opacity * flicker * (0.25 + this.intensity * 0.75);

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
            this.ctx.shadowBlur = p.size * 4;
            this.ctx.shadowColor = `rgba(${p.color}, ${alpha * 0.6})`;
            this.ctx.fill();
        });

        // Draw sparks with trails
        this.sparks.forEach(s => {
            s.trail.forEach((t, i) => {
                const trailAlpha = (i / s.trail.length) * s.opacity * 0.4;
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y, s.size * (i / s.trail.length) * 0.8, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${s.color}, ${trailAlpha})`;
                this.ctx.fill();
            });

            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${s.color}, ${s.opacity})`;
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = `rgba(${s.color}, ${s.opacity * 0.8})`;
            this.ctx.fill();
        });

        this.ctx.shadowBlur = 0;
    }

    animate() {
        if (!this.active) return;

        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    destroy() {
        this.active = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    window.particleSystem = new ParticleSystem(canvas);
});
