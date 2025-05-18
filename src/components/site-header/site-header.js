import html from './site-header.html?raw';
import css from './site-header.css?raw';

/**
 * Site Header Component
 * Displays the main navigation header with logo, links, and user icons
 */
class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Lifecycle callback when component is connected to the DOM
   */
  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.setupEventListeners();
  }

  /**
   * Sets up event listeners for the component
   */
  setupEventListeners() {
    const searchButton = this.shadowRoot.querySelector('.search-icon');
    const profileButton = this.shadowRoot.querySelector('.profile-icon');
    
    searchButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('search-click', {
        bubbles: true,
        composed: true,
      }));
    });
    
    profileButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('profile-click', {
        bubbles: true,
        composed: true,
      }));
    });
  }
}

customElements.define('site-header', SiteHeader);