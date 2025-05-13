import html from './product-card.html?raw';
import css from './product-card.css?raw';

class MarketplaceCard extends HTMLElement {
  static get observedAttributes() {
    return ['listing-id', 'title', 'price', 'image-url'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._images = [];
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
        
    // Set image - first try image-url attribute, then fall back to first image in _images array
    const imageUrl = this.getAttribute('image-url');
    if (imageUrl) {
      imageElement.src = imageUrl;
      imageElement.alt = title || 'Product image';
    } else if (this._images && this._images.length > 0) {
      // Use the first image from the images array
      imageElement.src = this._images[0].image_url;
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
            
      // Handle the various image scenarios
      if (data.image_url) {
        // Direct image_url on the listing
        this.setAttribute('image-url', data.image_url);
      } else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        // Images array under listing
        this._images = data.images;
        this._updateContent();
      } else {
        // No image found
        this.removeAttribute('image-url');
        this._images = [];
        this._updateContent();
      }
    }
  }
    
  get listing() {
    return {
      listing_id: this.getAttribute('listing-id'),
      title: this.getAttribute('title'),
      price: this.getAttribute('price'),
      image_url: this.getAttribute('image-url'),
      images: this._images,
    };
  }
}

customElements.define('product-card', MarketplaceCard);

export default MarketplaceCard;