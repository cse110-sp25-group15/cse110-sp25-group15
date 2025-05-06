class CheckItem extends HTMLElement {
  static get observedAttributes() {
    return ['checked'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const [html, css] = await Promise.all([
      fetch('./components/checkbox-item/checkbox-item.html').then(r => r.text()),
      fetch('./components/checkbox-item/checkbox-item.css').then(r => r.text()),
    ]);

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Store reference to checkbox for later toggling
    this.checkbox = this.shadowRoot.querySelector('.checkbox');

    // Click toggles checked state
    this.checkbox.addEventListener('click', () => {
      this.toggleAttribute('checked');
    });

    this.updateCheckedStyle();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'checked') {
      this.updateCheckedStyle();
    }
  }

  updateCheckedStyle() {
    if (!this.checkbox) return;
    this.checkbox.classList.toggle('checked', this.hasAttribute('checked'));
  }
}

customElements.define('check-item', CheckItem);
