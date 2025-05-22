import html from './hero-banner.html?raw';
import css from './hero-banner.css?raw';

/**
 * Hero Banner Component
 * Displays the main landing section with navigation, headline, and CTA
 */
class HeroBanner extends HTMLElement {
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

  /**
   * Lifecycle callback when component is connected to the DOM
   */
  connectedCallback() {
  }
}

customElements.define('hero-banner', HeroBanner);
export default HeroBanner;