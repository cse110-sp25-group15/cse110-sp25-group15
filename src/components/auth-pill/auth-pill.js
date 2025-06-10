import html from './auth-pill.html?raw';
import css from './auth-pill.css?raw';
import supabase from '../../scripts/utils/supabase.js';

/**
 * `AuthPill` is a Web Component that manages user authentication UI with Supabase.
 * It provides a toggleable "pill" that either prompts the user to sign in (via Google OAuth)
 * or displays user information and a dropdown menu with profile and sign-out options.
 *
 * ### Component States:
 * - **Logged Out**: Displays a login button prompting sign-in.
 * - **Logged In**: Shows the user pill with their avatar/initials and name.
 * - **Menu Expanded**: User has clicked the pill, showing the dropdown menu.
 * - **Menu Collapsed**: Dropdown is hidden.
 *
 * The component reacts to authentication changes and syncs UI accordingly. It also persists
 * user information to a Supabase `users` table and dispatches events on sign-in and sign-out.
 */
class AuthPill extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    // Component state
    this.user = null;
    this.hasSavedUser = false;
  }

  connectedCallback() {
    // Bind DOM elements
    this.pill = this.shadowRoot.querySelector('.user-pill');
    this.loginBtn = this.shadowRoot.querySelector('#loginButton');
    this.userPill = this.shadowRoot.querySelector('#loggedInPill');
    this.menu = this.shadowRoot.querySelector('.user-dropdown-menu');
    this.nameEl = this.shadowRoot.querySelector('.user-name');
    this.menuName = this.shadowRoot.querySelector('.user-menu-name');
    this.menuEmail = this.shadowRoot.querySelector('.user-menu-email');
    this.avatar = this.shadowRoot.querySelector('.user-avatar');
    this.avatarImg = this.avatar.querySelector('img');
    this.initials = this.shadowRoot.querySelector('.initials');
    this.signoutBtn = this.menu?.querySelector('#signout-button');
    this.profileLink = this.menu?.querySelector('#profile-link');

    // Bind event handlers
    this._handleLogin = this._handleLogin.bind(this);
    this._handleToggleMenu = this._handleToggleMenu.bind(this);
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    this._handleSignout = this._handleSignout.bind(this);
    this._handleProfileClick = this._handleProfileClick.bind(this);
    this._handleAuthChange = this._handleAuthChange.bind(this);

    // Add event listeners
    this.loginBtn?.addEventListener('click', this._handleLogin);
    this.pill?.addEventListener('click', this._handleToggleMenu);
    document.addEventListener('click', this._handleOutsideClick);
    this.signoutBtn?.addEventListener('click', this._handleSignout);
    this.profileLink?.addEventListener('click', this._handleProfileClick);
    
    // Setup auth listener
    this._authUnsubscribe = supabase.auth.onAuthStateChange(this._handleAuthChange);
    
    // Initial auth check
    this._checkAuthState();
  }

  disconnectedCallback() {
    // Remove all event listeners to prevent memory leaks
    this.loginBtn?.removeEventListener('click', this._handleLogin);
    this.pill?.removeEventListener('click', this._handleToggleMenu);
    document.removeEventListener('click', this._handleOutsideClick);
    this.signoutBtn?.removeEventListener('click', this._handleSignout);
    this.profileLink?.removeEventListener('click', this._handleProfileClick);
    
    // Unsubscribe from auth changes
    if (this._authUnsubscribe) {
      this._authUnsubscribe.data?.subscription?.unsubscribe();
    }
  }

  // DOM-UPDATE HELPERS (Pure DOM mutations)

  /**
   * Renders the UI for a logged-out user.
   * - Hides the user pill.
   * - Shows the login button.
   * - Resets avatar and initials display.
   */
  _renderLoginUI() {
    this.userPill.style.display = 'none';
    this.loginBtn.style.display = 'flex';
    this.pill?.classList.remove('expanded');
    this.menu.style.display = 'none';
    
    // Reset avatar state
    this.avatarImg.style.display = 'none';
    this.avatarImg.src = '';
    this.initials.textContent = '';
  }

  /**
   * Renders the UI for a logged-in user.
   * - Displays the user pill with name and avatar or initials.
   * - Hides the login button.
   */
  _renderUserUI() {
    this.userPill.style.display = 'flex';
    this.loginBtn.style.display = 'none';
    
    // Update user info
    if (this.nameEl && this.user) {
      this.nameEl.textContent = this.user.name;
    }
    
    // Update avatar
    if (this.user?.avatarUrl) {
      this.avatarImg.src = this.user.avatarUrl;
      this.avatarImg.alt = 'User avatar';
      this.avatarImg.style.display = 'block';
      this.avatarImg.onerror = () => {
        this.avatarImg.style.display = 'none';
        this.initials.textContent = this._getInitials(this.user.name);
      };
      this.initials.textContent = '';
    } else {
      this.avatarImg.style.display = 'none';
      this.initials.textContent = this._getInitials(this.user.name);
    }
  }

  /**
   * Renders the expanded dropdown menu.
   * - Displays additional user info like name and email.
   * - Sets menu to visible and pill to expanded.
   */
  _renderMenuOpen() {
    this.pill.classList.add('expanded');
    this.menu.style.display = 'block';
    
    // Update menu content
    if (this.user) {
      if (this.menuName) {this.menuName.textContent = this.user.name;}
      if (this.menuEmail) {this.menuEmail.textContent = this.user.email;}
    }
  }
  
  /**
   * Collapses the dropdown menu.
   * - Hides the dropdown menu and removes expanded state from pill.
   */
  _renderMenuClosed() {
    this.pill?.classList.remove('expanded');
    this.menu.style.display = 'none';
  }

  // EVENT HANDLERS
  _handleLogin() {
    const currentUrl = window.location.href;
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: currentUrl },
    });
  }

  _handleToggleMenu() {
    if (this.pill.classList.contains('expanded')) {
      this._renderMenuClosed();
    } else {
      this._renderMenuOpen();
    }
  }

  _handleOutsideClick(e) {
    if (this.pill?.classList.contains('expanded') && !e.composedPath().includes(this.pill)) {
      this._renderMenuClosed();
    }
  }

  _handleSignout(e) {
    e.stopPropagation();
    this._logout();
  }

  _handleProfileClick() {
    window.location.href = '/cse110-sp25-group15/profile.html';
    this._renderMenuClosed();
  }

  _handleAuthChange(event, session) {
    if (event === 'SIGNED_IN' && session) {
      window.notify('You have signed in', 'success');
      this._processUserSignIn(session.user);
    } 
  }

  // MAIN LOGIC METHODS
  async _checkAuthState() {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      this._processUserSignIn(data.session.user);
    } else {
      this._processUserSignOut();
    }
  }

  async _processUserSignIn(userData) {
    if (window.location.href.endsWith('#')) {
      window.location.href = window.location.href.slice(0, -1);
    }
    if (!userData || this.hasSavedUser) {return;}
    this.hasSavedUser = true;
    const saveSuccess = await this._saveUserToDatabase(userData);
    if (!saveSuccess) {
      this.hasSavedUser = false;
      return;
    }
    this.user = {
      id: userData.id,
      email: userData.email,
      name: userData.user_metadata?.full_name || userData.email,
      avatarUrl: this._getAvatarUrl(userData),
    };

    this._renderUserUI();
    this.dispatchEvent(new CustomEvent('user-signed-in', { 
      bubbles: true, 
      composed: true, 
      detail: { userData: this.user }, 
    }));
  }

  _processUserSignOut() {
    if (this.user === null) {return;}
    this.user = null;
    this.hasSavedUser = false;
    this._renderLoginUI();
    
    this.dispatchEvent(new CustomEvent('user-signed-out', { 
      bubbles: true, 
      composed: true, 
    }));
    window.notify('You have signed out', 'success');

  }

  async _saveUserToDatabase(user) {
    try {
      const displayName = user.email?.split('@')[0];
      const { error } = await supabase
        .from('users')
        .upsert([{ id: user.id, 
          email: user.email,
          display_name: displayName }], { onConflict: ['id'] });
      
      if (error) {
        throw error;
      }
      return true;
    } catch (err) {
      console.error('Failed to save user:', err);
      await this._logout();
      window.notify('You must use a UCSD email to login', 'warning');
      return false;
    }
  }

  async _logout() {
    await supabase.auth.signOut();
    this._processUserSignOut();
  }

  // UTILITY HELPERS (Pure functions)
  _getAvatarUrl(user) {
    // Try provider avatar
    const avatarUrl = user?.identities?.[0]?.identity_data?.avatar_url || 
                      user?.user_metadata?.avatar_url;
    if (avatarUrl) {return avatarUrl;}
    const name = user?.user_metadata?.full_name || user?.email || 'User';
    const initials = this._getInitials(name);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
  }

  _getInitials(name) {
    if (!name) {return 'U';}
    const parts = name.split(' ').filter(Boolean);
    return parts.length <= 1 
      ? (parts[0]?.[0] || 'U').toUpperCase()
      : (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
  }
}

customElements.define('auth-pill', AuthPill);
export default AuthPill;