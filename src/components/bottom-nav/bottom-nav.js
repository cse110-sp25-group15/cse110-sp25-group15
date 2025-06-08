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
    this.backToTopBar = this.shadowRoot.querySelector('.back-to-top-bar');
    this.newsletterForm = this.shadowRoot.querySelector('.newsletter-form');
    this.emailInput = this.shadowRoot.querySelector('.newsletter-input');
    this.newsletterButton = this.shadowRoot.querySelector('.newsletter-button');
    this.browseLink = this.shadowRoot.querySelector('a[href="#marketplace"]');
    this.logo = this.shadowRoot.querySelector('.logo');

    this._handleBackToTop = this._handleBackToTop.bind(this);
    this._handleNewsletterSubmit = this._handleNewsletterSubmit.bind(this);
    this._handleBrowseClick = this._handleBrowseClick.bind(this);
    this._handleLogoClick = this._handleLogoClick.bind(this);

    this.backToTopBar?.addEventListener('click', this._handleBackToTop);
    this.newsletterForm?.addEventListener('submit', this._handleNewsletterSubmit);
    this.browseLink?.addEventListener('click', this._handleBrowseClick);
    this.logo?.addEventListener('click', this._handleLogoClick);
  }

  disconnectedCallback() {
    this.backToTopBar?.removeEventListener('click', this._handleBackToTop);
    this.newsletterForm?.removeEventListener('submit', this._handleNewsletterSubmit);
    this.browseLink?.removeEventListener('click', this._handleBrowseClick);
    this.logo?.removeEventListener('click', this._handleLogoClick);
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

  _handleBackToTop() {
    const browsePage = document.querySelector('browse-page');
    if (browsePage) {
      browsePage.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const marketplaceSection = document.getElementById('marketplace');
    if (marketplaceSection) {
      marketplaceSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  _handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = this._getEmailValue();
    if (!email) {return;}

    this.dispatchEvent(new CustomEvent('newsletter-signup', {
      bubbles: true,
      composed: true,
      detail: { email },
    }));

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

  _getEmailValue() {
    return this.emailInput?.value.trim() || '';
  }
}

customElements.define('bottom-nav', BottomNav);
export default BottomNav;
