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
    console.log('SearchHero connected successfully');
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = this.shadowRoot.querySelector('.search-input');
    const searchButton = this.shadowRoot.querySelector('.search-button');
    
    const handleSearch = () => {
      const searchTerm = searchInput?.value.trim();
      if (searchTerm) {
        this.dispatchEvent(new CustomEvent('search-submitted', {
          bubbles: true,
          composed: true,
          detail: { 
            searchTerm,
            category: this.activeCategory,
          },
        }));
        console.log(`Search: "${searchTerm}" in category: ${this.activeCategory}`);
      }
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

customElements.define('search-hero', SearchHero);
export default SearchHero;