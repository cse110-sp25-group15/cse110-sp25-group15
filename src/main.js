import { createClient } from '@supabase/supabase-js';
import './components/product-card/product-card.js';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'https://natqpieuqtsggabuudrw.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHFwaWV1cXRzZ2dhYnV1ZHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwOTkwODgsImV4cCI6MjA2MjY3NTA4OH0.lydSkDtjN0PITWWpU-LUPAmxp9ZrgK1cDDWkTIcpSMA',
);

// Get reference to the products container
const productsContainer = document.querySelector('.products-container');

// Load listings from Supabase
async function loadListings() {
  // Clear any existing cards (the placeholder ones from HTML)
  productsContainer.innerHTML = '';
  
  try {
    // Fetch listings - no need to query images separately
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select();
    
    if (listingsError) {
      console.error('Error fetching listings:', listingsError);
      return;
    }
    
    // For each listing, create a card component
    listings.forEach((listing) => {
      // Create product-card element
      const card = document.createElement('product-card');
      
      // Set data via the listing property
      card.listing = {
        listing_id: listing.listing_id,
        title: listing.title,
        price: listing.price,
        // Use the thumbnail URL directly from the listing
        image_url: listing.thumbnail || 'https://via.placeholder.com/300x400',
      };
      
      // Add class for flexbox layout
      card.classList.add('card');
      
      // Append to container
      productsContainer.appendChild(card);
    });
    
    console.log('Loaded listings:', listings);
  } catch (err) {
    console.error('Failed to load listings:', err);    
  }
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', loadListings);

// Fix: Make handleSignInWithGoogle available globally for the Google Sign-In callback
window.handleSignInWithGoogle = async function(response) {
  try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    });
    
    if (error) {
      console.error('Google Sign-In error:', error);
    } else {
      console.log('Successfully signed in with Google:', data);
      // Handle successful sign-in (e.g., refresh UI, redirect)
    }
  } catch (err) {
    console.error('Failed to process Google Sign-In:', err);
  }
};

export default supabase;