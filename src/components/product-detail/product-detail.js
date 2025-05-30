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
    console.log(`Attribute changed: ${name}, Old Value: ${oldVal}, New Value: ${newVal}`);
    if (oldVal !== newVal) {
      console.log('Updating content due to attribute change');
      this._updateContent();
    }
  }

  connectedCallback() {
    this._updateContent();
    this._addEventListeners();
    this._initializeOverlay();
  }

  get images() {
    // Split on commas and/or line breaks, trim, and filter out empty strings
    return (this.getAttribute('images') || '')
      .split(/[\s,]+/) // split on comma, space, or line break
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /**
   * Initialize overlay as hidden
   * @private
   */
  _initializeOverlay() {
    const overlay = this.shadowRoot.querySelector('.overlay');
    if (overlay) {
      overlay.style.display = 'none';
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
    const overlay = this.shadowRoot.querySelector('.overlay');
    if (overlay) {
      overlay.style.display = 'block';
      this._isVisible = true;
      this._lockBodyScroll();
      console.log('Overlay shown');
    }
  }

  /**
   * Hide the overlay
   */
  hide() {
    const overlay = this.shadowRoot.querySelector('.overlay');
    if (overlay) {
      overlay.style.display = 'none';
      this._isVisible = false;
      this._unlockBodyScroll();
      console.log('Overlay hidden');
    }
  }

  /**
   * Updates the component content based on current data and image index.
   * Updates image, thumbnails, and product meta fields.
   * @private
   */
  _updateContent() {
    console.log('Updating content with images:', this.images);
    // Example: update main image
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

    // Update text fields
    const nameEl = this.shadowRoot.querySelector('.product-name');
    if (nameEl) {nameEl.textContent = this.getAttribute('name') || '';}
    const priceEl = this.shadowRoot.querySelector('.price');
    if (priceEl) {priceEl.textContent = this.getAttribute('price') ? `$${this.getAttribute('price')}` : '';}
    const condEl = this.shadowRoot.querySelector('.condition');
    if (condEl) {condEl.textContent = this.getAttribute('condition') || '';}
    const dateEl = this.shadowRoot.querySelector('.date');
    if (dateEl) {dateEl.textContent = this.getAttribute('date') || '';}
    const descEl = this.shadowRoot.querySelector('.description-block');
    if (descEl) {descEl.textContent = this.getAttribute('description') || '';}
  }

  /**
   * Adds event listeners to gallery arrows, keyboard events, and contact button.
   * Emits `contact-seller` when the contact button is clicked.
   * @private
   * @fires contact-seller
   */
  _addEventListeners() {
    // Keyboard navigation
    this.shadowRoot.querySelector('.gallery')?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {this._cycleImage(-1);};
      if (e.key === 'ArrowRight') {this._cycleImage(1);};
    });

    this.shadowRoot.querySelector('.send-btn')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('contact-seller', { bubbles: true, composed: true }));
    });

    // Close button click
    this.shadowRoot.querySelector('.close-btn')?.addEventListener('click', () => {
      this.hide();
    });

    // Background click to close overlay
    const overlay = this.shadowRoot.querySelector('.overlay');
    overlay?.addEventListener('click', (e) => {
      // Only close if clicking the overlay background (not the content)
      if (e.target === overlay) {
        this.hide();
      }
    });

    // Prevent clicks on overlay content from bubbling to overlay
    const productDetail = this.shadowRoot.querySelector('.product-detail');
    productDetail?.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._isVisible) {
        this.hide();
      }
    });
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

  /**
   * Clean up when component is removed
   */
  disconnectedCallback() {
    // Ensure body scroll is unlocked if component is removed while overlay is open
    if (this._isVisible) {
      this._unlockBodyScroll();
    }
  }
}

customElements.define('product-detail', ProductViewer);