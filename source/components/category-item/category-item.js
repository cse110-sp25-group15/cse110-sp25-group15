class CategoryItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); 
  }
  async connectedCallback() {
    // loading HTML and CSS
    const [html, css] = await Promise.all([
      fetch('components/category-item/category-item.html').then((res) => res.text()),
      fetch('components/category-item/category-item.css').then((res) => res.text()),
    ]);

    const template = document.createElement('template');
    template.innerHTML = `
        <style>${css}</style>
        ${html}
        `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('category-item', CategoryItem);