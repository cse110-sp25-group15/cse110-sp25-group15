/**
 * Hero Banner Component
 * Displays the main landing section with navigation, headline, and CTA
 */
export default class HeroBanner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Lifecycle callback when component is connected to the DOM
   */
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  /**
   * Renders the component's HTML and CSS
   */
  render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        /* ─── VARIABLES & RESET ─── */
        :root {
          --nav-h: 76px;
          --blue: #04133B;
          --gold: #F3C114;
          --white: #FFFFFF;
          --font: "Segoe UI", Arial, sans-serif;
          --navy-text: #04133B;
        }
        
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        :host {
          display: block;
          height: 100vh;
          background: var(--blue);
          color: var(--white);
        }
        
        .site-header {
          position: fixed;
          top: 0; left: 0;
          width: 100%;
          height: var(--nav-h);
          background: var(--blue);
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          padding: 0 1rem;
          z-index: 10;
        }
        
        .site-header .logo {
          display: inline-flex;
          align-items: center;
          color: var(--gold);
          font-weight: bold;
        }
        
        .site-header .logo img {
          height: 32px;
          margin-right: 0.5rem;
        }
        
        .site-header .logo span {
          font-size: 1.2rem;
        }
        
        .main-nav {
          justify-self: center;
          display: flex;
          gap: 2rem;
        }
        
        .main-nav a {
          color: var(--gold);
          text-decoration: none;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        
        .user-icons {
          justify-self: end;
          font-size: 1.25rem;
        }
        
        main {
          position: absolute;
          top: var(--nav-h);
          left: 0;
          right: 0;
          bottom: 0;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scrollbar-width: none;   
        }
        
        main > section {
          scroll-snap-align: start;
          height: calc(100vh - var(--nav-h));
        }
        
        .hero {
          display: flex;
          align-items: center;
          height: calc(100vh - var(--nav-h));
          padding-top: 0; 
        }
        
        .hero-text {
          flex: 0 0 1rem;
          padding: 1rem;
          white-space: nowrap;
        }
        
        .hero-text h1 {
          font-size: clamp(2rem, 6vw, 6rem);
          line-height: 1;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        
        .btn {
          display: inline-block;
          background: var(--gold);
          color: var(--blue);
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 700;
          padding: 0.75rem 2rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          transition: background-color 0.3s ease;
        }
        
        .btn:hover {
          background-color: #d4a90f;
        }
        
        .tagline {
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          opacity: 0.8;
          margin: 0;
        }
        
        .hero-image {
          flex: 1;
          height: 100%;
          padding-left: 10%;
          overflow: hidden;
          border-radius: 1.5rem 0 0 1.5rem;
        }
        
        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          border-radius: 1.5rem 0 0 1.5rem;
        }
        
        @media (max-width: 800px) {
          .hero {
            flex-direction: column-reverse;
            text-align: center;
          }
          
          .hero-text {
            white-space: normal;
            padding: 2rem;
          }
          
          .hero-image {
            width: 100%;
            height: auto;
            border-radius: 1.5rem;
            margin-top: 2rem;
          }
        }
      </style>
      ${this.getTemplate()}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * Gets the HTML template for the component
   * @returns {string} The HTML template
   */
  getTemplate() {
    return `
      <header class="site-header">
        <div class="logo">
          <img src="../../assets/triton.png" alt="Triton trident">
          <span>MARKETPLACE</span>
        </div>
        <nav class="main-nav">
          <a href="/browse">BROWSE</a>
          <a href="/list">LIST AN ITEM</a>
        </nav>
        <div class="user-icons">
          <button class="icon-button search-icon" aria-label="Search">🔍</button>
          <button class="icon-button profile-icon" aria-label="Profile">👤</button>
        </div>
      </header>

      <main>
        <section class="hero">
          <div class="hero-text">
            <h1>DISCOVER<br>BUY OR SELL.</h1>
            <a href="#" class="btn">START BROWSING</a>
            <p class="tagline">A TRUSTED DIGITAL MARKETPLACE FOR STUDENTS AND STAFF</p>
          </div>
          <div class="hero-image">
            <img src="../../assets/geisel.jpg" alt="Geisel Library at sunset">
          </div>
        </section>
      </main>
    `;
  }

  /**
   * Sets up event listeners for the component
   */
  setupEventListeners() {
    const ctaButton = this.shadowRoot.querySelector('.btn');
    ctaButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('hero-start', {
        bubbles: true,
        composed: true
      }));
    });
  }
}

customElements.define('hero-banner', HeroBanner);
