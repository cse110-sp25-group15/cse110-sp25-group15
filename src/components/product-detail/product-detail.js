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
  }

  static get observedAttributes() {
    return ['name', 'price', 'condition', 'date', 'description', 'images'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal && this.shadowRoot) {
      this._updateContent();
    }
  }

  connectedCallback() {
    if (!this.shadowRoot.hasChildNodes()) {
      const template = document.createElement('template');
      template.innerHTML = `
      <style>${templateCSS}</style>
      ${templateHTML}
    `;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this._updateContent();
    this._addEventListeners();

  }

  get images() {
  // Split on commas and/or line breaks, trim, and filter out empty strings
    return (this.getAttribute('images') || '')
      .split(/[\s,]+/) // split on comma, space, or line break
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /**
   * Updates the component content based on current data and image index.
   * Updates image, thumbnails, and product meta fields.
   * @private
   */
  _updateContent() {
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
    const left = this.shadowRoot.querySelector('.arrow.left');
    const right = this.shadowRoot.querySelector('.arrow.right');
    left?.addEventListener('click', () => this._cycleImage(-1));
    right?.addEventListener('click', () => this._cycleImage(1));
    // Keyboard navigation
    this.shadowRoot.querySelector('.gallery')?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {this._cycleImage(-1);};
      if (e.key === 'ArrowRight') {this._cycleImage(1);};
    });

    this.shadowRoot.querySelector('.contact-btn')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('contact-seller', { bubbles: true, composed: true }));
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
}

customElements.define('product-detail', ProductViewer);

