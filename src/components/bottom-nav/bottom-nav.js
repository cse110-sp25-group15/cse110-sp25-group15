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
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Handle back to top bar (entire bar is clickable)
    const backToTopBar = this.shadowRoot.querySelector('.back-to-top-bar');
    if (backToTopBar) {
      backToTopBar.addEventListener('click', () => {
        // First try to find the browse-page component
        const browsePage = document.querySelector('browse-page');
        if (browsePage) {
          browsePage.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Fallback to marketplace section
          const marketplaceSection = document.getElementById('marketplace');
          if (marketplaceSection) {
            marketplaceSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            // Final fallback to scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      });
    }

    // Handle newsletter form submission
    const newsletterForm = this.shadowRoot.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = this.shadowRoot.querySelector('.newsletter-input');
        const email = emailInput.value.trim();
        
        if (email) {
          // Dispatch custom event for newsletter signup
          this.dispatchEvent(new CustomEvent('newsletter-signup', {
            bubbles: true,
            composed: true,
            detail: { email },
          }));
          
          // Reset form and show feedback
          emailInput.value = '';
          this.showNewsletterFeedback('Thanks for subscribing!');
        }
      });
    }

    // Handle navigation clicks - scroll to marketplace section
    const browseLink = this.shadowRoot.querySelector('a[href="#marketplace"]');
    if (browseLink) {
      browseLink.addEventListener('click', (e) => {
        e.preventDefault();
        const marketplaceSection = document.getElementById('marketplace');
        if (marketplaceSection) {
          marketplaceSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Handle logo click
    const logo = this.shadowRoot.querySelector('.logo');
    if (logo) {
      logo.style.cursor = 'pointer';
      logo.addEventListener('click', () => {
        window.location.href = '/cse110-sp25-group15/';
      });
    }
  }

  showNewsletterFeedback(message) {
    const button = this.shadowRoot.querySelector('.newsletter-button');
    const originalText = button.textContent;
    
    button.textContent = message;
    button.style.background = '#28a745';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 2000);
  }
}

customElements.define('bottom-nav', BottomNav);
export default BottomNav;