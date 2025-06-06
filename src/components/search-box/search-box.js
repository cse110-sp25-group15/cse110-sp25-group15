import html from './search-box.html?raw';
import css from './search-box.css?raw';

/**
 * Search Box Component
 * Provides search functionality for the site header
 */
class SearchBox extends HTMLElement {
  /**
   * Constructor initializes the component
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Lifecycle callback when component is connected to the DOM
   */
  connectedCallback() {
    // Create template and add to shadow DOM
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Dispatch event when component is fully connected
    this.dispatchEvent(new CustomEvent('search-connected', {
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Sets up event listeners for the component
   */
  setupEventListeners() {
    // Get references to elements within the shadow DOM
    const searchIcon = this.shadowRoot.querySelector('.search-icon');
    const searchContainer = this.shadowRoot.querySelector('.search-container');
    const searchInput = this.shadowRoot.querySelector('.search-input');
    const searchForm = this.shadowRoot.querySelector('.search-form');
    
    // Toggle search bar when icon is clicked
    if (searchIcon) {
      searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
          searchInput.focus();
        }
        
        // Dispatch the custom event for external listeners
        this.dispatchEvent(new CustomEvent('search-click', {
          bubbles: true,
          composed: true,
        }));
      });
    }
    
    // Handle search submission
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          // Dispatch a custom event with the search query
          this.dispatchEvent(new CustomEvent('search-submit', {
            bubbles: true,
            composed: true,
            detail: { query },
          }));
          
          // Reset and close the search after submission
          searchInput.value = '';
          searchContainer.classList.remove('active');
        } else {
          window.notify('Please enter a search term', 'warning');
        }
      });
    }
    
    // Close search when ESC key is pressed
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchContainer && searchContainer.classList.contains('active')) {
        searchContainer.classList.remove('active');
      }
    });
  }
  
  /**
   * Public method to programmatically toggle the search box
   * @param {boolean} [show=true] - Whether to show or hide the search box
   */
  toggleSearch(show = true) {
    const searchContainer = this.shadowRoot.querySelector('.search-container');
    const searchInput = this.shadowRoot.querySelector('.search-input');
    
    if (searchContainer) {
      if (show) {
        searchContainer.classList.add('active');
        if (searchInput) {searchInput.focus();}
      } else {
        searchContainer.classList.remove('active');
      }
    }
    
    return this;
  }
}

// Register the custom element
customElements.define('search-box', SearchBox);
export default SearchBox;