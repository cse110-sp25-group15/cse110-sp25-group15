import html from './empty-state.html?raw';
import css from './empty-state.css?raw';

/**
 * A component that displays an empty state placeholder when no product cards are available.
 * 
 * States:
 * - Default: Shows empty state message with icon and text
 * 
 * Purpose:
 * - Displays placeholder content when product list is empty
 * - Provides visual feedback for empty search results or categories
 * - Uses slot content for customizable empty state messages and icons
 * - Improves user experience by explaining why no content is shown
 */
class EmptyState extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('empty-state', EmptyState);