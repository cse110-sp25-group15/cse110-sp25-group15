import { ListingModel } from '../models/ListingsModel.js';

export class ListingController {
  constructor() {
    this.model = new ListingModel();
    this.productsContainer = document.querySelector('.products-container');
    
    // Set up event delegation for card clicks
    if (this.productsContainer) {
      this.productsContainer.addEventListener('card-click', (event) => {
        this.handleCardClick(event.detail.listingId);
      });
    }
  }
  
  /**
   * Initialize the controller
   */
  init() {
    // Listen for listing-submit events from the listing form component
    document.addEventListener('listing-submit', this.handleListingSubmit.bind(this));
    
    // Load listings when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      this.loadListings();
    });
  }
  
  /**
   * Handle the listing-submit event from the listing-form component
   * @param {CustomEvent} event - The custom event containing listing data
   */
  async handleListingSubmit(event) {
    try {
      // Extract listing data from the event
      const listingData = event.detail;
      
      // Use the model to create a new listing
      const { data, error } = await this.model.createListing(listingData);
      
      if (error) {
        this.notifyError(error.message || 'Failed to create listing');
        return;
      }
      
      // Notify success
      this.notifySuccess('Listing created successfully');
      
      // Reset the form if possible
      if (event.target && typeof event.target.resetForm === 'function') {
        event.target.resetForm();
      }
      
      // Reload listings to show the new one
      await this.loadListings();
      
    } catch (error) {
      console.error('Error handling listing submission:', error);
      this.notifyError('An unexpected error occurred');
    }
  }
  
  /**
   * Loads listings from the model and renders them
   */
  async loadListings() {
    try {
      // Clear existing content
      if (!this.productsContainer) {
        console.error('Products container not found');
        return;
      }
      
      this.productsContainer.innerHTML = '';
      
      // Fetch listings from model
      const listings = await this.model.fetchAllListings();
      
      // Render each listing
      listings.forEach((listing) => {
        this.renderListingCard(listing);
      });
      
      console.log('Loaded listings:', listings);
    } catch (err) {
      console.error('Controller failed to load listings:', err);
      // Could display an error message to the user here
    }
  }
  
  /**
   * Creates and renders a product card for a listing
   * @param {Object} listing - The listing data
   */
  renderListingCard(listing) {
    // Format the listing data for the view
    const formattedListing = this.model.formatListingForView(listing);
    
    // Create product-card element
    const card = document.createElement('product-card');
    
    // Set attributes individually instead of using the listing property
    card.setAttribute('listing-id', formattedListing.listing_id || '');
    card.setAttribute('title', formattedListing.title || '');
    card.setAttribute('price', formattedListing.price || '');
    card.setAttribute('image-url', formattedListing.image_url || '');
    
    // Add class for flexbox layout
    card.classList.add('card');
    
    // Append to container
    this.productsContainer.appendChild(card);
  }
  
  /**
   * Handles a click on a product card
   * @param {string|number} listingId - The ID of the clicked listing
   */
  handleCardClick(listingId) {
    // Navigate to product detail page or show modal, etc.
    console.log(`Card clicked for listing: ${listingId}`);
    window.location.href = `/product.html?id=${listingId}`;
  }
  
  /**
   * Display an error notification
   * @param {string} message - The error message to display
   */
  notifyError(message) {
    alert(message); // Simple alert for now, could be replaced with a proper notification system
  }
  
  /**
   * Display a success notification
   * @param {string} message - The success message to display
   */
  notifySuccess(message) {
    alert(message); // Simple alert for now, could be replaced with a proper notification system
  }
}