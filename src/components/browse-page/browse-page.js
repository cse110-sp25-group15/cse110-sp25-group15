import html from './browse-page.html?raw';
import css from './browse-page.css?raw';
import './product-card/product-card.js';

class BrowsePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // Bind DOM elements
    this.dropdown = this.shadowRoot.getElementById('dropdown');

    // Bind event handlers
    this._handleSortChange = this._handleSortChange.bind(this);

    // Add event listeners
    this.dropdown?.addEventListener('change', this._handleSortChange);

    // Initial render
    this._renderDefaultCategory();
  }

  disconnectedCallback() {
    // Remove all event listeners to prevent memory leaks
    this.dropdown?.removeEventListener('change', this._handleSortChange);
  }

  // DOM-UPDATE HELPERS (Pure DOM mutations)
  _renderDefaultCategory() {
    setTimeout(() => {
      const allButton = this.shadowRoot.querySelector('category-button');
      if (allButton) {
        allButton.setAttribute('selected', '');
      }
    }, 100);
  }

  // EVENT HANDLERS
  _handleSortChange(e) {
    const selected = e.target.value;
    console.log(selected);
    
    if (this._isValidSortOption(selected)) {
      this.dispatchEvent(new CustomEvent('sort-change', {
        bubbles: true,
        composed: true,
        detail: { sortBy: selected },
      }));
    }
  }

  // UTILITY HELPERS (Pure functions)
  _isValidSortOption(option) {
    const validOptions = ['new', 'low', 'high', 'featured'];
    return validOptions.includes(option);
  }
}

customElements.define('browse-page', BrowsePage);