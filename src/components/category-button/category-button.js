import html from './category-button.html?raw';
import css from './category-button.css?raw';

class CategoryButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
            <style>${css}</style>
            ${html}
        `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['selected'];
  }

  connectedCallback() {
    // event listener for onclick
    const button = this.shadowRoot.querySelector('.label');
    button.addEventListener('click', () => {
      // Get the text content from the slot
      const slotElement = this.shadowRoot.querySelector('slot');
      const category = slotElement.assignedNodes().map((node) => node.textContent).join('').trim();
      
      const selectedEvent = new CustomEvent('filter-changed', {
        bubbles: true,
        composed: true,
        detail: {
          category: category,
        },
      });
      this.dispatchEvent(selectedEvent);
    });
  }

  attributeChangedCallback(name, _oldValue, _newValue) {
    if (name === 'selected'){
      const isSelected = this.hasAttribute('selected');
      this.updateSelected(isSelected);
    }
  }

  updateSelected(isSelected) {
    this.shadowRoot.querySelector('.label')
      .classList.toggle('selected', isSelected);
    
  }
    
}

customElements.define('category-button', CategoryButton);