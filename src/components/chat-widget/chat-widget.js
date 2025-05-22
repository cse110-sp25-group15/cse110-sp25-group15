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
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Prevents body scroll when chat is open
    document.body.style.overflow = 'hidden';

    // Close on "X" icon
    this.shadowRoot.querySelector('.close-icon').addEventListener('click', () => this.hideWidget());

    // Global Escape key handler
    this._handleEsc = (e) => {
      if (e.key === 'Escape' && this.isConnected && this._isVisible) {
        this.hideWidget();
      }
    };
    document.addEventListener('keydown', this._handleEsc);

    // Filter conversations
    this.shadowRoot.querySelector('input').addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      this._renderConversations(term);
    });

    // Add event listener to chat bubble
    this.shadowRoot.querySelector('.chat-bubble').addEventListener('click', () => {
      this.toggleWidget();
    });

    // Initially hide the widget container, show only the bubble
    this.shadowRoot.querySelector('.widget-container').style.display = 'none';
    this._renderConversations();

    // Back button
    const backButton = this.shadowRoot.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.shadowRoot.querySelector('.chat-screen').classList.add('hidden');
        this.shadowRoot.querySelector('.convo-list').style.display = 'block';
      });
    }
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._handleEsc);
    document.body.style.overflow = '';
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
            <div>
              <span class="name">${convo.name}</span>
              <span class="timestamp">${convo.timestamp}</span>
            </div>
            <div>${convo.preview}</div>
            </div>
            ${convo.unread ? '<div class="unread-badge"></div>' : ''}
            `;
        item.addEventListener('click', () => {
          this.shadowRoot.querySelector('.convo-list').style.display = 'none';
          const screen = this.shadowRoot.querySelector('.chat-screen');
          screen.classList.remove('hidden');
          screen.querySelector('.chat-title').textContent = convo.name;

          const messagesContainer = screen.querySelector('.messages');
          messagesContainer.innerHTML = `<div class="message">${convo.preview}</div>`;

          this.dispatchEvent(new CustomEvent('chat-open', {
            detail: { id: convo.id },
            bubbles: true,
            composed: true,
          }));
        });
        list.appendChild(item);
      });
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._handleEsc);
  }
}

customElements.define('chat-widget', ChatWidget);
export default ChatWidget;