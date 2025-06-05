import css from './confetti.css?raw';

class ConfettiCelebration extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  celebrate() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    
    const style = document.createElement('style');
    style.textContent = css;
    
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#04133B', '#F3C114', '#FFFFFF']; 
   
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: Math.random() * 3 - 1.5,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; 
        p.rotation += p.rotationSpeed;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
     
        if (p.y > canvas.height) {
          particles.splice(index, 1);
        }
      });
      
      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
        style.remove();
      }
    };
    
    animate();
  }
}

customElements.define('confetti-celebration', ConfettiCelebration);

window.celebrate = () => {
  const confetti = document.createElement('confetti-celebration');
  document.body.appendChild(confetti);
  confetti.celebrate();
  setTimeout(() => confetti.remove(), 5000);
};

export default ConfettiCelebration;