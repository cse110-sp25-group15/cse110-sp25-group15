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
    
    // If user is logged in, fetch additional user data if needed
    if (session?.user?.id) {
      // Instead of using admin API, we'll use the regular user data
      // that's already available in the session
      this.session.user = {
        ...session.user,
        // Add any default values needed for UI that might not be in the session
        avatarUrl: this.getUserAvatarUrl(session.user),
      };
    }
    
    return session;
  }
  
  /**
   * Generate an avatar URL for the user based on available data
   * @param {Object} user - User object
   * @returns {string} URL to user's avatar or default avatar
   */
  getUserAvatarUrl(user) {
    // Check if user has an identities array with avatar_url
    const identities = user?.identities || [];
    const identity = identities[0];
    
    // If the identity has an avatar_url, use it
    if (identity?.identity_data?.avatar_url) {
      return identity.identity_data.avatar_url;
    }
    
    // Check if avatar_url is directly on the user object
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    
    // Use a default avatar with the user's initials
    const name = user?.user_metadata?.full_name || user?.email || 'User';
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
      
    // Return a placeholder avatar URL with initials
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
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
    
    this.session = null;
  }
}