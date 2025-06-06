import html from './product-card.html?raw';
import css from './product-card.css?raw';

class MarketplaceCard extends HTMLElement {
  static get observedAttributes() {
    return ['listing-id', 'title', 'price', 'image-url', 'date'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    // Component state
    this.imageLoaded = false;
  }

  connectedCallback() {
    // Bind DOM elements
    this.cardContainer = this.shadowRoot.querySelector('.card-container');
    this.imageElement = this.shadowRoot.querySelector('.card-image');
    this.imageContainer = this.shadowRoot.querySelector('.image-container');
    this.placeholderSvg = this.shadowRoot.querySelector('.placeholder-image');
    this.titleElement = this.shadowRoot.querySelector('.card-title');
    this.priceElement = this.shadowRoot.querySelector('.card-price');
    this.dateElement = this.shadowRoot.querySelector('.card-date');

    // Bind event handlers
    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleImageLoad = this._handleImageLoad.bind(this);
    this._handleImageError = this._handleImageError.bind(this);

    // Add event listeners
    this.cardContainer?.addEventListener('click', this._handleCardClick);
    this.imageElement?.addEventListener('load', this._handleImageLoad);
    this.imageElement?.addEventListener('error', this._handleImageError);

    // Initial render
    this._renderContent();
    this._renderInitialImage();
  }

  disconnectedCallback() {
    // Remove all event listeners to prevent memory leaks
    this.cardContainer?.removeEventListener('click', this._handleCardClick);
    this.imageElement?.removeEventListener('load', this._handleImageLoad);
    this.imageElement?.removeEventListener('error', this._handleImageError);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.shadowRoot) {return;}
    
    this._renderContent();
    
    if (name === 'image-url' && newValue) {
      this._renderImageLoading(newValue);
    }
  }

  // DOM-UPDATE HELPERS (Pure DOM mutations)
  _renderContent() {
    // Set title
    const title = this.getAttribute('title');
    if (this.titleElement) {
      this.titleElement.textContent = title || '';
    }
    
    // Set price
    const price = this.getAttribute('price');
    if (this.priceElement) {
      this.priceElement.textContent = price ? `$${price}` : '';
    }
    
    // Set image alt text
    if (this.imageElement) {
      this.imageElement.alt = title || 'Product image';
    }

    // Set date
    const listingDate = this.getAttribute('date');
    if (this.dateElement) {
      this.dateElement.textContent = listingDate ? this._getRelativeDate(listingDate) : '';
    }
  }

  _renderInitialImage() {
    if (!this.imageElement || !this.imageContainer) {return;}

    const imageUrl = this.getAttribute('image-url');
    if (imageUrl && imageUrl !== 'https://via.placeholder.com/300x400') {
      this._renderImageLoading(imageUrl);
    } else {
      this._renderImagePlaceholder();
    }
  }

  _renderImageLoading(url) {
    if (!this.imageElement || !this.imageContainer) {return;}

    // Reset states
    this.imageLoaded = false;
    this.imageElement.classList.remove('loaded');
    this.imageContainer.classList.remove('image-loaded');
    this.imageElement.style.display = 'block';
    
    // Start loading
    this.imageElement.src = url;
  }

  _renderImageLoaded() {
    if (!this.imageElement || !this.imageContainer) {return;}
    
    this.imageLoaded = true;
    this.imageElement.classList.add('loaded');
    this.imageContainer.classList.add('image-loaded');
  }

  _renderImageError() {
    if (!this.imageElement || !this.imageContainer) {return;}
    
    this.imageLoaded = false;
    this.imageContainer.classList.add('image-loaded');
    this.imageElement.style.display = 'none';
    
    if (this.placeholderSvg) {
      this.placeholderSvg.style.display = 'block';
    }
  }

  _renderImagePlaceholder() {
    if (!this.imageElement || !this.imageContainer) {return;}
    
    this.imageContainer.classList.add('image-loaded');
    this.imageElement.style.display = 'none';
    
    if (this.placeholderSvg) {
      this.placeholderSvg.style.display = 'block';
    }
  }

  // EVENT HANDLERS
  _handleCardClick() {
    this.dispatchEvent(new CustomEvent('card-click', {
      bubbles: true,
      composed: true,
      detail: { listingId: this.getAttribute('listing-id') },
    }));
  }

  _handleImageLoad() {
    this._renderImageLoaded();
  }

  _handleImageError() {
    this._renderImageError();
  }

  // UTILITY HELPERS (Pure functions)
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
}

customElements.define('product-card', MarketplaceCard);
export default MarketplaceCard;