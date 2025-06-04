import html from './profile-info.html?raw';
import css from './profile-info.css?raw';
import supabase from '../../scripts/utils/supabase.js';

class ProfileInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.user = null;
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.setupElements();
    this.loadUserProfile();
    this.setupEventListeners();
  }

  setupElements() {
    this.profileCard = this.shadowRoot.querySelector('.profile-card');
    this.avatarEl = this.shadowRoot.querySelector('.profile-avatar');
    this.nameEl = this.shadowRoot.querySelector('.profile-name');
    this.emailEl = this.shadowRoot.querySelector('.profile-email');
    this.memberSinceEl = this.shadowRoot.querySelector('.member-since');
    this.listingsCountEl = this.shadowRoot.querySelector('.listings-count');
    this.signOutBtn = this.shadowRoot.querySelector('.sign-out-btn');
    this.loadingState = this.shadowRoot.querySelector('.loading-state');
    this.errorState = this.shadowRoot.querySelector('.error-state');
  }

  setupEventListeners() {
    this.signOutBtn?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.notify('Successfully signed out', 'info');
      setTimeout(() => {
        window.location.href = '/cse110-sp25-group15/';
      }, 1000);
    });

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        window.location.href = '/cse110-sp25-group15/';
      }
    });
  }

  async loadUserProfile() {
    try {
      // Show loading state
      this.showLoading();

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (!user || authError) {
        this.showError('Please sign in to view your profile');
        setTimeout(() => {
          window.location.href = '/cse110-sp25-group15/';
        }, 2000);
        return;
      }

      this.user = user;

      // Get user listings count
      const { count, error: countError } = await supabase
        .from('listings')
        .select('listing_id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) {
        console.error('Error fetching listings count:', countError);
      }

      // Update UI with user data
      this.updateProfileUI(user, count || 0);
      this.hideLoading();

    } catch (error) {
      console.error('Error loading profile:', error);
      this.showError('Failed to load profile data');
    }
  }

  updateProfileUI(user, listingsCount) {
    // Update avatar
    const avatarUrl = this.getUserAvatarUrl(user);
    if (avatarUrl) {
      const img = document.createElement('img');
      img.src = avatarUrl;
      img.alt = 'Profile avatar';
      img.onerror = () => {
        img.remove();
        this.setAvatarFallback(user);
      };
      this.avatarEl.innerHTML = '';
      this.avatarEl.appendChild(img);
    } else {
      this.setAvatarFallback(user);
    }

    // Update text content
    this.nameEl.textContent = user.user_metadata?.full_name || user.email.split('@')[0];
    this.emailEl.textContent = user.email;
    
    // Format member since date
    const memberSince = new Date(user.created_at);
    const formattedDate = memberSince.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric', 
    });
    this.memberSinceEl.textContent = `Member since ${formattedDate}`;
    
    // Update listings count
    this.listingsCountEl.textContent = listingsCount;
  }

  getUserAvatarUrl(user) {
    return user?.identities?.[0]?.identity_data?.avatar_url || 
           user?.user_metadata?.avatar_url;
  }

  setAvatarFallback(user) {
    const name = user?.user_metadata?.full_name || user?.email || 'User';
    const initials = this.getInitials(name);
    this.avatarEl.innerHTML = `<span class="avatar-initials">${initials}</span>`;
  }

  getInitials(name) {
    if (!name) {return 'U';}
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) {return 'U';}
    if (parts.length === 1) {return parts[0][0].toUpperCase();}
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  showLoading() {
    this.loadingState.style.display = 'flex';
    this.profileCard.style.display = 'none';
    this.errorState.style.display = 'none';
  }

  hideLoading() {
    this.loadingState.style.display = 'none';
    this.profileCard.style.display = 'flex';
  }

  showError(message) {
    this.loadingState.style.display = 'none';
    this.profileCard.style.display = 'none';
    this.errorState.style.display = 'flex';
    const errorMessage = this.shadowRoot.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.textContent = message;
    }
  }
}

customElements.define('profile-info', ProfileInfo);
export default ProfileInfo;