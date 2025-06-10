import html from './profile-info.html?raw';
import css from './profile-info.css?raw';
import supabase from '../../scripts/utils/supabase.js';

/**
 * A component that displays user profile information with authentication management.
 * 
 * States:
 * - Loading: Shows loading spinner while fetching user data
 * - Profile Display: Shows user avatar, name, email, member date, and listings count
 * - Error: Shows error message when authentication fails or data fetch fails
 * - Sign Out: Handles user sign out and redirects
 * 
 * Purpose:
 * - Displays comprehensive user profile information
 * - Handles user authentication state and sign out functionality
 * - Shows user avatar with fallback to initials
 * - Displays user statistics (member since date, listings count)
 * - Manages authentication state changes and redirects
 * - Provides error handling for authentication failures
 */
class ProfileInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.user = null;
  }

  connectedCallback() {
    // Bind DOM elements
    this.profileCard = this.shadowRoot.querySelector('.profile-card');
    this.avatarEl = this.shadowRoot.querySelector('.profile-avatar');
    this.nameEl = this.shadowRoot.querySelector('.profile-name');
    this.emailEl = this.shadowRoot.querySelector('.profile-email');
    this.memberSinceEl = this.shadowRoot.querySelector('.member-since');
    this.listingsCountEl = this.shadowRoot.querySelector('.listings-count');
    this.signOutBtn = this.shadowRoot.querySelector('.sign-out-btn');
    this.loadingState = this.shadowRoot.querySelector('.loading-state');
    this.errorState = this.shadowRoot.querySelector('.error-state');
    this.errorMessage = this.shadowRoot.querySelector('.error-message');

    // Bind event handlers
    this._handleSignOut = this._handleSignOut.bind(this);
    this._handleAuthChange = this._handleAuthChange.bind(this);

    // Add event listeners
    this.signOutBtn.addEventListener('click', this._handleSignOut);
    supabase.auth.onAuthStateChange(this._handleAuthChange);

    // Load initial data
    this._loadUserProfile();
  }

  disconnectedCallback() {
    this.signOutBtn.removeEventListener('click', this._handleSignOut);
    supabase.auth.removeListener('SIGNED_OUT', this._handleAuthChange);
  }

  /**
   * Shows loading state and hides profile and error states
   */
  _renderLoading() {
    this.loadingState.style.display = 'flex';
    this.profileCard.style.display = 'none';
    this.errorState.style.display = 'none';
  }

  /**
   * Shows profile card and hides loading state
   */
  _renderProfile() {
    this.loadingState.style.display = 'none';
    this.profileCard.style.display = 'flex';
    this.errorState.style.display = 'none';
  }

  /**
   * Shows error state with message and hides other states
   */
  _renderError(message) {
    this.loadingState.style.display = 'none';
    this.profileCard.style.display = 'none';
    this.errorState.style.display = 'flex';
    this.errorMessage.textContent = message;
  }

  /**
   * Updates the user avatar with image or fallback initials
   */
  _renderAvatar(user) {
    const avatarUrl = this._getAvatarUrl(user);
    
    if (avatarUrl) {
      const img = document.createElement('img');
      img.src = avatarUrl;
      img.alt = 'Profile avatar';
      img.onerror = () => {
        img.remove();
        this._renderAvatarFallback(user);
      };
      this.avatarEl.innerHTML = '';
      this.avatarEl.appendChild(img);
    } else {
      this._renderAvatarFallback(user);
    }
  }

  /**
   * Renders fallback avatar with user initials
   */
  _renderAvatarFallback(user) {
    const name = user?.user_metadata?.full_name || user?.email || 'User';
    const initials = this._getInitials(name);
    this.avatarEl.innerHTML = `<span class="avatar-initials">${initials}</span>`;
  }

  /**
   * Updates all profile information displays
   */
  _renderProfileInfo(user, listingsCount) {
    this._renderAvatar(user);
    
    this.nameEl.textContent = user.user_metadata?.full_name || user.email.split('@')[0];
    this.emailEl.textContent = user.email;
    
    const memberSince = new Date(user.created_at);
    this.memberSinceEl.textContent = `Member since ${memberSince.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric', 
    })}`;
    
    this.listingsCountEl.textContent = listingsCount;
  }

  async _handleSignOut() {
    await supabase.auth.signOut();
    window.notify('Successfully signed out', 'info');
    setTimeout(() => {
      window.location.href = '/cse110-sp25-group15/';
    }, 1000);
  }

  _handleAuthChange(event) {
    if (event === 'SIGNED_OUT') {
      window.location.href = '/cse110-sp25-group15/';
    }
  }

  async _loadUserProfile() {
    try {
      this._renderLoading();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user || authError) {
        this._renderError('Please sign in to view your profile');
        setTimeout(() => {
          window.location.href = '/cse110-sp25-group15/';
        }, 2000);
        return;
      }
      
      this.user = user;
      
      const { count } = await supabase
        .from('listings')
        .select('listing_id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      this._renderProfileInfo(user, count || 0);
      this._renderProfile();
    } catch {
      this._renderError('Failed to load profile data');
    }
  }

  _getAvatarUrl(user) {
    return user?.identities?.[0]?.identity_data?.avatar_url || user?.user_metadata?.avatar_url;
  }

  _getInitials(name) {
    const parts = name.split(' ').filter(Boolean);
    if (!parts.length) {return 'U';}
    
    return parts.length === 1 
      ? parts[0][0].toUpperCase() 
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}

customElements.define('profile-info', ProfileInfo);
export default ProfileInfo;