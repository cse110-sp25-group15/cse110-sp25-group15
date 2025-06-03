import templateHTML from './product-detail.html?raw';
import templateCSS from './product-detail.css?raw';

/**
 * A custom element that displays detailed product information including:
 * - image gallery with arrows and thumbnails
 * - product metadata (name, price, condition, date, description, images)
 * - a contact button that emits a `contact-seller` event
 * 
 * @element product-detail
 */
class ProductViewer extends HTMLElement {

  MSG_PLACEHOLDER = 'Hi, is this still available?';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._currentIndex = 0;
    this._isVisible = false; // Local visibility state
    
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${templateCSS}</style>
      ${templateHTML}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['name', 'price', 'condition', 'date', 'description', 'images'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this._updateContent();
    }
  }

  connectedCallback() {
    this.gallery = this.shadowRoot.querySelector('.gallery');
    this.sendButton = this.shadowRoot.querySelector('.send-btn');
    this.closeButton = this.shadowRoot.querySelector('.close-btn');
    this.overlay = this.shadowRoot.querySelector('.overlay');
    this.productDetail = this.shadowRoot.querySelector('.product-detail');

    this._initializeOverlay();
    this._updateContent();

    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleContactClick = this._handleContactClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleOverlayClick = this._handleOverlayClick.bind(this);
    this._stopPropagation = this._stopPropagation.bind(this);
    this._handleEscKey = this._handleEscKey.bind(this);

    this.gallery?.addEventListener('keydown', this._handleKeyDown);
    this.sendButton?.addEventListener('click', this._handleContactClick);
    this.closeButton?.addEventListener('click', this._handleCloseClick);
    this.overlay?.addEventListener('click', this._handleOverlayClick);
    this.productDetail?.addEventListener('click', this._stopPropagation);
    document.addEventListener('keydown', this._handleEscKey);

  }

  /**
   * Clean up when component is removed
   */
  disconnectedCallback() {
    // Ensure body scroll is unlocked if component is removed while overlay is open
    if (this._isVisible) {
      this._unlockBodyScroll();
    }
    this.gallery?.removeEventListener('keydown', this._handleKeyDown);
    this.sendButton?.removeEventListener('click', this._handleContactClick);
    this.closeButton?.removeEventListener('click', this._handleCloseClick);
    this.overlay?.removeEventListener('click', this._handleOverlayClick);
    this.productDetail?.removeEventListener('click', this._stopPropagation);
    document.removeEventListener('keydown', this._handleEscKey);
  }

  /**
   * Updates the component content based on current data and image index.
   * Updates image, thumbnails, and product meta fields.
   * @private
   */
  _updateContent() {
    const images = this.images;
    const mainImg = this.shadowRoot.querySelector('.main-image');
    if (mainImg) {
      mainImg.src = images[this._currentIndex] || '';
      mainImg.alt = this.getAttribute('name') || 'Product image';
    }

    // Update thumbnails
    const thumbStrip = this.shadowRoot.querySelector('.thumb-strip');
    if (thumbStrip) {
      thumbStrip.innerHTML = '';
      
      // Only show thumbnails if there are multiple images
      if (images.length > 1) {
        images.forEach((src, idx) => {
          const thumb = document.createElement('img');
          thumb.src = src;
          thumb.alt = `Thumbnail ${idx + 1}`;
          thumb.className = idx === this._currentIndex ? 'active' : '';
          thumb.tabIndex = 0;
          thumb.addEventListener('click', () => {
            this._currentIndex = idx;
            this._updateContent();
          });
          thumbStrip.appendChild(thumb);
        });
      }
    }

    // Update text fields
    this._setText('.product-name', this.getAttribute('name'));
    this._setText('.price', this.getAttribute('price') ? `$${this.getAttribute('price')}` : '');
    this._setText('.condition', this.getAttribute('condition'));
    this._setText('.date', this.getAttribute('date'));
    this._setText('.description-block', this.getAttribute('description'));
  }

  _setText(selector, text) {
    const el = this.shadowRoot.querySelector(selector);
    if (el) {el.textContent = text || '';}
  }

  _handleKeyDown(e) {
    if (e.key === 'ArrowLeft') {this._cycleImage(-1);}
    if (e.key === 'ArrowRight') {this._cycleImage(1);}
  }

  _handleContactClick() {
    this.dispatchEvent(new CustomEvent('contact-seller', { bubbles: true, composed: true }));

    const contactMsg = this.shadowRoot.querySelector('.contact-message');
    const sentPopup = this.shadowRoot.querySelector('.sent-popup');
    const popupTimer = 1000;

    if (contactMsg) {
      contactMsg.value = '';
      contactMsg.placeholder = 'Sent!';
    }

    if (sentPopup) {
      sentPopup.hidden = false;
      sentPopup.classList.add('show');

      // Quick 1s timer
      setTimeout(function() {
        sentPopup.classList.remove('show'); 
        sentPopup.hidden = true;
      }, popupTimer);
    }
  }

  _handleCloseClick() {
    this.hide();
  }

  _handleOverlayClick(e) {
    if (e.target === this.overlay) {this.hide();}
  }

  _stopPropagation(e) {
    e.stopPropagation();
  }

  _handleEscKey(e) {
    if (e.key === 'Escape' && this._isVisible) {
      this.hide();
    }
  }

  get images() {
    const imagesAttr = this.getAttribute('images') || '';
    
    // Handle both array format (from database) and comma-separated format
    if (imagesAttr.startsWith('[') && imagesAttr.endsWith(']')) {
      try {
        // Parse JSON array format
        return JSON.parse(imagesAttr).filter(Boolean);
      } catch (e) {
        console.warn('Failed to parse images JSON:', e);
        return [];
      }
    } else {
      // Handle comma-separated format or single image
      return imagesAttr
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  /**
   * Initialize overlay as hidden
   * @private
   */
  _initializeOverlay() {
    if (this.overlay) {
      this.overlay.style.display = 'none';
      this._isVisible = false;
    }
  }

  /**
   * Lock body scroll by adding overflow hidden
   * @private
   */
  _lockBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = this._getScrollbarWidth() + 'px';
  }

  /**
   * Unlock body scroll by removing overflow hidden
   * @private
   */
  _unlockBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  /**
   * Get scrollbar width to prevent layout shift
   * @private
   */
  _getScrollbarWidth() {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = 'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;';
    document.body.appendChild(scrollDiv);
    
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    
    return scrollbarWidth;
  }

  /**
   * Show the overlay
   */
  show() {
    if (this.overlay) {
      this.overlay.style.display = 'block';
      this._isVisible = true;
      this._lockBodyScroll();

      const contactMsg = this.shadowRoot.querySelector('.contact-message');
      contactMsg.placeholder = this.MSG_PLACEHOLDER;
    }
  }

  /**
   * Hide the overlay
   */
  hide() {
    if (this.overlay) {
      this.overlay.style.display = 'none';
      this._isVisible = false;
      this._unlockBodyScroll();
    }
  }

  /**
   * Cycles the main image index forward or backward.
   * Wraps around when reaching the beginning or end.
   *
   * @param {number} dir - Direction to move: -1 for previous, 1 for next.
   * @private
   */
  _cycleImage(dir) {
    const images = this.images;
    if(images.length === 0) {return;}
    this._currentIndex = (this._currentIndex + dir + images.length) % images.length;
    this._updateContent();
  }
}

customElements.define('product-detail', ProductViewer);