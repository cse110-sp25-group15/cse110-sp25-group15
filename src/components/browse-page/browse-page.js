import html from './browse-page.html?raw';
import css from './browse-page.css?raw';
import './product-card/product-card.js';

class BrowsePage extends HTMLElement {
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
    console.log('BrowsePage connected');
  }
    
}

customElements.define('browse-page', BrowsePage);