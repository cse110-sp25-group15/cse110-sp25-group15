export class ConfettiController {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.colors = ['#04133B', '#F3C114', '#FFFFFF']; // UCSD colors
  }

  init() {
    this.canvas = document.querySelector('.confetti-canvas');
    
    if (!this.canvas) {
      console.error('Canvas element with class "confetti-canvas" not found');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.setupCanvas();
    // Make celebrate function globally available
    window.celebrate = () => this.celebrate();
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  celebrate() {
    // Clear any existing animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Reset particles array
    this.particles = [];
    
    // Create particles
    for (let i = 0; i < 150; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height - this.canvas.height,
        vx: Math.random() * 3 - 1.5,
        vy: Math.random() * 3 + 2,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        size: Math.random() * 5 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
      });
    }
    
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Update particle position and rotation
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.rotation += p.rotationSpeed;
      
      // Draw particle
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation * Math.PI / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
      this.ctx.restore();
      
      // Remove particles that fall off screen
      if (p.y > this.canvas.height) {
        this.particles.splice(i, 1);
      }
    }
    
    // Continue animation if particles remain
    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationId = null;
    }
  }

  // Method to stop animation if needed
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.particles = [];
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}