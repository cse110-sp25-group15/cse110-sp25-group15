/* global google */

import html from './site-header.html?raw';
import css from './site-header.css?raw';

/**
 * Site Header Component with Google OAuth integration
 * Displays the main navigation header with logo, links, and user authentication
  */
 
class SiteHeader extends HTMLElement {
  /**
   * Constructor initializes the component
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.googleAuthInitialized = false;
    this.currentUser = null;
  }

  /**
   * List of attributes that should trigger attributeChangedCallback
   */
  static get observedAttributes() {
    return ['username', 'avatar-url'];
  }

  /**
   * Lifecycle callback when attributes change
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {return;}
    
    if (name === 'username' && newValue) {
      // Update the user name if attribute changes
      const userData = this.currentUser || {};
      userData.name = newValue;
      userData.initials = this.getInitials(newValue);
      this.setUser(userData);
    }
    
    if (name === 'avatar-url' && newValue) {
      // Update the avatar if attribute changes
      const userData = this.currentUser || {};
      userData.avatarUrl = newValue;
      this.setUser(userData);
    }
  }

  /**
   * Lifecycle callback when component is connected to the DOM
   */
  connectedCallback() {
    // Create template and add to shadow DOM
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    // Set up event listeners and initialize auth
    this.setupEventListeners();
    this.initGoogleAuth();
    
    // Dispatch event when component is fully connected
    this.dispatchEvent(new CustomEvent('header-connected', {
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Initialize Google OAuth client library
   */
  initGoogleAuth() {
    // Load Google Identity Services script
    if (!document.getElementById('google-oauth')) {
      const script = document.createElement('script');
      script.id = 'google-oauth';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.googleAuthInitialized = true;
        this.renderGoogleSignInButton();
      };
      document.head.appendChild(script);
    } else if (window.google && window.google.accounts) {
      // Script already loaded(s)
      this.googleAuthInitialized = true;
      this.renderGoogleSignInButton();
    }
  }

  /**
   * Render Google Sign-In button
   */
  renderGoogleSignInButton() {
    if (!this.googleAuthInitialized || !window.google) {return;}

    const authContainer = this.shadowRoot.querySelector('.auth-container');
    if (!authContainer) {return;}

    // Check if there's stored user data in local storage
    const storedUser = localStorage.getItem('tritonUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.setUser(userData);
        this.currentUser = userData;
      } catch (e) {
        console.error('Error parsing stored user data:', e);
        this.showLoginButton();
      }
    } else {
      this.showLoginButton();
    }
  }

  /**
   * Sets up event listeners for the component
   */
  setupEventListeners() {
    // Get references to elements within the shadow DOM
    const searchIcon = this.shadowRoot.querySelector('.search-icon');
    const searchContainer = this.shadowRoot.querySelector('.search-container');
    const searchInput = this.shadowRoot.querySelector('.search-input');
    const searchForm = this.shadowRoot.querySelector('.search-form');
    const userPill = this.shadowRoot.querySelector('.user-pill');
    
    // Toggle search bar when icon is clicked
    if (searchIcon) {
      searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
          searchInput.focus();
        }
        
        // Dispatch the custom event for external listeners
        this.dispatchEvent(new CustomEvent('search-click', {
          bubbles: true,
          composed: true,
        }));
      });
    }
    
    // Handle search submission
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          // Dispatch a custom event with the search query
          this.dispatchEvent(new CustomEvent('search-submit', {
            bubbles: true,
            composed: true,
            detail: { query },
          }));
          
