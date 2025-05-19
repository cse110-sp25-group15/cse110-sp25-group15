import html from './product-card.html?raw';
import css from './product-card.css?raw';

class MarketplaceCard extends HTMLElement {
  static get observedAttributes() {
    return ['listing-id', 'title', 'price', 'image-url'];
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
  }
}

customElements.define('product-card', MarketplaceCard);

export default MarketplaceCard;