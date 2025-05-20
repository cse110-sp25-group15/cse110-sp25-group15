import { ListingDisplayController } from './controllers/ListingsDisplayController.js';
import { ListingSubmissionController } from './controllers/ListingsSubmissionController.js';
import supabase from './utils/supabase.js';
// Initialize the controller

document.addEventListener('DOMContentLoaded', async () => {
  const listingDisplayController = new ListingDisplayController();
  listingDisplayController.init();
  
  const listingSubmissionController = new ListingSubmissionController();
  listingSubmissionController.init();

});

