import html from './notification.html?raw';
import css from './notification.css?raw';

class NotificationSystem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>${css}</style>${html}`;
    this.container = this.shadowRoot.querySelector('.notification-container');
  }

  show(message, type = 'info', duration = 3000) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
  
    const template = this.shadowRoot.querySelector('#notification-template');
    const notification = template.content.cloneNode(true).querySelector('.notification');
    notification.classList.add(type);
  
    notification.querySelector('.notification-icon').textContent = icons[type];
    notification.querySelector('.notification-message').textContent = message;
  
    this.container.appendChild(notification);
  
    setTimeout(() => notification.classList.add('show'), 10);
  
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

customElements.define('notification-system', NotificationSystem);

// Global helper function
window.notify = (message, type = 'info', duration = 3000) => {
  let notificationSystem = document.querySelector('notification-system');
  if (!notificationSystem) {
    notificationSystem = document.createElement('notification-system');
    document.body.appendChild(notificationSystem);
  }
  notificationSystem.show(message, type, duration);
};

export default NotificationSystem;