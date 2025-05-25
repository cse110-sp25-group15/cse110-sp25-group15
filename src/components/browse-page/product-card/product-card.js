import html from './product-card.html?raw';
import css from './product-card.css?raw';

class MarketplaceCard extends HTMLElement {
  static get observedAttributes() {
    return ['listing-id', 'title', 'price', 'image-url', 'date'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.imageLoaded = false;
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
    this._setupImageLoading();
    
    // Add click event listener that emits a custom event
    this.shadowRoot.querySelector('.card-container')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('card-click', {
        bubbles: true,
        composed: true,
        detail: { listingId: this.getAttribute('listing-id') },
      }));
    });
  }

  _setupImageLoading() {
    const imageElement = this.shadowRoot.querySelector('.card-image');
    const imageContainer = this.shadowRoot.querySelector('.image-container');
    const placeholderSvg = this.shadowRoot.querySelector('.placeholder-image');

    if (!imageElement || !imageContainer) {return;}

    // Handle successful image load
    imageElement.addEventListener('load', () => {
      this.imageLoaded = true;
      imageElement.classList.add('loaded');
      imageContainer.classList.add('image-loaded');
    });

    // Handle image load error
    imageElement.addEventListener('error', () => {
      this.imageLoaded = false;
      imageContainer.classList.add('image-loaded'); // Hide skeleton and triton
      imageElement.style.display = 'none';
      if (placeholderSvg) {
        placeholderSvg.style.display = 'block';
      }
    });

    // Start loading if image URL is already set
    const imageUrl = this.getAttribute('image-url');
    if (imageUrl && imageUrl !== 'https://via.placeholder.com/300x400') {
      this._loadImage(imageUrl);
    } else {
      // No valid image URL, show placeholder immediately
      imageContainer.classList.add('image-loaded');
      imageElement.style.display = 'none';
      if (placeholderSvg) {
        placeholderSvg.style.display = 'block';
      }
    }
  }

  _loadImage(url) {
    const imageElement = this.shadowRoot.querySelector('.card-image');
    const imageContainer = this.shadowRoot.querySelector('.image-container');
    
    if (!imageElement || !imageContainer) {return;}

    // Reset states
    this.imageLoaded = false;
    imageElement.classList.remove('loaded');
    imageContainer.classList.remove('image-loaded');
    imageElement.style.display = 'block';
    
    // Start loading
    imageElement.src = url;
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
      
      // Handle image URL changes
      if (name === 'image-url' && newValue) {
        this._loadImage(newValue);
      }
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
        
    // Set image alt text
    if (imageElement) {
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