import templateHTML from './checkbox-item.html?raw';
import templateCSS from './checkbox-item.css?raw';

class CheckItem extends HTMLElement {
  static get observedAttributes() {
    return ['checked'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${templateCSS}</style>
      ${templateHTML}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.checkbox = this.shadowRoot.querySelector('.checkbox');

    if (this.checkbox) {
      this.checkbox.addEventListener('click', () => {
        this.toggleAttribute('checked');
      });
    }

    this.updateCheckedStyle();
  }

  attributeChangedCallback(name) {
    if (name === 'checked') {
      this.updateCheckedStyle();
    }
  }

  updateCheckedStyle() {
    if (!this.checkbox) { return; }
    this.checkbox.classList.toggle('checked', this.hasAttribute('checked'));
  }
}

customElements.define('checkbox-item', CheckItem);
