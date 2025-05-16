import html from './chat-widget.html?raw';
import css from './chat-widget.css?raw';

class ChatWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._conversations = [
      { id: 1, name: 'Alice', preview: 'Hey!', timestamp: '10:32 AM', unread: true },
      { id: 2, name: 'Bob', preview: 'See you soon.', timestamp: '9:14 AM', unread: false },
      { id: 3, name: 'Carol', preview: 'Got it.', timestamp: 'Yesterday', unread: true },
    ];
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Close on "X" icon
    this.shadowRoot.querySelector('.close-icon').addEventListener('click', () => this.remove());

    // Global Escape key handler
    this._handleEsc = (e) => {
      if (e.key === 'Escape' && this.isConnected && this.parentElement) {
        this.remove();
      }
    };
    document.addEventListener('keydown', this._handleEsc);

    // Filter conversations
    this.shadowRoot.querySelector('input').addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      this._renderConversations(term);
    });

    this._renderConversations();
  }

  _renderConversations(filter = '') {
    const list = this.shadowRoot.querySelector('.convo-list');
    list.innerHTML = '';
    this._conversations
      .filter((c) => c.name.toLowerCase().includes(filter))
      .forEach((convo) => {
        const item = document.createElement('div');
        item.classList.add('convo');
        item.innerHTML = `
            <div class="avatar"></div>
            <div class="details">
            <div><strong>${convo.name}</strong> <small>${convo.timestamp}</small></div>
            <div>${convo.preview}</div>
            </div>
            ${convo.unread ? '<div class="unread-badge"></div>' : ''}
            `;
        item.addEventListener('click', () => {
          this.dispatchEvent(new CustomEvent('chat-open', {
            detail: { id: convo.id },
            bubbles: true,
            composed: true,
          }));
        });
        list.appendChild(item);
      });
  }
}

customElements.define('chat-widget', ChatWidget);
export default ChatWidget;