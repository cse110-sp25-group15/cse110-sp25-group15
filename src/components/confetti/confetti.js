class ConfettiCelebration extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  celebrate() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    this.shadowRoot.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#04133B', '#F3C114', '#FFFFFF']; // UCSD colors
    
    // Create particles
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
        p.vy += 0.1; // gravity
        p.rotation += p.rotationSpeed;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
        
        // Remove particles that fall off screen
        if (p.y > canvas.height) {
          particles.splice(index, 1);
        }
      });
      
      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };
    
    animate();
  }
}

customElements.define('confetti-celebration', ConfettiCelebration);

// Global helper
window.celebrate = () => {
  const confetti = document.createElement('confetti-celebration');
  document.body.appendChild(confetti);
  confetti.celebrate();
  setTimeout(() => confetti.remove(), 5000);
};

export default ConfettiCelebration;