import html from './delete-confirmation.html?raw';
import css from './delete-confirmation.css?raw';

class DeleteConfirmation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._handleCancel = this._handleCancel.bind(this);
    this._handleConfirm = this._handleConfirm.bind(this);
    this._handleOverlayClick = this._handleOverlayClick.bind(this);
  }

  connectedCallback() {
    this.overlay = this.shadowRoot.querySelector('.delete-confirmation-overlay');
    this.cancelBtn = this.shadowRoot.querySelector('.btn-cancel');
    this.confirmBtn = this.shadowRoot.querySelector('.btn-confirm-delete');

    this.cancelBtn.addEventListener('click', this._handleCancel);
    this.confirmBtn.addEventListener('click', this._handleConfirm);
    this.overlay.addEventListener('click', this._handleOverlayClick);
  }

  disconnectedCallback() {
    this.cancelBtn.removeEventListener('click', this._handleCancel);
    this.confirmBtn.removeEventListener('click', this._handleConfirm);
    this.overlay.removeEventListener('click', this._handleOverlayClick);
  }

  show() {
    this.style.display = 'block';
  }

  hide() {
    this.style.display = 'none';
  }

  _handleCancel() {
    this._dispatchResult(false);
  }

  _handleConfirm() {
    this._dispatchResult(true);
  }

  _handleOverlayClick(e) {
    if (e.target === this.overlay) {
      this._dispatchResult(false);
    }
  }

  _dispatchResult(confirmed) {
    this.dispatchEvent(
      new CustomEvent('delete-result', {
        bubbles: true,
        composed: true,
        detail: { confirmed },
      }),
    );
    this.hide();
  }
}

customElements.define('delete-confirmation', DeleteConfirmation);
export default DeleteConfirmation;
