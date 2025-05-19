import html from './browse-page.html?raw';
import css from './browse-page.css?raw';
import './product-card/product-card.js';

class BrowsePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `
          <style>${css}</style>
          ${html}
      `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
        
    // dispatch event when component is fully connected
    this.dispatchEvent(new CustomEvent('browse-page-connected', {
      bubbles: true,
      composed: true,
    }));
  }
    
}

customElements.define('browse-page', BrowsePage);