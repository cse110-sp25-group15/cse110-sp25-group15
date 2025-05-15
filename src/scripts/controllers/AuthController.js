import { AuthModel } from '../models/AuthModel.js';

export class AuthController {
  constructor() {
    this.model = new AuthModel();
    
    // UI Elements
    this.loginButton = null;
    this.logoutButton = null;
    this.userInfo = null;
    this.userEmail = null;
    
    // Bind methods
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.updateAuthUI = this.updateAuthUI.bind(this);
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
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Initialize the model and listen for changes
      this.model.addListener(this.updateAuthUI);
      this.model.init();
    });
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
      this.logoutButton.classList.remove('hidden');
      this.userInfo.classList.remove('hidden');
      this.userEmail.textContent = user.email;
    } else {
      // User is logged out
      this.loginButton.classList.remove('hidden');
      this.logoutButton.classList.add('hidden');
      this.userInfo.classList.add('hidden');
      this.userEmail.textContent = '';
    }
  }
}