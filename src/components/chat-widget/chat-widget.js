import html from './chat-widget.html?raw';
import css from './chat-widget.css?raw';

/**
 * A chat widget component that displays a floating chat interface.
 * 
 * States:
 * - Collapsed: Shows only the chat bubble button
 * - Expanded: Shows the full chat widget with conversation list
 * - Chat View: Shows individual conversation messages
 * - Above Bottom Nav: Positioned above bottom navigation when visible
 * 
 * Purpose:
 * - Provides a floating chat interface for conversations
 * - Manages conversation list filtering and display
 * - Handles widget visibility and positioning relative to bottom navigation
 * - Responds to user authentication state changes
 * - Supports keyboard navigation (Escape to close)
 */
class ChatWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this._conversations = [
      { id: 1, name: 'Alice', preview: 'Hey!', timestamp: '10:32 AM', unread: true },
      { id: 2, name: 'Bob', preview: 'See you soon.', timestamp: '9:14 AM', unread: false },
      { id: 3, name: 'Carol', preview: 'Got it.', timestamp: 'Yesterday', unread: true },
    ];
    
    this._isVisible = false;
    this._isScrollListenerActive = false;
  }

  connectedCallback() {
    // Bind DOM elements
    this.widgetContainer = this.shadowRoot.querySelector('.widget-container');
    this.chatBubble = this.shadowRoot.querySelector('.chat-bubble');
    this.closeIcon = this.shadowRoot.querySelector('.close-icon');
    this.searchInput = this.shadowRoot.querySelector('input');
    this.convoList = this.shadowRoot.querySelector('.convo-list');
    this.chatScreen = this.shadowRoot.querySelector('.chat-screen');
    this.header = this.shadowRoot.querySelector('header');
    this.backButton = this.shadowRoot.querySelector('.back-button');

    // Bind event handlers
    this._handleEsc = this._handleEsc.bind(this);
    this._handleUserSignedOut = this._handleUserSignedOut.bind(this);
    this._handleUserSignedIn = this._handleUserSignedIn.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleBubbleClick = this._handleBubbleClick.bind(this);
    this._handleSearchInput = this._handleSearchInput.bind(this);
    this._handleBackClick = this._handleBackClick.bind(this);
    this._handleScroll = this._handleScroll.bind(this);

    // Add event listeners
    document.addEventListener('keydown', this._handleEsc);
    document.addEventListener('user-signed-out', this._handleUserSignedOut);
    document.addEventListener('user-signed-in', this._handleUserSignedIn);
    this.closeIcon.addEventListener('click', this._handleCloseClick);
    this.chatBubble.addEventListener('click', this._handleBubbleClick);
    this.searchInput.addEventListener('input', this._handleSearchInput);
    
    if (this.backButton) {
      this.backButton.addEventListener('click', this._handleBackClick);
    }

    // Initialize widget state
    this._renderDisclaimer();
    this._renderInitialState();
    this._renderConversations();
    this._setupBottomNavDetection();
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._handleEsc);
    document.removeEventListener('user-signed-out', this._handleUserSignedOut);
    document.removeEventListener('user-signed-in', this._handleUserSignedIn);
    this.closeIcon.removeEventListener('click', this._handleCloseClick);
    this.chatBubble.removeEventListener('click', this._handleBubbleClick);
    this.searchInput.removeEventListener('input', this._handleSearchInput);
    
    if (this.backButton) {
      this.backButton.removeEventListener('click', this._handleBackClick);
    }

    if (this._isScrollListenerActive) {
      window.removeEventListener('scroll', this._handleScroll);
      window.removeEventListener('resize', this._handleScroll);
    }

    document.body.style.overflow = '';
  }

  /**
   * Adds disclaimer text to the top of the widget container
   */
  _renderDisclaimer() {
    const disclaimer = document.createElement('div');
    disclaimer.textContent = 'Disclaimer: This chat is for demonstration purposes only.';
    disclaimer.className = 'chat-disclaimer';
    this.widgetContainer.insertBefore(disclaimer, this.widgetContainer.firstChild);
  }

  /**
   * Sets the initial display state with widget hidden and bubble visible
   */
  _renderInitialState() {
    this.widgetContainer.style.display = 'none';
  }

  /**
   * Renders the conversation list, optionally filtered by search term
   */
  _renderConversations(filter = '') {
    this.convoList.innerHTML = '';
    
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
        
        item.addEventListener('click', () => this._handleConversationClick(convo));
        this.convoList.appendChild(item);
      });
  }

  /**
   * Shows the chat screen view and hides the conversation list
   */
  _renderChatScreen(convo) {
    this.convoList.style.display = 'none';
    this.header.style.display = 'none';
    this.searchInput.style.display = 'none';
    
    this.chatScreen.classList.remove('hidden');
    this.chatScreen.querySelector('.chat-title').textContent = convo.name;
    
    const messagesContainer = this.chatScreen.querySelector('.messages');
    messagesContainer.innerHTML = `<div class="message">${convo.preview}</div>`;
  }

  /**
   * Shows the conversation list view and hides the chat screen
   */
  _renderConversationList() {
    this.chatScreen.classList.add('hidden');
    this.convoList.style.display = 'block';
    this.header.style.display = 'flex';
    this.searchInput.style.display = 'block';
  }

  /**
   * Shows the widget container and hides the chat bubble
   */
  _renderWidgetVisible() {
    this.widgetContainer.style.display = 'block';
    this.chatBubble.style.display = 'none';
    this._isVisible = true;
  }

  /**
   * Hides the widget container and shows the chat bubble
   */
  _renderWidgetHidden() {
    this.widgetContainer.style.display = 'none';
    this.chatBubble.style.display = 'flex';
    this._isVisible = false;
  }

  /**
   * Updates widget positioning relative to bottom navigation visibility
   */
  _renderBottomNavPosition() {
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
  }

  _handleEsc(e) {
    if (e.key === 'Escape' && this.isConnected && this.parentElement) {
      this.hideWidget();
    }
  }

  _handleUserSignedOut() {
    const chatWidget = document.querySelector('chat-widget');
    if (chatWidget) {
      chatWidget.style.display = 'none';
    }
  }

  _handleUserSignedIn() {
    const chatWidget = document.querySelector('chat-widget');
    if (chatWidget) {
      chatWidget.style.display = 'block';
      console.log('receive event login');
    }
  }

  _handleCloseClick() {
    this.hideWidget();
  }

  _handleBubbleClick() {
    this.toggleWidget();
  }

  _handleSearchInput(e) {
    const term = e.target.value.toLowerCase();
    this._renderConversations(term);
  }

  _handleBackClick() {
    this._renderConversationList();
  }

  _handleConversationClick(convo) {
    this._renderChatScreen(convo);
    
    this.dispatchEvent(new CustomEvent('chat-open', {
      detail: { id: convo.id },
      bubbles: true,
      composed: true,
    }));
  }

  _handleScroll() {
    this._renderBottomNavPosition();
  }

  toggleWidget() {
    if (this._isVisible) {
      this.hideWidget();
    } else {
      this.showWidget();
    }
  }

  showWidget() {
    this._renderWidgetVisible();
  }

  hideWidget() {
    this._renderWidgetHidden();
  }

  _setupBottomNavDetection() {
    if (this._isScrollListenerActive) {return;}
    
    window.addEventListener('scroll', this._handleScroll, { passive: true });
    window.addEventListener('resize', this._handleScroll, { passive: true });
    
    this._handleScroll();
    this._isScrollListenerActive = true;
  }
}

customElements.define('chat-widget', ChatWidget);
export default ChatWidget;