import html from './product-card.html?raw';
import css from './product-card.css?raw';

class MarketplaceCard extends HTMLElement {
  static get observedAttributes() {
    return ['listing-id', 'title', 'price', 'image-url', 'date'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
        
    // Set initial data if attributes are present
    this._updateContent();
    
    // Add click event listener that emits a custom event
    this.shadowRoot.querySelector('.card-container')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('card-click', {
        bubbles: true,
        composed: true,
        detail: { listingId: this.getAttribute('listing-id') },
      }));
    });
  }

  _getRelativeDate(dateString) {
    if (!dateString) {return '';}
    // Parse "YYYY-MM-DD" format
    const [year, month, day] = dateString.split('-').map(Number);
    const then = new Date(year, month - 1, day);
    const now = new Date();

    then.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffMs = now - then;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {return 'Listed today';}
    if (diffDays === 1) {return 'Listed yesterday';}
    if (diffDays < 7) {return `Listed ${diffDays} days ago`;}
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Listed ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Listed ${months} month${months > 1 ? 's' : ''} ago`;
    }
    return `Listed ${then.toLocaleDateString()}`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Only update if the value actually changed
    if (oldValue !== newValue && this.shadowRoot) {
      this._updateContent();
    }
  }

  _updateContent() {
    // Get elements
    const titleElement = this.shadowRoot.querySelector('.card-title');
    const priceElement = this.shadowRoot.querySelector('.card-price');
    const imageElement = this.shadowRoot.querySelector('.card-image');
    const dateElement = this.shadowRoot.querySelector('.card-date');
        
    // Set title
    const title = this.getAttribute('title');
    if (titleElement) {
      titleElement.textContent = title || '';
    }
        
    // Set price
    const price = this.getAttribute('price');
    if (priceElement) {
      priceElement.textContent = price ? `$${price}` : '';
    }
        
    // Set image
    const imageUrl = this.getAttribute('image-url');
    if (imageElement) {
      imageElement.src = imageUrl || 'https://via.placeholder.com/300x400';
      imageElement.alt = title || 'Product image';
    }

    const listingDate = this.getAttribute('date');
    if (dateElement) {
      dateElement.textContent = listingDate ? this._getRelativeDate(listingDate) : '';
    }
  }

}

customElements.define('product-card', MarketplaceCard);

export default MarketplaceCard;