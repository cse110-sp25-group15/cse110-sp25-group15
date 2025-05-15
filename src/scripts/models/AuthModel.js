import supabase from '../utils/supabase.js';

export class AuthModel {
  constructor() {
    this.session = null;
    this.listeners = [];
  }

  /**
   * Initialize the auth model and setup auth state change listeners
   */
  init() {
    // Set up auth state change listener
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      this.session = session;
      this.notifyListeners();
    });
    
    // Initial session check
    this.refreshSession();
  }
  
  /**
   * Refresh the current session state
   * @returns {Promise<Object|null>} The current session or null
   */
  async refreshSession() {
    const { data: { session } } = await supabase.auth.getSession();
    this.session = session;
    this.notifyListeners();
    return session;
  }
  
  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated() {
    return !!this.session;
  }
  
  /**
   * Get current user details
   * @returns {Object|null} User details or null if not authenticated
   */
  getCurrentUser() {
    return this.session?.user || null;
  }
  
  /**
   * Sign in with OAuth provider
   * @param {string} provider - OAuth provider (e.g., 'google')
   * @returns {Promise<Object>} Result of sign in attempt
   */
  async signInWithOAuth(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    
    if (error) {
      console.error(`${provider} login error:`, error.message);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error.message);
      throw error;
    }
    
    await this.refreshSession();
  }
  
  /**
   * Add a listener for auth state changes
   * @param {Function} listener - Callback function when auth state changes
   */
  addListener(listener) {
    if (typeof listener === 'function' && !this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  }
  
  /**
   * Remove a listener
   * @param {Function} listener - Listener to remove
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
  
  /**
   * Notify all listeners of auth state change
   */
  notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.session);
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }
}