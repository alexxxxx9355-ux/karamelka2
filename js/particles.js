/**
 * Частицы с паутинкой и реакцией на мышь
 * Карамелька AI
 */

(function() {
    'use strict';
    
    // Создаём canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    
    // Настройки
    const config = {
        particleCount: 60,
        particleColor: '168, 85, 247',      // Фиолетовый
        lineColor: '168, 85, 247',          // Фиолетовый
        mouseLineColor: '251, 191, 36',     // Оранжевый
        particleSize: 2,
        lineDistance: 150,
        mouseDistance: 200,
        speed: 0.4,
        lineOpacity: 0.2,
        particleOpacity: 0.5
    };
    
    let particles = [];
    let mouse = { x: null, y: null };
    let animationId;
    
    // Размер canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Класс частицы
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * config.speed;
            this.vy = (Math.random() - 0.5) * config.speed;
            this.size = Math.random() * config.particleSize + 1;
        }
        
        update() {
            // Движение
            this.x += this.vx;
            this.y += this.vy;
            
            // Отскок от краёв
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Реакция на мышь
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < config.mouseDistance) {
                    const force = (config.mouseDistance - dist) / config.mouseDistance;
                    this.x += (dx / dist) * force * 2;
                    this.y += (dy / dist) * force * 2;
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
    
    // Рисуем линии
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            // Линии между частицами
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
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
            
            // Линии к мыши
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < config.mouseDistance) {
                    const opacity = (1 - dist / config.mouseDistance) * 0.4;
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
    
    // Инициализация
    function init() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Анимация
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawLines();
        
        animationId = requestAnimationFrame(animate);
    }
    
    // События
    function setupEvents() {
        window.addEventListener('resize', () => {
            resize();
            init();
        });
        
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });
        
        // Для тач-устройств
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        });
        
        window.addEventListener('touchend', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }
    
    // Запуск
    function start() {
        resize();
        init();
        setupEvents();
        animate();
    }
    
    // Ждём загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
    
})();
