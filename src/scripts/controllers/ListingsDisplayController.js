import { ListingModel } from '../models/ListingsModel.js';

export class ListingDisplayController {
  constructor() {
    this.model = new ListingModel();
    this.browsePage = document.querySelector('browse-page');
    this.productsContainer = null;
  }

  init() {
    // Only proceed if browsePage exists
    if (!this.browsePage || !this.browsePage.shadowRoot) {
      console.error('Browse page or shadow root not found');
      return;
    }

    this.productsContainer = this.browsePage.shadowRoot.querySelector('.products-container');
    if (!this.productsContainer) {
      console.error('Products container not found');
      return;
    }

    this.loadListings();

    document.addEventListener('card-click', (event) => {
      console.log('Card clicked event received');
      console.log(event.detail);
      // const listingId = event.detail.listingId;
      // this.handleCardClick(listingId);
    });
  }

  async loadListings() {
    try {
      // Check again if productsContainer exists before attempting to use it
      if (!this.productsContainer) {
        console.error('Products container not found');
        return;
      }

      this.productsContainer.innerHTML = '';
      const listings = await this.model.fetchAllListings();

      // Only proceed if productsContainer is still valid
      if (!this.productsContainer) {
        console.error('Products container no longer available');
        return;
      }

      listings.forEach((listing) => {
        this.renderListingCard(listing);
      });

      console.log('Loaded listings:', listings);
    } catch (err) {
      console.error('Controller failed to load listings:', err);
    }
  }

  renderListingCard(listing) {
    // Check if productsContainer exists before attempting to append to it
    if (!this.productsContainer) {
      console.error('Cannot render card, products container not available');
      return;
    }
    
    const formattedListing = this.model.formatListingForView(listing);
    const card = document.createElement('product-card');

    card.setAttribute('listing-id', formattedListing.listing_id || '');
    card.setAttribute('title', formattedListing.title || '');
    card.setAttribute('price', formattedListing.price || '');
    card.setAttribute('image-url', formattedListing.image_url || '');
    card.classList.add('card');

    this.productsContainer.appendChild(card);
  }

  handleCardClick(listingId) {
    console.log(`Card clicked for listing: ${listingId}`);
    window.location.href = `/product.html?id=${listingId}`;
  }

  notifyError(message) {
    alert(message);
  }

  notifySuccess(message) {
    alert(message);
  }
}