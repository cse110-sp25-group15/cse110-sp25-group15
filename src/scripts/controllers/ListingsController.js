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
    document.addEventListener('DOMContentLoaded', () => {
      this.loadListings();
    });
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

      // Fetch listings from model, sorted by date_posted 
      const sortedlistings = await this.model.fetchAllListingsSortByDate(true);
      console.log('Listings sorted by date: ', sortedlistings);

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
}