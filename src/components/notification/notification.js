import html from './notification.html?raw';
import css from './notification.css?raw';

class Notification extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.icons = {
      success: '✓',
      error: '✕', 
      warning: '⚠',
      info: 'ℹ',
    };
  }

  static get observedAttributes() {
    return ['type', 'message', 'duration'];
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.notificationEl = this.shadowRoot.querySelector('.notification');
    this.iconEl = this.shadowRoot.querySelector('.notification-icon');
    this.messageEl = this.shadowRoot.querySelector('.notification-message');

    this._render();
    this._show();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {return;}
    if (this.notificationEl) {
      this._render();
    }
  }

  show(message, type = 'info', duration = 3000) {
    this.setAttribute('message', message);
    this.setAttribute('type', type);
    this.setAttribute('duration', duration);
  }

  _render() {
    const type = this.getAttribute('type') || 'info';
    const message = this.getAttribute('message') || '';

    this.notificationEl.className = `notification ${type}`;
    this.iconEl.textContent = this.icons[type] || this.icons.info;
    this.messageEl.textContent = message;
  }

  _show() {
    const duration = parseInt(this.getAttribute('duration')) || 3000;
    
    setTimeout(() => {
      this.notificationEl.classList.add('show');
    }, 10);

    setTimeout(() => {
      this._hide();
    }, duration);
  }

  _hide() {
    this.notificationEl.classList.remove('show');
    setTimeout(() => {
      this.remove();
    }, 300);
  }
}

customElements.define('app-notification', Notification);

// Global helper function to add notifications to existing container
window.notify = (message, type = 'info', duration = 3000) => {
  // Find the notification container in the main document
  const container = document.querySelector('.notification-container') || 
                   document.querySelector('#notification-container') ||
                   document.body;
  
  const notification = document.createElement('app-notification');
  container.appendChild(notification);
  notification.show(message, type, duration);
};

export default Notification;