          // Reset and close the search after submission
          searchInput.value = '';
          searchContainer.classList.remove('active');
        }
      });
    }
    
    // Close search when ESC key is pressed
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchContainer && searchContainer.classList.contains('active')) {
        searchContainer.classList.remove('active');
      }
    });
    
    // User Pill click event (for logged-in users)
    if (userPill) {
      userPill.addEventListener('click', () => {
        userPill.classList.toggle('expanded');
        this.renderUserMenu();
      });
    }

    // Add global event listener for clicks outside the user menu
    document.addEventListener('click', (e) => {
      // Check if we have a user pill and it's expanded
      const userPill = this.shadowRoot.querySelector('.user-pill');
      if (userPill && userPill.classList.contains('expanded')) {
        // Check if click is outside the user pill
        const path = e.composedPath();
        if (!path.some((el) => el === userPill)) {
          userPill.classList.remove('expanded');
        }
      }
    });
  }

  /**
   * Handle Google sign-in callback
   * @param {Object} response - Google credential response
   */
  handleGoogleSignIn(response) {
    // Parse the JWT token from Google
    const payload = this.parseJwt(response.credential);
    
    // Extract user information
    const userData = {
      name: payload.name,
      email: payload.email,
      avatarUrl: payload.picture,
      initials: this.getInitials(payload.name),
      id: payload.sub, // Google's unique identifier for the user
    };
    
    // Save user data to local storage
    localStorage.setItem('tritonUser', JSON.stringify(userData));
    
    // Update UI
    this.currentUser = userData;
    this.setUser(userData);
    
    // Dispatch event that user has logged in
    this.dispatchEvent(new CustomEvent('user-signed-in', {
      bubbles: true,
      composed: true,
      detail: { userData },
    }));
  }

  /**
   * Parse JWT token from Google
   * @param {string} token - JWT token string
   * @returns {Object} Decoded payload
   */
  parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  }

  /**
   * Extract initials from name
   * @param {string} name - Full name
   * @returns {string} Initials (max 2 characters)
   */
  getInitials(name) {
    if (!name) {return 'U';}
    
    const names = name.split(' ').filter((n) => n.length > 0);
    
    if (names.length === 0) {return 'U';}
    if (names.length === 1) {return names[0].charAt(0).toUpperCase();}
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Render user dropdown menu
   */
  renderUserMenu() {
    if (!this.currentUser) {return;}
    
    const userPill = this.shadowRoot.querySelector('.user-pill');
    if (!userPill || !userPill.classList.contains('expanded')) {return;}
    
    // Create user menu if it doesn't exist yet
    let userMenu = this.shadowRoot.querySelector('.user-dropdown-menu');
    if (!userMenu) {
      userMenu = document.createElement('div');
      userMenu.className = 'user-dropdown-menu';
      userMenu.innerHTML = `
        <div class="user-menu-header">
          <div class="user-menu-name">${this.currentUser.name}</div>
          <div class="user-menu-email">${this.currentUser.email}</div>
        </div>
        <div class="user-menu-divider"></div>
        <div class="user-menu-item" id="profile-link">Profile</div>
        <div class="user-menu-item" id="settings-link">Settings</div>
        <div class="user-menu-item" id="signout-button">Sign Out</div>
      `;
      
      userPill.appendChild(userMenu);
      
      // Add event listeners for menu items
      userMenu.querySelector('#signout-button').addEventListener('click', (e) => {
        e.stopPropagation();
        this.signOut();
      });
      
      userMenu.querySelector('#profile-link').addEventListener('click', (e) => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('navigate', {
          bubbles: true,
          composed: true,
          detail: { path: '/profile' },
        }));
        userPill.classList.remove('expanded');
      });
      
      userMenu.querySelector('#settings-link').addEventListener('click', (e) => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('navigate', {
          bubbles: true,
          composed: true,
          detail: { path: '/settings' },
        }));
        userPill.classList.remove('expanded');
      });
    }
  }

  /**
   * Sign out the current user
   */
  signOut() {
    // Clear stored user data
    localStorage.removeItem('tritonUser');
    this.currentUser = null;
    
    // Update UI
    this.showLoginButton();
    
    // Dispatch event that user has signed out
    this.dispatchEvent(new CustomEvent('user-signed-out', {
      bubbles: true,
      composed: true,
    }));
    
    // If Google sign-in is available, sign out there too
    if (window.google && window.google.accounts && window.google.accounts.id) {
      google.accounts.id.disableAutoSelect();
    }
  }
  
  /**
   * Set the current user data for the auth pill
   * @param {Object} userData - User data object
   * @param {string} userData.name - User's display name
   * @param {string} userData.initials - User's initials (2 characters)
   * @param {string} [userData.avatarUrl] - Optional URL to user's avatar image
   */
  setUser(userData) {
    if (!userData) {
      // Show login button if no user
      this.showLoginButton();
      return;
    }
    
    const userPill = this.shadowRoot.querySelector('#loggedInPill');
    const initialsElement = this.shadowRoot.querySelector('.initials');
    const nameElement = this.shadowRoot.querySelector('.user-name');
    
    if (userPill) {
      userPill.style.display = 'flex';
    }
    
    if (userData.name && nameElement) {
      nameElement.textContent = userData.name;
    }
    
    if (userData.initials && initialsElement) {
      initialsElement.textContent = userData.initials.substring(0, 2).toUpperCase();
    }
    
    if (userData.avatarUrl) {
      // If avatar URL provided, replace initials with image
      const avatarDiv = this.shadowRoot.querySelector('.user-avatar');
      if (avatarDiv) {
        avatarDiv.innerHTML = `<img src="${userData.avatarUrl}" alt="${userData.name} avatar">`;
      }
    }
    
    // Hide login button (if it exists)
    const loginButton = this.shadowRoot.querySelector('#loginButton');
    if (loginButton) {
      loginButton.style.display = 'none';
    }
  }
  
  /**
   * Show login button instead of user pill
   */
  showLoginButton() {
    const userPill = this.shadowRoot.querySelector('#loggedInPill');
    if (userPill) {
      userPill.style.display = 'none';
      
      // Remove any dropdown menu if it exists
      const userMenu = this.shadowRoot.querySelector('.user-dropdown-menu');
      if (userMenu) {
        userMenu.remove();
      }
    }
    
    const authContainer = this.shadowRoot.querySelector('.auth-container');
    if (!authContainer) {return;}

    // Use the standard login button (doesn't show Google branding initially)
    authContainer.innerHTML = `
      <button class="auth-button" id="loginButton">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#04133B">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
        Login
      </button>
    `;
    
    // Initialize Google Sign-In
    if (window.google && window.google.accounts && window.google.accounts.id) {
      google.accounts.id.initialize({
        client_id: '123456789-example.apps.googleusercontent.com', // Replace with your actual client ID
        callback: this.handleGoogleSignIn.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      
      // Add click handler to open Google Sign-In
      const loginButton = this.shadowRoot.querySelector('#loginButton');
      loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Show the Google sign-in popup
        google.accounts.id.prompt();
      });
    } else {
      // Fallback if Google API isn't loaded yet
      const loginButton = this.shadowRoot.querySelector('#loginButton');
      if (loginButton) {
        loginButton.addEventListener('click', () => {
          // Try to initialize Google Auth again
          this.initGoogleAuth();
          
          // Let user know what's happening
          const dialog = document.createElement('div');
          dialog.style.position = 'fixed';
          dialog.style.top = '50%';
          dialog.style.left = '50%';
          dialog.style.transform = 'translate(-50%, -50%)';
          dialog.style.background = 'white';
          dialog.style.padding = '20px';
          dialog.style.borderRadius = '8px';
          dialog.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          dialog.style.zIndex = '9999';
          dialog.innerHTML = `
            <h3 style="margin-top:0;">Connecting to Google</h3>
            <p>Initializing Google Sign-In. This will only take a moment.</p>
            <button style="padding:8px 16px; background:#04133B; color:white; border:none; border-radius:4px; cursor:pointer;">Close</button>
          `;
          document.body.appendChild(dialog);
          
          // Close button functionality
          dialog.querySelector('button').addEventListener('click', () => {
            dialog.remove();
          });
          
          // Auto close after 3 seconds
          setTimeout(() => {
            if (document.body.contains(dialog)) {
              dialog.remove();
            }
          }, 3000);
        });
      }
    }
  }
  
  /**
   * Public method to programmatically toggle the search box
   * @param {boolean} [show=true] - Whether to show or hide the search box
   */
  toggleSearch(show = true) {
    const searchContainer = this.shadowRoot.querySelector('.search-container');
    const searchInput = this.shadowRoot.querySelector('.search-input');
    
    if (searchContainer) {
      if (show) {
        searchContainer.classList.add('active');
        if (searchInput) {searchInput.focus();}
      } else {
        searchContainer.classList.remove('active');
      }
    }
    
    return this;
  }
  
  /**
   * Public method to programmatically set login status
   * @param {Object} userData - User data or null to log out
   */
  setLoginStatus(userData) {
    if (userData) {
      this.currentUser = userData;
      this.setUser(userData);
    } else {
      this.signOut();
    }
    
    return this;
  }
}

// Register the custom element
customElements.define('site-header', SiteHeader);