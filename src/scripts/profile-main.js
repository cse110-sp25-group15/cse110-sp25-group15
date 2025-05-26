import supabase from './utils/supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Redirect to home if not authenticated
    window.location.href = '/';
    return;
  }

  // Logo click handler
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.href = '/';
    });
  }

  // Listen for listing deletion to update profile stats
  document.addEventListener('listing-deleted', () => {
    // Refresh the profile info component
    const profileInfo = document.querySelector('profile-info');
    if (profileInfo && typeof profileInfo.loadUserProfile === 'function') {
      profileInfo.loadUserProfile();
    }
  });

  // Connect search box to search functionality
  const searchBox = document.querySelector('search-box');
  if (searchBox) {
    searchBox.addEventListener('search-submit', async (e) => {
      const query = e.detail.query;
      if (query) {
        // Redirect to home page with search query
        window.location.href = `/?search=${encodeURIComponent(query)}`;
      }
    });
  }
});