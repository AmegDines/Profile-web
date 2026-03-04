document.addEventListener('DOMContentLoaded', () => {
    
    // --- Typing Effect ---
    const typingText = document.querySelector('.typing-text');
    const phrases = ["Data Science Student", "Machine Learning Enthusiast", "Software Engineer"];
    let phraseIndex = 0;
    let letterIndex = 0;
    let currentPhrase = [];
    let isDeleting = false;
    let typeSpeed = 100;

    function loop() {
        typingText.innerHTML = currentPhrase.join('');

        if (phraseIndex === phrases.length) {
            phraseIndex = 0;
        }

        if (phraseIndex < phrases.length) {
            let fullPhrase = phrases[phraseIndex];
            
            if (!isDeleting && letterIndex <= fullPhrase.length) {
                currentPhrase.push(fullPhrase[letterIndex]);
                letterIndex++;
                typeSpeed = 100;
            }

            if(isDeleting && letterIndex <= fullPhrase.length) {
                currentPhrase.pop();
                letterIndex--;
                typeSpeed = 50;
            }

            if (letterIndex == fullPhrase.length) {
                isDeleting = true;
                typeSpeed = 1500; // Pause at end of word
            }

            if (isDeleting && letterIndex === 0) {
                currentPhrase = [];
                isDeleting = false;
                phraseIndex++;
                typeSpeed = 500; // Pause before typing next word
            }
        }
        setTimeout(loop, typeSpeed);
    }

    loop();

    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Navbar Hide/Show on Scroll ---
    let prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
        let currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
            document.getElementById("navbar").style.top = "0";
        } else {
            document.getElementById("navbar").style.top = "-80px"; // Same as header height
        }
        prevScrollpos = currentScrollPos;
    }

    // --- Interactive Background Matrix/Network Effect ---
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    // get mouse position
    let mouse = {
        x: null,
        y: null,
        radius: (canvas.height/80) * (canvas.width/80)
    }

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // create particle
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = '#64ffda'; // Primary green
            ctx.fill();
        }

        // update position
        update() {
            // bounce off boundaries
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // collision detection - mouse position / particle
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            
            // Move particles away from mouse
            if (distance < mouse.radius + this.size){
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 10;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 10;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 10;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 10;
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 12000;
        // Decrease amount of particles for performance and visual clarity
        numberOfParticles = numberOfParticles > 100 ? 100 : numberOfParticles;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;
            let color = '#64ffda';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    // connect particles visually
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // resize event
    window.addEventListener('resize', function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.height/80));
        init();
    });

    init();
    animate();
});
