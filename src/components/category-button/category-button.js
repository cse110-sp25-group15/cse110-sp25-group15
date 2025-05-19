import html from './category-button.html?raw';
import css from './category-button.css?raw';

class CategoryButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['selected'];
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `
            <style>${css}</style>
            ${html}
        `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // event listener for onclick
    const button = this.shadowRoot.querySelector('.label');
    button.addEventListener('click', () => {
            
      this.toggleAttribute('selected');

    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'selected'){
      const isSelected = this.hasAttribute('selected');
      this.updateSelected(isSelected);
    }
  }

  updateSelected(isSelected) {
    this.shadowRoot.querySelector('.label')
      .classList.toggle('selected', isSelected);

    const selectedEvent = new CustomEvent('selected', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(selectedEvent);
  }
    
}

customElements.define('category-button', CategoryButton);