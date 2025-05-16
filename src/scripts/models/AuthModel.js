import supabase from '../utils/supabase.js';

export class AuthModel {
  constructor() {
    this.session = null;
  }

  /**
   * Initialize the auth model
   */
  async init() {
    // Initial session check
    return this.refreshSession();
  }
  
  /**
   * Refresh the current session state
   * @returns {Promise<Object|null>} The current session or null
   */
  async refreshSession() {
    // Initialize the model 
    const { data: { session } } = await supabase.auth.getSession();
    this.session = session;
    
    // If user is logged in, fetch user data with identities
    if (session?.user?.id) {
      await this.fetchUserWithIdentities();
    }
    
    return session;
  }
  
  /**
   * Fetch user data with identities for avatar
   * @returns {Promise<Object|null>} User data with identities or null
   */
  async fetchUserWithIdentities() {
    if (!this.session?.user?.id) {
      return null;
    }
    
    const { data: user, error } = await supabase.auth.admin.getUserById(
      this.session.user.id,
    );
    
    if (error) {
      console.error('Error fetching user with identities:', error.message);
      return null;
    }
    
    if (user) {
      // Update the session user with the full user data
      this.session.user = user;
    }
    
    return user;
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
        // Request profile data including avatar
        scopes: 'email profile',
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
}