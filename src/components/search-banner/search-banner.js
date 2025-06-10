import html from './search-banner.html?raw';
import css from './search-banner.css?raw';

/**
 * A search banner component with search input and category filter buttons.
 * 
 * States:
 * - Default: All categories button active, search input empty
 * - Category Selected: One of the category buttons is active/highlighted
 * - Search Active: User has entered search terms
 * 
 * Purpose:
 * - Provides search input field for marketplace queries
 * - Displays category filter buttons for product filtering
 * - Handles search submission via button click or Enter key
 * - Manages active category state with visual feedback
 * - Emits search-submit and category-selected events
 * - Validates search input and shows user feedback
 */
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
    // Bind DOM elements
    this.searchInput = this.shadowRoot.querySelector('.search-input');
    this.searchButton = this.shadowRoot.querySelector('.search-button');
    this.categoryBtns = this.shadowRoot.querySelectorAll('.category-btn');

    // Bind event handlers
    this._handleSearchClick = this._handleSearchClick.bind(this);
    this._handleSearchKeypress = this._handleSearchKeypress.bind(this);

    // Add event listeners
    this.searchButton.addEventListener('click', this._handleSearchClick);
    this.searchInput.addEventListener('keypress', this._handleSearchKeypress);

    this.categoryBtns.forEach((btn) => {
      btn.addEventListener('click', () => this._handleCategoryClick(btn));
    });
  }

  disconnectedCallback() {
    this.searchButton.removeEventListener('click', this._handleSearchClick);
    this.searchInput.removeEventListener('keypress', this._handleSearchKeypress);

    this.categoryBtns.forEach((btn) => {
      btn.removeEventListener('click', () => this._handleCategoryClick(btn));
    });
  }

  /**
   * Updates the active state of category buttons
   */
  _renderActiveCategory(activeBtn) {
    this.categoryBtns.forEach((btn) => {
      btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
  }

  _handleSearchClick() {
    this._submitSearch();
  }

  _handleSearchKeypress(e) {
    if (e.key === 'Enter') {
      this._submitSearch();
    }
  }

  _handleCategoryClick(btn) {
    this._renderActiveCategory(btn);
    this.activeCategory = btn.getAttribute('data-category');
    
    this.dispatchEvent(new CustomEvent('category-selected', {
      bubbles: true,
      composed: true,
      detail: { category: this.activeCategory },
    }));
  }

  _submitSearch() {
    const query = this.searchInput.value.trim();
    if (!query) {
      window.notify('Please enter a search term', 'warning');
      return;
    }
    
    this.dispatchEvent(new CustomEvent('search-submit', {
      bubbles: true,
      composed: true,
      detail: { query },
    }));
  }
}

customElements.define('search-banner', SearchHero);