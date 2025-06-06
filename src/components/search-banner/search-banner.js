import html from './search-banner.html?raw';
import css from './search-banner.css?raw';

/**
 * Search Hero Component
 * Hero section with search functionality and category filters
 */
class SearchHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.activeCategory = 'all';
  }

  connectedCallback() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = this.shadowRoot.querySelector('.search-input');
    const searchButton = this.shadowRoot.querySelector('.search-button');
    
    const handleSearch = () => {
      const query = searchInput.value.trim();
      if (query) {
        this.dispatchEvent(new CustomEvent('search-submit', {
          bubbles: true,
          composed: true,
          detail: { query },
        }));
      } else {
        window.notify('Please enter a search term', 'warning');
      }
      console.log(`Search submitted: ${query}`);
    };

    searchButton?.addEventListener('click', handleSearch);
    
    searchInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });

    // Category filter buttons
    const categoryBtns = this.shadowRoot.querySelectorAll('.category-btn');
    categoryBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.getAttribute('data-category');
        
        this.dispatchEvent(new CustomEvent('category-selected', {
          bubbles: true,
          composed: true,
          detail: { category: this.activeCategory },
        }));
        
        console.log(`Category selected: ${this.activeCategory}`);
      });
    });
  }
}

customElements.define('search-banner', SearchHero);
