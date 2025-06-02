import html from './empty-state.html?raw';
import css from './empty-state.css?raw';

class EmptyState extends HTMLElement {
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
    return ['active'];
  }

}

customElements.define('empty-state', EmptyState);