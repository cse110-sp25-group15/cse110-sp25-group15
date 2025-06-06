import html from './bottom-nav.html?raw';
import css from './bottom-nav.css?raw';

/**
 * Bottom Navigation Component
 * Provides footer navigation and newsletter signup
 */
class BottomNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // Bind DOM elements
    this.backToTopBar = this.shadowRoot.querySelector('.back-to-top-bar');
    this.newsletterForm = this.shadowRoot.querySelector('.newsletter-form');
    this.emailInput = this.shadowRoot.querySelector('.newsletter-input');
    this.newsletterButton = this.shadowRoot.querySelector('.newsletter-button');
    this.browseLink = this.shadowRoot.querySelector('a[href="#marketplace"]');
    this.logo = this.shadowRoot.querySelector('.logo');

    // Bind event handlers
    this._handleBackToTop = this._handleBackToTop.bind(this);
    this._handleNewsletterSubmit = this._handleNewsletterSubmit.bind(this);
    this._handleBrowseClick = this._handleBrowseClick.bind(this);
    this._handleLogoClick = this._handleLogoClick.bind(this);

    // Add event listeners
    this.backToTopBar?.addEventListener('click', this._handleBackToTop);
    this.newsletterForm?.addEventListener('submit', this._handleNewsletterSubmit);
    this.browseLink?.addEventListener('click', this._handleBrowseClick);
    this.logo?.addEventListener('click', this._handleLogoClick);

    // Initial render
    this._renderLogoClickable();
  }

  disconnectedCallback() {
    // Remove all event listeners to prevent memory leaks
    this.backToTopBar?.removeEventListener('click', this._handleBackToTop);
    this.newsletterForm?.removeEventListener('submit', this._handleNewsletterSubmit);
    this.browseLink?.removeEventListener('click', this._handleBrowseClick);
    this.logo?.removeEventListener('click', this._handleLogoClick);
  }

  // DOM-UPDATE HELPERS (Pure DOM mutations)
  _renderLogoClickable() {
    if (this.logo) {
      this.logo.style.cursor = 'pointer';
    }
  }

  _renderNewsletterSuccess() {
    if (!this.newsletterButton) {return;}
    
    const originalText = this.newsletterButton.textContent;
    this.newsletterButton.textContent = 'Thanks for subscribing!';
    this.newsletterButton.style.background = '#28a745';
    
    setTimeout(() => {
      this.newsletterButton.textContent = originalText;
      this.newsletterButton.style.background = '';
    }, 2000);
  }

  _renderEmailCleared() {
    if (this.emailInput) {
      this.emailInput.value = '';
    }
  }

  // EVENT HANDLERS
  _handleBackToTop() {
    // First try to find the browse-page component
    const browsePage = document.querySelector('browse-page');
    if (browsePage) {
      browsePage.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Fallback to marketplace section
    const marketplaceSection = document.getElementById('marketplace');
    if (marketplaceSection) {
      marketplaceSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Final fallback to scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  _handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const email = this._getEmailValue();
    if (!email) {return;}
    
    // Dispatch custom event for newsletter signup
    this.dispatchEvent(new CustomEvent('newsletter-signup', {
      bubbles: true,
      composed: true,
      detail: { email },
    }));
    
    // Update UI
    this._renderEmailCleared();
    this._renderNewsletterSuccess();
  }

  _handleBrowseClick(e) {
    e.preventDefault();
    const marketplaceSection = document.getElementById('marketplace');
    if (marketplaceSection) {
      marketplaceSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  _handleLogoClick() {
    window.location.href = '/cse110-sp25-group15/';
  }

  // UTILITY HELPERS (Pure functions)
  _getEmailValue() {
    return this.emailInput?.value.trim() || '';
  }
}

customElements.define('bottom-nav', BottomNav);
export default BottomNav;