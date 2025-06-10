import html from './notification.html?raw';
import css from './notification.css?raw';

/**
 * A notification component that displays temporary messages with different types and icons.
 * 
 * States:
 * - Hidden: Initial state before showing animation
 * - Showing: Visible with slide-in animation
 * - Hiding: Slide-out animation before removal
 * 
 * Purpose:
 * - Displays temporary notification messages to users
 * - Supports different notification types (success, error, warning, info)
 * - Auto-dismisses after specified duration
 * - Provides visual feedback with type-specific icons and styling
 * - Can be programmatically shown via attributes or show() method
 */
class Notification extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'message', 'duration'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
  }

  connectedCallback() {
    this.notificationEl = this.shadowRoot.querySelector('.notification');
    this.iconEl = this.shadowRoot.querySelector('.notification-icon');
    this.messageEl = this.shadowRoot.querySelector('.notification-message');
    
    this._renderNotification();
    this._renderVisible();
  }

  disconnectedCallback() {
    // Clear any pending timeouts to prevent memory leaks
    if (this._showTimeout) {
      clearTimeout(this._showTimeout);
    }
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {return;}
    if (this.notificationEl) {
      this._renderNotification();
    }
  }

  /**
   * Updates the notification display with current type, message, and icon
   */
  _renderNotification() {
    const type = this.getAttribute('type') || 'info';
    const message = this.getAttribute('message') || '';
    
    this.notificationEl.className = `notification ${type}`;
    this.iconEl.textContent = this.icons[type] || this.icons.info;
    this.messageEl.textContent = message;
  }

  /**
   * Shows the notification with animation and schedules auto-hide
   */
  _renderVisible() {
    const duration = parseInt(this.getAttribute('duration'), 10) || 3000;
    
    // Show with slight delay for animation
    this._showTimeout = setTimeout(() => {
      this.notificationEl.classList.add('show');
    }, 10);
    
    // Auto-hide after duration
    this._hideTimeout = setTimeout(() => {
      this._renderHidden();
    }, duration);
  }

  /**
   * Hides the notification with animation and removes from DOM
   */
  _renderHidden() {
    this.notificationEl.classList.remove('show');
    
    // Remove from DOM after animation completes
    this._removeTimeout = setTimeout(() => {
      this.remove();
    }, 300);
  }

  show(message, type = 'info', duration = 3000) {
    this.setAttribute('message', message);
    this.setAttribute('type', type);
    this.setAttribute('duration', duration);
  }
}

customElements.define('app-notification', Notification);

window.notify = (message, type = 'info', duration = 3000) => {
  const container =
    document.querySelector('.notification-container') ||
    document.querySelector('#notification-container') ||
    document.body;
  const notification = document.createElement('app-notification');
  container.appendChild(notification);
  notification.show(message, type, duration);
};

export default Notification;