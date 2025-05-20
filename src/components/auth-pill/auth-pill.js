import html from './auth-pill.html?raw';
import css from './auth-pill.css?raw';
import supabase from '../../scripts/utils/supabase.js';

class AuthPill extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.userAvatar = this.shadowRoot.querySelector('.user-avatar');
    this.avatarFallback = this.shadowRoot.querySelector('.initials');
    this.userDropdownMenu = this.shadowRoot.querySelector('.user-dropdown-menu');
    this.userMenuName = this.shadowRoot.querySelector('.user-menu-name');
    this.userMenuEmail = this.shadowRoot.querySelector('.user-menu-email');
  }

  static get observedAttributes() {
    return ['username', 'avatar-url'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {return;}
    if (name === 'username' && newValue) {
      const userData = this.currentUser || {};
      userData.name = newValue;
      userData.initials = this.getInitials(newValue);
      this.setUser(userData);
    }
    if (name === 'avatar-url' && newValue) {
      const userData = this.currentUser || {};
      userData.avatarUrl = newValue;
      this.setUser(userData);
    }
  }

  connectedCallback() {
    this.initAuth();
    this.setupEventListeners();
    this.dispatchEvent(new CustomEvent('auth-connected', { bubbles: true, composed: true }));
  }

  async initAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      this.setUserFromSession(session.user);
    } else {
      this.showLoginButton();
    }
  }

  setupEventListeners() {
    const userPill = this.shadowRoot.querySelector('.user-pill');
    const loginButton = this.shadowRoot.querySelector('#loginButton');

    if (userPill) {
      userPill.addEventListener('click', () => {
        userPill.classList.toggle('expanded');
        this.toggleUserMenu();
      });
    }

    if (loginButton) {
      loginButton.addEventListener('click', () => {
        this.signInWithProvider('google');
      });
    }

    document.addEventListener('click', (e) => {
      const userPill = this.shadowRoot.querySelector('.user-pill');
      if (userPill && userPill.classList.contains('expanded')) {
        const path = e.composedPath();
        if (!path.some((el) => el === userPill)) {
          userPill.classList.remove('expanded');
          this.hideUserMenu();
        }
      }
    });

    if (this.userDropdownMenu) {
      const signoutButton = this.userDropdownMenu.querySelector('#signout-button');
      const profileLink = this.userDropdownMenu.querySelector('#profile-link');
      const settingsLink = this.userDropdownMenu.querySelector('#settings-link');

      signoutButton?.addEventListener('click', (e) => { e.stopPropagation(); this.signOut(); });
      profileLink?.addEventListener('click', (e) => { e.stopPropagation(); this.navigate('/profile'); });
      settingsLink?.addEventListener('click', (e) => { e.stopPropagation(); this.navigate('/settings'); });
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.setUserFromSession(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.showLoginButton();
      }
    });
  }

  async setUserFromSession(user) {
    if (!user) { return; }

    await this.addUserToTable(); // <-- Ensure user is added to the table

    const avatarUrl = this.getUserAvatarUrl(user);
    const userData = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email,
      initials: this.getInitials(user.user_metadata?.full_name || user.email),
      avatarUrl,
      user,
    };

    this.currentUser = userData;
    this.setUser(userData);
    this.dispatchEvent(new CustomEvent('user-signed-in', { bubbles: true, composed: true, detail: { userData } }));
  }

  getUserAvatarUrl(user) {
    const identity = user?.identities?.[0];
    if (identity?.identity_data?.avatar_url) {return identity.identity_data.avatar_url;}
    if (user?.user_metadata?.avatar_url) {return user.user_metadata.avatar_url;}

    const name = user?.user_metadata?.full_name || user?.email || 'User';
    const initials = this.getInitials(name);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
  }

  async signInWithProvider(provider) {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
    } catch (error) {
      console.error(`Sign in with ${provider} failed:`, error);
    }
  }

  toggleUserMenu() {
    if (!this.currentUser || !this.userDropdownMenu) {return;}
    const userPill = this.shadowRoot.querySelector('.user-pill');
    if (!userPill) {return;}

    if (userPill.classList.contains('expanded')) {
      this.updateUserMenuContent();
      this.userDropdownMenu.style.display = 'block';
    } else {
      this.hideUserMenu();
    }
  }

  hideUserMenu() {
    if (this.userDropdownMenu) {
      this.userDropdownMenu.style.display = 'none';
    }
  }
  async addUserToTable() {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const user = session.user;
      const { error: insertError } = await supabase
        .from('users')
        .upsert([{ id: user.id, email: user.email }], { onConflict: ['id'] });

      if (insertError) {
        console.error('Failed to insert user into table:', insertError.message);
      } else {
        console.log('User upserted successfully:', user.email);
      }
    }
  }

  updateUserMenuContent() {
    if (!this.currentUser || !this.userMenuName || !this.userMenuEmail) {return;}
    this.userMenuName.textContent = this.currentUser.name;
    this.userMenuEmail.textContent = this.currentUser.email;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      return;
    }
    this.currentUser = null;
    this.showLoginButton();
    this.dispatchEvent(new CustomEvent('user-signed-out', { bubbles: true, composed: true }));
  }

  setUser(userData) {
    if (!userData) {
      this.showLoginButton();
      return;
    }

    const userPill = this.shadowRoot.querySelector('#loggedInPill');
    const nameElement = this.shadowRoot.querySelector('.user-name');

    if (userPill) {userPill.style.display = 'flex';}
    if (userData.name && nameElement) {nameElement.textContent = userData.name;}

    if (userData.avatarUrl) {
      this.updateUserAvatar(userData.avatarUrl);
    } else if (userData.initials) {
      this.setAvatarFallback(userData.name || userData.email);
    }

    this.updateUserMenuContent();

    const loginButton = this.shadowRoot.querySelector('#loginButton');
    if (loginButton) {loginButton.style.display = 'none';}
  }

  updateUserAvatar(avatarUrl) {
    if (!this.userAvatar) {return;}

    const existingImg = this.userAvatar.querySelector('img');
    if (existingImg) {existingImg.remove();}

    const img = document.createElement('img');
    img.src = avatarUrl;
    img.alt = 'User avatar';
    img.onerror = () => {
      img.remove();
      this.setAvatarFallback(this.currentUser?.email);
    };

    this.userAvatar.appendChild(img);
    if (this.avatarFallback) {this.avatarFallback.textContent = '';}
  }

  setAvatarFallback(identifier) {
    if (!this.avatarFallback || !identifier) {return;}
    const initials = this.getInitials(identifier);
    this.avatarFallback.textContent = initials;
  }

  showLoginButton() {
    const userPill = this.shadowRoot.querySelector('#loggedInPill');
    if (userPill) {
      userPill.style.display = 'none';
      userPill.classList.remove('expanded');
    }
    this.hideUserMenu();
    const loginButton = this.shadowRoot.querySelector('#loginButton');
    if (loginButton) {loginButton.style.display = 'flex';}
  }

  getInitials(name) {
    if (!name) {return 'U';}
    const names = name.split(' ').filter(Boolean);
    if (names.length === 0) {return 'U';}
    if (names.length === 1) {return names[0][0].toUpperCase();}
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }

  setLoginStatus(userData) {
    if (userData) {
      this.currentUser = userData;
      this.setUser(userData);
    } else {
      this.signOut();
    }
    return this;
  }

  navigate(path) {
    this.dispatchEvent(new CustomEvent('navigate', { bubbles: true, composed: true, detail: { path } }));
    this.hideUserMenu();
    const userPill = this.shadowRoot.querySelector('.user-pill');
    if (userPill) {userPill.classList.remove('expanded');}
  }
}

customElements.define('auth-pill', AuthPill);
export default AuthPill;
