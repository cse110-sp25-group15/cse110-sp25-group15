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

  static get observedAttributes() {
    return ['new', 'low', 'high'];
  }

  connectedCallback() {
    console.log('BrowsePage connected');
    const dropdown = this.shadowRoot.getElementById('dropdown');

    dropdown.addEventListener('change', (e) => {
      const selected = e.target.value;
      console.log(e.target.value);
      ['new' , 'low', 'high'].forEach((attr) => this.removeAttribute(attr));

      this.setAttribute(selected);
    });
  }

  attributeChangedCallback(name, _oldValue, _newValue) {
    if (name === null) {return;}

    this.dispatchEvent(new CustomEvent('sort-change', {
      bubbles: true,
      composed: true,
    },
    ));
    
  }
}

customElements.define('browse-page', BrowsePage);