import { AuthModel } from '../models/AuthModel.js';
import supabase from '../utils/supabase.js';

export class AuthController {
  constructor() {
    this.model = new AuthModel();
    
    // UI Elements
    this.loginButton = null;
    this.logoutButton = null;
    this.userInfo = null;
    this.userEmail = null;
    this.userAvatar = null;
    this.avatarFallback = null;
    
    // Bind methods
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.updateAuthUI = this.updateAuthUI.bind(this);
    this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
  }
  
  /**
   * Initialize the controller
   */
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Get UI elements
      this.loginButton = document.getElementById('login-button');
      this.logoutButton = document.getElementById('logout-button');
      this.userInfo = document.getElementById('user-info');
      this.userEmail = document.getElementById('user-email');
      this.userAvatar = document.getElementById('user-avatar');
      this.avatarFallback = this.userAvatar.querySelector('.fallback');
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Set up auth state change listener
      supabase.auth.onAuthStateChange((event, session) => {
        this.handleAuthStateChange(event, session);
      });
      
      // Initialize the model and update UI
      this.model.init().then(() => {
        this.updateAuthUI();
      });
    });
  }
  
  /**
   * Handle auth state changes
   * @param {string} event - Auth event type
   * @param {Object} session - Auth session
   */
  async handleAuthStateChange(event, _session) {
    console.log('Auth state changed:', event);
    await this.model.refreshSession();
    this.updateAuthUI();
  }
  
  /**
   * Set up UI event listeners
   */
  setupEventListeners() {
    this.loginButton?.addEventListener('click', this.handleLogin);
    this.logoutButton?.addEventListener('click', this.handleLogout);
  }
  
  /**
   * Handle login button click
   */
  async handleLogin() {
    try {
      await this.model.signInWithOAuth('google');
      // Auth state listener will update UI
    } catch (error) {
      console.error('Login failed:', error.message);
      // Could show error message to user here
    }
  }
  
  /**
   * Handle logout button click
   */
  async handleLogout() {
    try {
      await this.model.signOut();
      // Auth state listener will update UI
    } catch (error) {
      console.error('Logout failed:', error.message);
      // Could show error message to user here
    }
  }
  
  /**
   * Update UI based on authentication state
   */
  updateAuthUI() {
    if (!this.loginButton || !this.logoutButton || !this.userInfo || !this.userEmail) {
      return; // UI elements not yet available
    }
    
    const user = this.model.getCurrentUser();
    
    if (user) {
      // User is logged in
      this.loginButton.classList.add('hidden');
      this.userInfo.classList.remove('hidden');
      this.userEmail.textContent = user.email;
      
      // Set up avatar (try to use Google avatar if available)
      this.updateUserAvatar(user);
    } else {
      // User is logged out
      this.loginButton.classList.remove('hidden');
      this.userInfo.classList.add('hidden');
      this.userEmail.textContent = '';
      
      // Clear avatar
      if (this.userAvatar) {
        const img = this.userAvatar.querySelector('img');
        if (img) {
          img.remove();
        }
        
        if (this.avatarFallback) {
          this.avatarFallback.textContent = '';
        }
      }
    }
  }
  
  /**
   * Update user avatar with Google profile picture or fallback
   * @param {Object} user - User object from Supabase
   */
  updateUserAvatar(user) {
    if (!this.userAvatar || !user) {return;}
    
    // Clear existing avatar content
    const existingImg = this.userAvatar.querySelector('img');
    if (existingImg) {
      existingImg.remove();
    }
    
    // Try to get avatar URL from user metadata or identity providers
    let avatarUrl = null;
    
    // Check if user has Google identity with avatar
    if (user.identities) {
      const googleIdentity = user.identities.find(
        (identity) => identity.provider === 'google',
      );
      
      if (googleIdentity?.identity_data?.avatar_url) {
        avatarUrl = googleIdentity.identity_data.avatar_url;
      }
    }
    
    // If we have a picture URL, create an image element
    if (avatarUrl) {
      const img = document.createElement('img');
      img.src = avatarUrl;
      img.alt = 'User avatar';
      img.onerror = () => {
        // If image fails to load, fall back to initials
        img.remove();
        this.setAvatarFallback(user.email);
      };
      
      this.userAvatar.appendChild(img);
      
      // Hide the fallback element
      if (this.avatarFallback) {
        this.avatarFallback.textContent = '';
      }
    } else {
      // No avatar URL, use fallback (first initial of email)
      this.setAvatarFallback(user.email);
    }
  }
  
  /**
   * Set avatar fallback with user's initial
   * @param {string} email - User's email
   */
  setAvatarFallback(email) {
    if (!this.avatarFallback || !email) {return;}
    
    // Get first character of email as fallback
    const initial = email.charAt(0).toUpperCase();
    this.avatarFallback.textContent = initial;
  }
}