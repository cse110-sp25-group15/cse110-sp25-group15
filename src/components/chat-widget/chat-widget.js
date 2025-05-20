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
    this._isVisible = false;
  }

  connectedCallback() {
    console.log('ChatWidget connected');
  }

  toggleWidget() {
    if (this._isVisible) {
      this.hideWidget();
    } else {
      this.showWidget();
    }
  }

  showWidget() {
    this.shadowRoot.querySelector('.widget-container').style.display = 'block';
    this.shadowRoot.querySelector('.chat-bubble').style.display = 'none';
    this._isVisible = true;
  }

  hideWidget() {
    this.shadowRoot.querySelector('.widget-container').style.display = 'none';
    this.shadowRoot.querySelector('.chat-bubble').style.display = 'flex';
    this._isVisible = false;
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

  disconnectedCallback() {
    document.removeEventListener('keydown', this._handleEsc);
  }
}

customElements.define('chat-widget', ChatWidget);
export default ChatWidget;