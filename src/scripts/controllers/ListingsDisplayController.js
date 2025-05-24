import { ListingModel } from '../models/ListingsModel.js';

export class ListingDisplayController {
  constructor() {
    this.model = new ListingModel();
    this.browsePage = document.querySelector('browse-page');
    this.productsContainer = null;
    this.overlay = document.getElementById('product-detail-overlay');
    this.categoryButtons = [];
    this.currentCategory = null;
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

    // Find and store all category buttons from within the browse-page shadow DOM
    if (this.browsePage && this.browsePage.shadowRoot) {
      this.categoryButtons = Array.from(this.browsePage.shadowRoot.querySelectorAll('category-button'));
      console.log('Found category buttons:', this.categoryButtons.length);
      
      // Set default category if available
      if (this.categoryButtons.length > 0) {
        // Optionally set the first category as selected by default
        // this.setSelectedCategory(this.categoryButtons[0].getAttribute('category'));
      }
    } else {
      console.error('Cannot find category buttons: browse-page or its shadow root is missing');
    }

    this.loadListings();

    document.addEventListener('card-click', (event) => {
      console.log('Card clicked event received');
      console.log(event.detail);
      const listingId = event.detail.listingId;
      this.showProductDetail(listingId);
    });

    document.addEventListener('filter-changed', (event) => {
      console.log('Filter changed event received:', event.detail);
      const selectedCategory = event.detail.category;
      this.setSelectedCategory(selectedCategory);
    });
  }

  setSelectedCategory(category) {
  // Update current category
    this.currentCategory = category;
  
    // Update button states
    this.categoryButtons.forEach((button) => {
      const slotElement = button.shadowRoot.querySelector('slot');
      const buttonCategory = slotElement.assignedNodes().map((node) => node.textContent).join('').trim();
    
      if (buttonCategory === category) {
        button.setAttribute('selected', '');
      } else {
        button.removeAttribute('selected');
      }
    });
  
    console.log('Category selected:', category);
    this.filterListingsByCategory(category);
  }

  /**
 * Filter listings based on selected category
 * @param {string} category - The category to filter by
 */
  async filterListingsByCategory(category) {
    try {
      if (!this.productsContainer) {
        console.error('Products container not found');
        return;
      }

      this.productsContainer.innerHTML = '';
      const allListings = await this.model.fetchAllListings();
    
      const filteredListings = category === 'All' 
        ? allListings
        : allListings.filter((listing) => listing.category === category);
    
      filteredListings.forEach((listing) => {
        this.renderListingCard(listing);
      });
    
      console.log(`Filtered listings by "${category}" category:`, filteredListings.length);
    } catch (err) {
      console.error('Failed to filter listings:', err);
    }
  }

  async loadListings() {
    try {
      if (!this.productsContainer) {
        console.error('Products container not found');
        return;
      }

      this.productsContainer.innerHTML = '';
      const listings = await this.model.fetchAllListings();

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
    card.setAttribute('date', formattedListing.date_posted || '');
    card.classList.add('card');

    this.productsContainer.appendChild(card);
  }

  async showProductDetail(listingId) {
    console.log('Showing product detail for listing ID:', listingId);
    try {
      const listing = await this.model.getListingById(listingId);
      if (!listing) {
        console.error(`Listing with ID ${listingId} not found`);
        return;
      }
  
      if (!this.overlay) {
        console.error('Product overlay component not found');
        return;
      }

      this.overlay.setAttribute('name', listing.title || '');
      this.overlay.setAttribute('price', listing.price || '');
      this.overlay.setAttribute('condition', listing.condition || '');
      this.overlay.setAttribute('date', listing.date_posted || '');
      this.overlay.setAttribute('description', listing.description || '');
      this.overlay.setAttribute('images', listing.thumbnail || '');
      this.overlay.show();
  
    } catch (error) {
      console.error('Error showing product detail:', error);
    }
  }

  notifyError(message) {
    alert(message);
  }

  notifySuccess(message) {
    alert(message);
  }
}