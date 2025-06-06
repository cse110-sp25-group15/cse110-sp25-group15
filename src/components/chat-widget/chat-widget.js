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
    // Prevents body scroll when chat is open

    const disclaimer = document.createElement('div');
    disclaimer.textContent = 'Disclaimer: This chat is for demonstration purposes only.';
    disclaimer.className = 'chat-disclaimer';

    const widgetContainer = this.shadowRoot.querySelector('.widget-container');
    if (widgetContainer) {
      widgetContainer.insertBefore(disclaimer, widgetContainer.firstChild);
    }

    //document.body.style.overflow = 'hidden';
    // Close on "X" icon
    this.shadowRoot.querySelector('.close-icon').addEventListener('click', () =>         this.hideWidget()  );
    // Global Escape key handler
    this._handleEsc = (e) => {
      if (e.key === 'Escape' && this.isConnected && this.parentElement) {
        this.hideWidget();
      }
    };
    // listen to user-signed-out
    const chat_widget = document.querySelector('chat-widget');
    document.addEventListener('user-signed-out', () => { 
      chat_widget.style.display = 'none'; 
    });
    // listen to user-signed-in
    document.addEventListener('user-signed-in', ()=> { 
      chat_widget.style.display = 'block'; 
      console.log('receive event login');});
    // Add event listener to chat bubble
    this.shadowRoot.querySelector('.chat-bubble').addEventListener('click', () => {
      this.toggleWidget();
    });
    // Initially hide the widget container, show only the bubble
    this.shadowRoot.querySelector('.widget-container').style.display = 'none';
    this._renderConversations();
    this._isVisible = false;
    document.addEventListener('keydown', this._handleEsc);
    // Filter conversations
    this.shadowRoot.querySelector('input').addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      this._renderConversations(term);
    });
    this._renderConversations();
    // Back button
    const backButton = this.shadowRoot.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.shadowRoot.querySelector('.chat-screen').classList.add('hidden');
        this.shadowRoot.querySelector('.convo-list').style.display = 'block';
        this.shadowRoot.querySelector('header').style.display = 'flex';
        this.shadowRoot.querySelector('input').style.display = 'block';
      });
    }
    this._setupBottomNavDetection();
  }
  _setupBottomNavDetection() {
    if (this._isScrollListenerActive) {return;}
    
    this._handleScroll = () => {
      const bottomNav = document.querySelector('bottom-nav');
      if (!bottomNav) {return;}

      const bottomNavRect = bottomNav.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const isBottomNavVisible = bottomNavRect.top < viewportHeight && bottomNavRect.bottom > 0;
      
      if (isBottomNavVisible) {
        
        const visibleHeight = Math.min(bottomNavRect.height, viewportHeight - bottomNavRect.top);
        
        document.documentElement.style.setProperty('--bottom-nav-height', `${visibleHeight}px`);
       
        this.classList.add('above-bottom-nav');
      } else {
        
        this.classList.remove('above-bottom-nav');
        document.documentElement.style.removeProperty('--bottom-nav-height');
      }
    };
    
    window.addEventListener('scroll', this._handleScroll, { passive: true });
    window.addEventListener('resize', this._handleScroll, { passive: true });
    
    this._handleScroll();
    this._isScrollListenerActive = true;
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
  disconnectedCallback() {
    document.removeEventListener('keydown', this._handleEsc);
    document.body.style.overflow = '';
  }
  _renderConversations(filter = '') {
    const list = this.shadowRoot.querySelector('.convo-list');
    list.innerHTML = '';
  
    const template = this.shadowRoot.querySelector('#conversation-template');
  
    this._conversations
      .filter((c) => c.name.toLowerCase().includes(filter))
      .forEach((convo) => {
    
        const item = template.content.cloneNode(true);
        const convoElement = item.querySelector('.convo');
     
        item.querySelector('.name').textContent = convo.name;
        item.querySelector('.timestamp').textContent = convo.timestamp;
        item.querySelector('.preview').textContent = convo.preview;
      
        const unreadBadge = item.querySelector('.unread-badge');
        if (convo.unread) {
          unreadBadge.style.display = 'block';
        }
      
        list.appendChild(item);
      
        const addedElement = list.lastElementChild;
      
        addedElement.addEventListener('click', () => {
          this.shadowRoot.querySelector('.convo-list').style.display = 'none';
          this.shadowRoot.querySelector('header').style.display = 'none';
          this.shadowRoot.querySelector('input').style.display = 'none';
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
      });
  }
}
customElements.define('chat-widget', ChatWidget);
export default ChatWidget;