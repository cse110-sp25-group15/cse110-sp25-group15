import supabase from './utils/supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Redirect to home if not authenticated
    window.location.href = '/cse110-sp25-group15/';
    return;
  }

  // Logo click handler
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.href = '/cse110-sp25-group15/';
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
        window.location.href = `/cse110-sp25-group15/?search=${encodeURIComponent(query)}`;
      }
    });
  }

  // Register service worker for image caching
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/cse110-sp25-group15/service-worker.js')
        .then(function(reg) {
          console.log('Service Worker registered:', reg.scope);
        })
        .catch(function(err) {
          console.warn('Service Worker registration failed:', err);
        });
    });
  }
});