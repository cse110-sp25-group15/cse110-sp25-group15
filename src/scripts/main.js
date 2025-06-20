import { ListingDisplayController } from './controllers/ListingsDisplayController.js';
import { ListingSubmissionController } from './controllers/ListingsSubmissionController.js';
import { ConfettiController } from './controllers/ConfettiController.js';
import supabase from './utils/supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  const listingDisplayController = new ListingDisplayController();
  listingDisplayController.init();
  
  const listingSubmissionController = new ListingSubmissionController();
  listingSubmissionController.init();

  const confettiController = new ConfettiController();
  confettiController.init();

  // Logo click handler
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.href = '/cse110-sp25-group15/';
    });
  }
  
  // Get the hero banner element
  const heroBanner = document.querySelector('hero-banner');
  
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
},
);