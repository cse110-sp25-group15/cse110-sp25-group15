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

    // Listen for the close-overlay event from our component
    document.addEventListener('close-overlay', () => {
      this.closeProductDetail();
    });

    // Listen for filter-changed event from category-button
    // Since the events bubble and are composed, we can listen at the document level
    document.addEventListener('filter-changed', (event) => {
      console.log('Filter changed event received:', event.detail);
      const selectedCategory = event.detail.category;
      this.setSelectedCategory(selectedCategory);
    });
  }
  /**
 * Sets the selected category and updates all category buttons
 * @param {string} category - The category name to select
 */
  setSelectedCategory(category) {
  // Update current category
    this.currentCategory = category;
  
    // Update button states
    this.categoryButtons.forEach((button) => {
    // Get the text content from the button's slot
      const slotElement = button.shadowRoot.querySelector('slot');
      const buttonCategory = slotElement.assignedNodes().map((node) => node.textContent).join('').trim();
    
      if (buttonCategory === category) {
        button.setAttribute('selected', '');
      } else {
        button.removeAttribute('selected');
      }
    });
  
    // Log the category change
    console.log('Category selected:', category);
  
    // Filter listings based on selected category
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

      // Clear current listings
      this.productsContainer.innerHTML = '';
    
      // Fetch all listings
      const allListings = await this.model.fetchAllListings();
    
      // Filter listings if a category is selected and is not "All"
      const filteredListings = category === 'All' 
        ? allListings
        : allListings.filter((listing) => listing.category === category);
    
      // Render filtered listings
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

  async showProductDetail(listingId) {
    try {
      // Fetch the listing details
      const listing = await this.model.getListingById(listingId);
      if (!listing) {
        console.error(`Listing with ID ${listingId} not found`);
        return;
      }

      // Check if overlay exists
      if (!this.overlay) {
        console.error('Product overlay component not found');
        return;
      }

      // Create product detail element
      const productDetail = document.createElement('product-detail');
      productDetail.setAttribute('name', listing.title || '');
      productDetail.setAttribute('price', listing.price || '');
      productDetail.setAttribute('condition', listing.condition || '');
      productDetail.setAttribute('date', listing.date_posted || '');
      productDetail.setAttribute('description', listing.description || '');
      productDetail.setAttribute('images', listing.thumbnail || '');
      
      // Clear previous content and add new product detail
      this.overlay.innerHTML = '';
      this.overlay.appendChild(productDetail);
      
      // Show the overlay
      this.overlay.show();

    } catch (error) {
      console.error('Error showing product detail:', error);
    }
  }

  closeProductDetail() {
    if (this.overlay) {
      this.overlay.hide();
    }
  }

  notifyError(message) {
    alert(message);
  }

  notifySuccess(message) {
    alert(message);
  }
}