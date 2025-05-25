import { ListingDisplayController } from './controllers/ListingsDisplayController.js';
import { ListingSubmissionController } from './controllers/ListingsSubmissionController.js';
import supabase from './utils/supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  const listingDisplayController = new ListingDisplayController();
  listingDisplayController.init();
  
  const listingSubmissionController = new ListingSubmissionController();
  listingSubmissionController.init();

  // Logo click handler
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.href = '/';
    });
  }
  
  // Get the hero banner element
  const heroBanner = document.querySelector('hero-banner');
  
  // Handle browse link click to scroll to marketplace section
  const browseLink = document.getElementById('browse-link');
  if (browseLink) {
    browseLink.addEventListener('click', (e) => {
      e.preventDefault();
      const marketplaceSection = document.getElementById('marketplace');
      if (marketplaceSection) {
        marketplaceSection.scrollIntoView({ behavior: 'instant' });
        
        // Remove hero banner immediately when browse is clicked
        if (heroBanner) {
          heroBanner.remove();
        }
      }
    });
  }
  
  // Function to check if hero banner is scrolled out of view
  const checkHeroBannerVisibility = () => {
    if (!heroBanner) {return;}
    
    const heroBannerRect = heroBanner.getBoundingClientRect();
    // If hero banner is scrolled completely out of view
    if (heroBannerRect.bottom <= 0) {
      // Remove the hero banner from the DOM
      heroBanner.remove();
    }
  };
  
  // Add scroll event listener to check hero banner visibility
  window.addEventListener('scroll', checkHeroBannerVisibility);

  // Connect search box to search functionality
  const searchBox = document.querySelector('search-box');
  if (searchBox) {
    searchBox.addEventListener('search-submit', async (e) => {
      const query = e.detail.query;
      if (query) {
        await listingDisplayController.renderSearchResults(query);
      }
    });
  }
},
);