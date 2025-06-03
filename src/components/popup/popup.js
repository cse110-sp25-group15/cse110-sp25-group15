import html from './popup.html?raw';
import css from './popup.css?raw';

class Popup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.popup = this.shadowRoot.querySelector('.popup');
    this.popupText = this.shadowRoot.querySelector('.text');
  }

  /**
   * Show the popup with custom message and duration
   * @param {string} message - The message to show
   * @param {number} duration - How long to show (in ms)
   */
  showMessage(message = 'Message Sent!', duration = 1000) {
    if (!this.popup || !this.popupText) {
      console.warn('Popup element or .text not found');
      return;
    }

    this.popupText.textContent = message;
    this.popup.hidden = false;
    this.popup.classList.add('show');

    setTimeout(() => {
      this.popup.classList.remove('show');
      this.popup.hidden = true;
    }, duration);
  }
}

customElements.define('popup-msg', Popup);
export default Popup;