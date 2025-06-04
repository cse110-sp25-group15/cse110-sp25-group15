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
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    
    notification.innerHTML = `
      <div class="notification-icon">${icons[type]}</div>
      <div class="notification-content">
        <p class="notification-message">${message}</p>
      </div>
    `;
    
    this.container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove
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