import { ListingModel } from '../models/ListingsModel.js';

export class ListingDisplayController {
  constructor() {
    this.model = new ListingModel();
    this.browsePage = document.querySelector('browse-page');
    this.productsContainer = null;
    this.overlay = document.getElementById('product-detail-overlay');
    this.categoryButtons = [];
    this.currentCategory = 'All';
    this.currentSort = null;
    this.defaultListings = null;
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
    } else {
      console.error('Cannot find category buttons: browse-page or its shadow root is missing');
    }

    // Initial load
    this.fetchListings();

    // Event listeners
    document.addEventListener('card-click', (event) => {
      console.log('Card clicked event received');
      const listingId = event.detail.listingId;
      this.showProductDetail(listingId);
    });

    document.addEventListener('filter-changed', (event) => {
      console.log('Filter changed event received:', event.detail);
      this.currentCategory = event.detail.category;
      this.updateCategoryButtons(this.currentCategory);
      this.fetchListings(this.currentCategory, this.currentSort);
    });

    document.addEventListener('sort-change', (event) => {
      console.log('Sort change event received:', event.detail);
      this.currentSort = event.detail.sortBy;
      this.fetchListings(this.currentCategory, this.currentSort);
      // If reset to "featured" (default)
      if (this.currentSort === 'featured' && this.defaultListings) {
        this.productsContainer.innerHTML = '';
        this.defaultListings.forEach((listing) => this.renderListingCard(listing));
        console.log(`Reset to default "Featured" listings (${this.defaultListings.length})`);
      } else {
        this.fetchListings(this.currentCategory, this.currentSort);
      }
    });
  }

  /**
   * Main method to fetch and render listings based on category and sort parameters
   * @param {string} category - Category to filter by ('All' for no filter)
   * @param {string} sortBy - Sort criteria ('new', 'low', 'high')
   */
  async fetchListings(category = 'All', sortBy = null) {
    try {
      if (!this.productsContainer) {
        console.error('Products container not found');
        return;
      }

      this.productsContainer.innerHTML = '';
      let listings = [];

      // Determine which model method to use based on parameters
      if (sortBy === 'new') {
        listings = await this.model.fetchAllListingsSortByDate(false); // newest first
      } else if (sortBy === 'low') {
        listings = await this.model.fetchAllListingsSortByPrice(true); // lowest first
      } else if (sortBy === 'high') {
        listings = await this.model.fetchAllListingsSortByPrice(false); // highest first
      } else if (category !== 'All') {
        listings = await this.model.fetchListingsByCategory(category);
      } else {
        listings = await this.model.fetchAllListings();

        if (!this.defaultListings) {
          this.defaultListings = [...listings];
        }
      }

      // Apply category filter if sorting is applied but category is not 'All'
      if (sortBy && category !== 'All') {
        listings = listings.filter((listing) => listing.category === category);
      }

      // Render all listings
      listings.forEach((listing) => {
        this.renderListingCard(listing);
      });

      console.log(`Loaded ${listings.length} listings (category: ${category}, sort: ${sortBy})`);
    } catch (err) {
      console.error('Controller failed to fetch listings:', err);
      this.productsContainer.innerHTML = '<div class="no-results">Error loading listings.</div>';
    }
  }

  /**
   * Renders a single listing card
   * @param {Object} listing - Listing data object
   */
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

  /**
   * Updates category button states
   * @param {string} selectedCategory - The selected category
   */
  updateCategoryButtons(selectedCategory) {
    this.categoryButtons.forEach((button) => {
      const slotElement = button.shadowRoot.querySelector('slot');
      const buttonCategory = slotElement.assignedNodes().map((node) => node.textContent).join('').trim();
    
      if (buttonCategory === selectedCategory) {
        button.setAttribute('selected', '');
      } else {
        button.removeAttribute('selected');
      }
    });
    console.log('Category selected:', selectedCategory);
  }

  /**
   * Shows product detail overlay
   * @param {string} listingId - ID of the listing to show
   */
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

  /**
   * Renders search results
   * @param {string} query - Search query string
   */
  async renderSearchResults(query) {
    if (!this.productsContainer) {
      console.error('Products container not found');
      return;
    }
    
    this.productsContainer.innerHTML = '';
    
    try {
      const results = await this.model.searchListings(query);
      
      if (!results || results.length === 0) {
        this.productsContainer.innerHTML = '<div class="no-results">No results found.</div>';
        return;
      }
      
      results.forEach((listing) => {
        this.renderListingCard(listing);
      });
      
      console.log(`Rendered ${results.length} search results for query: "${query}"`);
    } catch (err) {
      this.productsContainer.innerHTML = '<div class="no-results">Error searching listings.</div>';
      console.error('Error rendering search results:', err);
    }
  }

  notifyError(message) {
    alert(message);
  }

  notifySuccess(message) {
    alert(message);
  }
}