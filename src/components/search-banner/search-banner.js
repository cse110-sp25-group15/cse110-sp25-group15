import html from './search-banner.html?raw';
import css from './search-banner.css?raw';

class SearchHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.activeCategory = 'all';
  }

  connectedCallback() {
    this._bindEvents();
  }

  _bindEvents() {
    const searchInput = this.shadowRoot.querySelector('.search-input');
    const searchButton = this.shadowRoot.querySelector('.search-button');

    const submitSearch = () => {
      const query = searchInput.value.trim();
      if (!query) {
        window.notify('Please enter a search term', 'warning');
        return;
      }
      this.dispatchEvent(
        new CustomEvent('search-submit', {
          bubbles: true,
          composed: true,
          detail: { query },
        }),
      );
    };

    searchButton.addEventListener('click', submitSearch);
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && submitSearch());

    this.shadowRoot.querySelectorAll('.category-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.shadowRoot.querySelectorAll('.category-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.getAttribute('data-category');
        this.dispatchEvent(
          new CustomEvent('category-selected', {
            bubbles: true,
            composed: true,
            detail: { category: this.activeCategory },
          }),
        );
      });
    });
  }
}

customElements.define('search-banner', SearchHero);
