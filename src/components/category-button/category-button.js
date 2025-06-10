import html from './category-button.html?raw';
import css from './category-button.css?raw';

/**
 * A custom web component that renders a clickable category filter button.
 * 
 * States:
 * - Default: Button appears unselected with default styling
 * - Selected: Button appears highlighted when the 'selected' attribute is present
 * 
 * Purpose:
 * - Displays category text content via slot
 * - Emits 'filter-changed' custom events when clicked
 * - Provides visual feedback for selection state
 * - Used for category filtering interfaces
 */
class CategoryButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['selected'];
  }

  connectedCallback() {
    this.button = this.shadowRoot.querySelector('.label');
    this.slot = this.shadowRoot.querySelector('slot');

    this._handleClick = this._handleClick.bind(this);
    
    this.button.addEventListener('click', this._handleClick);
  }

  disconnectedCallback() {
    this.button.removeEventListener('click', this._handleClick);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {return;}
    if (name === 'selected') {this._renderSelected();}
  }

  /**
   * Updates the visual selection state of the button by toggling the 'selected' CSS class
   */
  _renderSelected() {
    const isSelected = this.hasAttribute('selected');
    this.button.classList.toggle('selected', isSelected);
  }

  _handleClick() {
    const category = this._getCategoryText();
    
    const selectedEvent = new CustomEvent('filter-changed', {
      bubbles: true,
      composed: true,
      detail: {
        category: category,
      },
    });
    this.dispatchEvent(selectedEvent);
  }

  _getCategoryText() {
    return this.slot.assignedNodes()
      .map((node) => node.textContent)
      .join('')
      .trim();
  }
}

customElements.define('category-button', CategoryButton);