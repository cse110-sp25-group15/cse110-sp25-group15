import templateHTML from './category-item.html?raw';
import templateCSS from './category-item.css?raw';

/**
 * Web component representing a category item.
 * 
 * Meant to be used in a list of categories, where each item can have an icon and a label.
 * 
 * @example
 * <category-item>
 *   <span slot="icon">🔔</span>
 *   <span slot="label">Notifications</span>
 * </category-item>
 */
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
