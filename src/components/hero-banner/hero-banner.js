import html from './hero-banner.html?raw';
import css from './hero-banner.css?raw';

class HeroBanner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  
  connectedCallback() {
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    const browseLink = this.shadowRoot.querySelector('#browse-link');
    
    if (browseLink) {
      browseLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        const marketplaceSection = document.getElementById('marketplace');
        const browsePage = document.querySelector('browse-page');
        
        if (marketplaceSection) {
        
          marketplaceSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
          });
        } else if (browsePage) {
          
          browsePage.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
          });
        } else {
          
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
          });
        }
      });
    }
  }
}

customElements.define('hero-banner', HeroBanner);
export default HeroBanner;