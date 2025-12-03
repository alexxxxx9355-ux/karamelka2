/**
 * Частицы с паутинкой
 * Уменьшенный радиус реакции на мышь
 */

(function() {
    'use strict';
    
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    
    // Настройки — уменьшенный радиус
    const config = {
        particleCount: 50,                  // Чуть меньше частиц
        particleColor: '168, 85, 247',
        lineColor: '168, 85, 247',
        mouseLineColor: '251, 191, 36',
        particleSize: 2,
        lineDistance: 120,                  // Уменьшено с 150
        mouseDistance: 100,                 // Уменьшено с 200 — теперь реагирует только вблизи
        speed: 0.3,
        lineOpacity: 0.15,
        particleOpacity: 0.4
    };
    
    let particles = [];
    let mouse = { x: null, y: null };
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * config.speed;
            this.vy = (Math.random() - 0.5) * config.speed;
            this.size = Math.random() * config.particleSize + 0.5;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Мягкое отталкивание — только при близком наведении
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < config.mouseDistance && dist > 0) {
                    const force = (config.mouseDistance - dist) / config.mouseDistance;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${config.particleColor}, ${config.particleOpacity})`;
            ctx.fill();
        }
    }
    
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < config.lineDistance) {
                    const opacity = (1 - dist / config.lineDistance) * config.lineOpacity;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${config.lineColor}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            
            // Линии к мыши — только при близком наведении
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < config.mouseDistance) {
                    const opacity = (1 - dist / config.mouseDistance) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${config.mouseLineColor}, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    function init() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', () => { resize(); init(); });
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
    
    resize();
    init();
    animate();
})();
