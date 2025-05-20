import css from './product-overlay.css?raw';
import html from './product-overlay.html?raw';

/**
 * A custom overlay component that creates a modal window for displaying content.
 * Features:
 * - Fixed position overlay that covers the entire screen
 * - Semi-transparent background
 * - Centers its content
 * - Closes when clicking on the background or pressing ESC
 * - Prevents body scrolling when open
 * 
 * @element product-overlay
 * @fires close-overlay - When the overlay is closed
 */
class ProductOverlay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    // Bind methods to this instance
    this._onBackgroundClick = this._onBackgroundClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  static get observedAttributes() {
    return ['visible'];
  }

  connectedCallback() {
    // Add event listeners when the element is connected to the DOM
    this._addEventListeners();
    
    // Initialize visibility state
    this._updateVisibility();
  }

  disconnectedCallback() {
    // Clean up event listeners when the element is removed
    this._removeEventListeners();
    
    // Ensure body scrolling is restored if component is removed while open
    document.body.style.overflow = 'auto';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'visible' && oldValue !== newValue) {
      this._updateVisibility();
    }
  }

  /**
   * Show the overlay
   */
  show() {
    this.setAttribute('visible', '');
  }

  /**
   * Hide the overlay
   */
  hide() {
    this.removeAttribute('visible');
  }

  /**
   * Update the visibility of the overlay based on the 'visible' attribute
   * @private
   */
  _updateVisibility() {
    const isVisible = this.hasAttribute('visible');
    const overlay = this.shadowRoot.querySelector('.overlay');
    
    if (overlay) {
      overlay.style.display = isVisible ? 'flex' : 'none';
    }
    
    // Prevent/restore body scrolling
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
  }

  /**
   * Add event listeners for closing the overlay
   * @private
   */
  _addEventListeners() {
    const overlay = this.shadowRoot.querySelector('.overlay');
    if (overlay) {
      overlay.addEventListener('click', this._onBackgroundClick);
    }
    
    document.addEventListener('keydown', this._onKeyDown);
  }

  /**
   * Remove event listeners
   * @private
   */
  _removeEventListeners() {
    const overlay = this.shadowRoot.querySelector('.overlay');
    if (overlay) {
      overlay.removeEventListener('click', this._onBackgroundClick);
    }
    
    document.removeEventListener('keydown', this._onKeyDown);
  }

  /**
   * Handle clicks on the overlay background
   * @param {Event} event - The click event
   * @private
   */
  _onBackgroundClick(event) {
    const overlay = this.shadowRoot.querySelector('.overlay');
    if (event.target === overlay) {
      this.hide();
      this._dispatchCloseEvent();
    }
  }

  /**
   * Handle keydown events to close on ESC key
   * @param {KeyboardEvent} event - The keydown event
   * @private
   */
  _onKeyDown(event) {
    if (event.key === 'Escape' && this.hasAttribute('visible')) {
      this.hide();
      this._dispatchCloseEvent();
    }
  }

  /**
   * Dispatch a custom event when the overlay is closed
   * @private
   * @fires close-overlay
   */
  _dispatchCloseEvent() {
    this.dispatchEvent(new CustomEvent('close-overlay', {
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('product-overlay', ProductOverlay);