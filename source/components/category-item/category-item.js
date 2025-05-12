import templateHTML from './category-item.html?raw';
import templateCSS from './category-item.css?raw';

class CategoryItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `<style>${templateCSS}</style>${templateHTML}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('category-item', CategoryItem);
