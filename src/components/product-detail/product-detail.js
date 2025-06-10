import templateHTML from './product-detail.html?raw';
import templateCSS from './product-detail.css?raw';

/**
 * A modal component that displays detailed product information in an overlay.
 * 
 * States:
 * - Hidden: Modal is not visible, body scroll is enabled
 * - Visible: Modal is displayed as overlay, body scroll is locked
 * - Gallery Navigation: User can navigate through multiple product images
 * - Contact Mode: Shows disclaimer after contact button is clicked
 * 
 * Purpose:
 * - Displays comprehensive product details in a modal overlay
 * - Provides image gallery with navigation for multiple product images
 * - Handles contact seller functionality with visual feedback
 * - Manages modal behavior (show/hide, escape key, overlay click)
 * - Prevents body scroll when modal is open
 * - Emits contact-seller events for parent components
 */
class ProductViewer extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'price', 'condition', 'date', 'description', 'images', 'lister-name'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `<style>${templateCSS}</style>${templateHTML}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._currentIndex = 0;
    this._isVisible = false;
    this.MSG_PLACEHOLDER = 'Hi, is this still available?';
  }

  connectedCallback() {
    // Bind DOM elements
    this.gallery = this.shadowRoot.querySelector('.gallery');
    this.sendButton = this.shadowRoot.querySelector('.send-btn');
    this.closeButton = this.shadowRoot.querySelector('.close-btn');
    this.overlay = this.shadowRoot.querySelector('.overlay');
    this.productDetail = this.shadowRoot.querySelector('.product-detail');
    this.mainImg = this.shadowRoot.querySelector('.main-image');
    this.thumbStrip = this.shadowRoot.querySelector('.thumb-strip');
    this.contactMsg = this.shadowRoot.querySelector('.contact-message');

    // Bind event handlers
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleContactClick = this._handleContactClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleOverlayClick = this._handleOverlayClick.bind(this);
    this._stopPropagation = this._stopPropagation.bind(this);
    this._handleEscKey = this._handleEscKey.bind(this);

    // Add event listeners
    if (this.gallery) {this.gallery.addEventListener('keydown', this._handleKeyDown);}
    if (this.sendButton) {this.sendButton.addEventListener('click', this._handleContactClick);}
    if (this.closeButton) {this.closeButton.addEventListener('click', this._handleCloseClick);}
    if (this.overlay) {this.overlay.addEventListener('click', this._handleOverlayClick);}
    if (this.productDetail) {this.productDetail.addEventListener('click', this._stopPropagation);}
    document.addEventListener('keydown', this._handleEscKey);

    // Initialize component
    this._renderOverlayHidden();
    this._renderContent();
  }

  disconnectedCallback() {
    if (this.gallery) {this.gallery.removeEventListener('keydown', this._handleKeyDown);}
    if (this.sendButton) {this.sendButton.removeEventListener('click', this._handleContactClick);}
    if (this.closeButton) {this.closeButton.removeEventListener('click', this._handleCloseClick);}
    if (this.overlay) {this.overlay.removeEventListener('click', this._handleOverlayClick);}
    if (this.productDetail) {this.productDetail.removeEventListener('click', this._stopPropagation);}
    document.removeEventListener('keydown', this._handleEscKey);

    if (this._isVisible) {
      this._renderBodyScrollUnlocked();
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {return;}
    if (this.mainImg) {
      this._renderContent();
    }
  }

  /**
   * Updates the main image display and product information
   */
  _renderContent() {
    this._renderMainImage();
    this._renderThumbnails();
    this._renderProductInfo();
  }

  /**
   * Updates the main product image display
   */
  _renderMainImage() {
    const images = this.images;
    if (this.mainImg) {
      this.mainImg.src = images[this._currentIndex] || '';
      this.mainImg.alt = this.getAttribute('name') || 'Product image';
    }
  }

  /**
   * Renders thumbnail strip for image navigation
   */
  _renderThumbnails() {
    if (!this.thumbStrip) {return;}
    
    this.thumbStrip.innerHTML = '';
    const images = this.images;
    
    // Only show thumbnails if there are multiple images
    if (images.length > 1) {
      images.forEach((src, idx) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.alt = `Thumbnail ${idx + 1}`;
        thumb.className = idx === this._currentIndex ? 'active' : '';
        thumb.tabIndex = 0;
        thumb.addEventListener('click', () => this._handleThumbnailClick(idx));
        this.thumbStrip.appendChild(thumb);
      });
    }
  }

  /**
   * Updates all product information text fields
   */
  _renderProductInfo() {
    this._renderTextField('.product-name', this.getAttribute('name'));
    this._renderTextField('.price', this.getAttribute('price') ? `$${this.getAttribute('price')}` : '');
    this._renderTextField('.condition', this.getAttribute('condition'));
    this._renderTextField('.date', this.getAttribute('date'));
    this._renderTextField('.description-block', this.getAttribute('description'));
    this._renderTextField('.lister-name', this.getAttribute('lister-name') || 'Unknown');
  }

  /**
   * Updates a specific text field with new content
   */
  _renderTextField(selector, text) {
    const el = this.shadowRoot.querySelector(selector);
    if (el) {
      el.textContent = text || '';
    }
  }

  /**
   * Hides the overlay and initializes visibility state
   */
  _renderOverlayHidden() {
    if (this.overlay) {
      this.overlay.style.display = 'none';
      this._isVisible = false;
    }
  }

  /**
   * Shows the overlay and locks body scroll
   */
  _renderOverlayVisible() {
    if (this.overlay) {
      this.overlay.style.display = 'block';
      this._isVisible = true;
      this._renderBodyScrollLocked();
      
      if (this.contactMsg) {
        this.contactMsg.placeholder = this.MSG_PLACEHOLDER;
      }
    }
  }

  /**
   * Locks body scroll and adds padding to prevent layout shift
   */
  _renderBodyScrollLocked() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = this._getScrollbarWidth() + 'px';
  }

  /**
   * Unlocks body scroll and removes padding
   */
  _renderBodyScrollUnlocked() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  /**
   * Adds disclaimer text after contact button is clicked
   */
  _renderContactDisclaimer() {
    if (this.contactMsg && !this.shadowRoot.querySelector('.disclaimer-text')) {
      const disclaimer = document.createElement('div');
      disclaimer.className = 'disclaimer-text';
      disclaimer.textContent = '* Chat feature is for demonstration purposes only';
      this.contactMsg.insertAdjacentElement('afterend', disclaimer);
    }
  }

  _handleKeyDown(e) {
    if (e.key === 'ArrowLeft') {
      this._navigateImage(-1);
    }
    if (e.key === 'ArrowRight') {
      this._navigateImage(1);
    }
  }

  _handleContactClick() {
    this.dispatchEvent(new CustomEvent('contact-seller', { 
      bubbles: true, 
      composed: true, 
    }));

    this._renderContactDisclaimer();

    if (typeof window.notify === 'function') {
      window.notify('Message sent to seller!', 'success');
    }
  }

  _handleCloseClick() {
    this.hide();
  }

  _handleOverlayClick(e) {
    if (e.target === this.overlay) {
      this.hide();
    }
  }

  _stopPropagation(e) {
    e.stopPropagation();
  }

  _handleEscKey(e) {
    if (e.key === 'Escape' && this._isVisible) {
      this.hide();
    }
  }

  _handleThumbnailClick(index) {
    this._currentIndex = index;
    this._renderContent();
  }

  show() {
    this._renderOverlayVisible();
  }

  hide() {
    this._renderOverlayHidden();
    this._renderBodyScrollUnlocked();
  }

  get images() {
    const imagesAttr = this.getAttribute('images') || '';
    
    // Handle both array format (from database) and comma-separated format
    if (imagesAttr.startsWith('[') && imagesAttr.endsWith(']')) {
      try {
        return JSON.parse(imagesAttr).filter(Boolean);
      } catch (e) {
        console.warn('Failed to parse images JSON:', e);
        return [];
      }
    } else {
      return imagesAttr
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  _navigateImage(direction) {
    const images = this.images;
    if (images.length === 0) {return;}
    
    this._currentIndex = (this._currentIndex + direction + images.length) % images.length;
    this._renderContent();
  }

  _getScrollbarWidth() {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = 'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;';
    document.body.appendChild(scrollDiv);
    
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    
    return scrollbarWidth;
  }
}

customElements.define('product-detail', ProductViewer);