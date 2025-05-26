import html from './auth-pill.html?raw';
import css from './auth-pill.css?raw';
import supabase from '../../scripts/utils/supabase.js';

class AuthPill extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>${css}</style>${html}`;
    this.user = null;
    this.savedUser = false;
  }

  connectedCallback() {
    this.setupElements();
    this.checkAuthState();
    this.setupListeners();
  }

  setupElements() {
    this.pill = this.shadowRoot.querySelector('.user-pill');
    this.loginBtn = this.shadowRoot.querySelector('#loginButton');
    this.userPill = this.shadowRoot.querySelector('#loggedInPill');
    this.menu = this.shadowRoot.querySelector('.user-dropdown-menu');
    this.nameEl = this.shadowRoot.querySelector('.user-name');
    this.menuName = this.shadowRoot.querySelector('.user-menu-name');
    this.menuEmail = this.shadowRoot.querySelector('.user-menu-email');
    this.avatar = this.shadowRoot.querySelector('.user-avatar');
    this.initials = this.shadowRoot.querySelector('.initials');
    this.signoutBtn = this.menu?.querySelector('#signout-button');
    this.profileLink = this.menu?.querySelector('#profile-link');

  }

  setupListeners() {
    // Login button
    this.loginBtn?.addEventListener('click', () => {
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
    });
    
    // Toggle menu
    this.pill?.addEventListener('click', this.toggleMenu.bind(this));
    
    // Close menu when clicking outside
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    
    // Menu actions
    this.signoutBtn?.addEventListener('click', this.handleSignout.bind(this));
    this.profileLink?.addEventListener('click', () => this.handleNavigation('/profile'));
    
    // Auth change listener
    supabase.auth.onAuthStateChange(this.handleAuthChange.bind(this));
  }

  handleOutsideClick(e) {
    if (this.pill?.classList.contains('expanded') && !e.composedPath().includes(this.pill)) {
      this.pill.classList.remove('expanded');
      this.menu.style.display = 'none';
    }
  }

  handleSignout(e) {
    e.stopPropagation();
    this.logout();
  }

  handleNavigation(path) {
  // Direct navigation instead of dispatching event
    if (path === '/profile') {
      window.location.href = '/profile.html';
    } else {
      window.location.href = path;
    }
  
    this.menu.style.display = 'none';
    this.pill?.classList.remove('expanded');
  }

  handleAuthChange(event, session) {
    if (event === 'SIGNED_IN' && session) {
      this.updateUser(session.user);
    } else if (event === 'SIGNED_OUT') {
      this.showLoginUI();
    }
  }

  toggleMenu() {
    this.pill.classList.toggle('expanded');
    
    if (this.pill.classList.contains('expanded')) {
      this.updateMenuContent();
      this.menu.style.display = 'block';
    } else {
      this.menu.style.display = 'none';
    }
  }

  async checkAuthState() {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      this.updateUser(data.session.user);
    } else {
      this.showLoginUI();
    }
  }

  async updateUser(userData) {
    if (!userData || this.hasSavedUser) {return;}
    
    // Save to database
    this.hasSavedUser = true;
    this.saveUserToDatabase(userData);
    
    // Set user data
    this.user = {
      id: userData.id,
      email: userData.email,
      name: userData.user_metadata?.full_name || userData.email,
      avatarUrl: this.getAvatarUrl(userData),
    };
    
    // Update UI
    this.userPill.style.display = 'flex';
    this.loginBtn.style.display = 'none';
    
    if (this.nameEl) {this.nameEl.textContent = this.user.name;}
    
    this.updateAvatar();
    
    this.dispatchEvent(new CustomEvent('user-signed-in', { 
      bubbles: true, composed: true, detail: { userData: this.user }, 
    }));
  }

  async saveUserToDatabase(user) {
    try {
      await supabase
        .from('users')
        .upsert([{ id: user.id, email: user.email }], { onConflict: ['id'] });
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  }

  updateAvatar() {
    if (!this.user) {return;}
    
    if (this.user.avatarUrl) {
      const img = document.createElement('img');
      img.src = this.user.avatarUrl;
      img.alt = 'User avatar';
      img.onerror = () => {
        img.remove();
        this.initials.textContent = this.getInitials(this.user.name);
      };
      
      this.avatar.innerHTML = '';
      this.avatar.appendChild(img);
      this.initials.textContent = '';
    } else {
      this.initials.textContent = this.getInitials(this.user.name);
    }
  }

  updateMenuContent() {
    if (!this.user) {return;}
    
    if (this.menuName) {this.menuName.textContent = this.user.name;}
    if (this.menuEmail) {this.menuEmail.textContent = this.user.email;}
  }

  getAvatarUrl(user) {
    // Try provider avatar
    const avatarUrl = user?.identities?.[0]?.identity_data?.avatar_url || 
                      user?.user_metadata?.avatar_url;
    
    if (avatarUrl) {return avatarUrl;}
    
    // Generate placeholder
    const name = user?.user_metadata?.full_name || user?.email || 'User';
    const initials = this.getInitials(name);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
  }

  getInitials(name) {
    if (!name) {return 'U';}
    const parts = name.split(' ').filter(Boolean);
    return parts.length <= 1 
      ? (parts[0]?.[0] || 'U').toUpperCase()
      : (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
  }

  showLoginUI() {
    this.userPill.style.display = 'none';
    this.pill?.classList.remove('expanded');
    this.loginBtn.style.display = 'flex';
    this.menu.style.display = 'none';
    this.user = null;
  }

  async logout() {
    await supabase.auth.signOut();
    this.showLoginUI();
    this.dispatchEvent(new CustomEvent('user-signed-out', { 
      bubbles: true, composed: true, 
    }));
  }
}

customElements.define('auth-pill', AuthPill);
export default AuthPill;