import html from './marketplace-card.html?raw';
import css from './marketplace-card.css?raw';

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
  }

  attributeChangedCallback(_name, _oldValue, _newValue) {
    if (this.shadowRoot) {
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
    if (title) {
      titleElement.textContent = title;
    }
        
    // Set price
    const price = this.getAttribute('price');
    if (price) {
      priceElement.textContent = `$${price}`;
    }
        
    // Set image
    const imageUrl = this.getAttribute('image-url');
    if (imageUrl) {
      imageElement.src = imageUrl;
      imageElement.alt = title || 'Product image';
    } else {
      // Show placeholder if no image
      imageElement.style.display = 'none';
      this.shadowRoot.querySelector('.placeholder-image').style.display = 'block';
    }
  }
    
  // Getter and setter for listing data
  set listing(data) {
    if (data) {
      this.setAttribute('listing-id', data.listing_id || '');
      this.setAttribute('title', data.title || '');
      this.setAttribute('price', data.price || '');
      this.setAttribute('image-url', data.image_url || ''); // Assuming there's an image_url field
    }
  }
    
  get listing() {
    return {
      listing_id: this.getAttribute('listing-id'),
      title: this.getAttribute('title'),
      price: this.getAttribute('price'),
      image_url: this.getAttribute('image-url'),
    };
  }
}

customElements.define('marketplace-card', MarketplaceCard);

export default MarketplaceCard;