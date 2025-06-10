import html from './hero-banner.html?raw';
import css from './hero-banner.css?raw';

/**
 * A hero banner component that displays promotional content with navigation.
 * 
 * States:
 * - Default: Shows hero content with interactive browse link
 * 
 * Purpose:
 * - Displays prominent banner content at the top of pages
 * - Provides smooth scroll navigation to marketplace sections
 * - Uses slot content for customizable hero messaging
 */
class HeroBanner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.browseLink = this.shadowRoot.querySelector('#browse-link');

    this._handleBrowseClick = this._handleBrowseClick.bind(this);

    if (this.browseLink) {
      this.browseLink.addEventListener('click', this._handleBrowseClick);
    }
  }

  disconnectedCallback() {
    if (this.browseLink) {
      this.browseLink.removeEventListener('click', this._handleBrowseClick);
    }
  }

  _handleBrowseClick(e) {
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
  }
}

customElements.define('hero-banner', HeroBanner);
export default HeroBanner;