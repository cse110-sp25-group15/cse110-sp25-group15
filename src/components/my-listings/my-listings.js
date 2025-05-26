import html from './my-listings.html?raw';
import css from './my-listings.css?raw';
import supabase from '../../scripts/utils/supabase.js';
import '../browse-page/product-card/product-card.js';

class MyListings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.listings = [];
    this.user = null;
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.setupElements();
    this.loadUserListings();
    this.setupEventListeners();
  }

  setupElements() {
    this.listingsGrid = this.shadowRoot.querySelector('.listings-grid');
    this.loadingState = this.shadowRoot.querySelector('.loading-state');
    this.emptyState = this.shadowRoot.querySelector('.empty-state');
    this.errorState = this.shadowRoot.querySelector('.error-state');
  }

  setupEventListeners() {
    // Listen for card clicks to edit/view
    this.shadowRoot.addEventListener('card-click', (e) => {
      const listingId = e.detail.listingId;
      this.handleListingClick(listingId);
    });

    // Listen for create listing button
    const createBtns = this.shadowRoot.querySelectorAll('.create-listing-btn');
    createBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        window.location.href = '/cse110-sp25-group15/list';
      });
    });
  }

  async loadUserListings() {
    try {
      this.showLoading();

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (!user || authError) {
        this.showError('Please sign in to view your listings');
        return;
      }

      this.user = user;

      // Fetch user's listings
      const { data: listings, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('date_posted', { ascending: false });

      if (error) {
        console.error('Error fetching listings:', error);
        this.showError('Failed to load your listings');
        return;
      }

      this.listings = listings || [];
      
      if (this.listings.length === 0) {
        this.showEmptyState();
      } else {
        this.renderListings();
      }

    } catch (error) {
      console.error('Error loading listings:', error);
      this.showError('An unexpected error occurred');
    }
  }

  renderListings() {
    this.hideAllStates();
    this.listingsGrid.style.display = 'grid';
    this.listingsGrid.innerHTML = '';

    this.listings.forEach((listing) => {
      const card = this.createListingCard(listing);
      this.listingsGrid.appendChild(card);
    });
  }

  createListingCard(listing) {
    const wrapper = document.createElement('div');
    wrapper.className = 'listing-card-wrapper';

    // Create the product card
    const card = document.createElement('product-card');
    card.setAttribute('listing-id', listing.listing_id || '');
    card.setAttribute('title', listing.title || '');
    card.setAttribute('price', listing.price || '');
    card.setAttribute('image-url', listing.thumbnail || '');
    card.setAttribute('date', listing.date_posted || '');

    // Create action buttons overlay
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      Edit
    `;
    editBtn.onclick = (e) => {
      e.stopPropagation();
      this.editListing(listing.listing_id);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
      Delete
    `;
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      this.confirmDelete(listing.listing_id);
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    wrapper.appendChild(card);
    wrapper.appendChild(actions);

    return wrapper;
  }

  handleListingClick(listingId) {
    // For now, just show an alert
    // In a real app, this might open a detail view or edit modal
    console.log('Listing clicked:', listingId);
  }

  editListing(listingId) {
    // In a real app, this would navigate to an edit page or open a modal
    console.log('Edit listing:', listingId);
    alert('Edit functionality coming soon!');
  }

  async confirmDelete(listingId) {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      // Delete the listing
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('listing_id', listingId)
        .eq('user_id', this.user.id); // Extra safety check

      if (error) {
        throw error;
      }

      // Remove from local array and re-render
      this.listings = this.listings.filter((l) => l.listing_id !== listingId);
      
      if (this.listings.length === 0) {
        this.showEmptyState();
      } else {
        this.renderListings();
      }

      // Dispatch event to update profile stats
      this.dispatchEvent(new CustomEvent('listing-deleted', {
        bubbles: true,
        composed: true,
        detail: { listingId },
      }));

    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing. Please try again.');
    }
  }

  showLoading() {
    this.hideAllStates();
    this.loadingState.style.display = 'flex';
  }

  showEmptyState() {
    this.hideAllStates();
    this.emptyState.style.display = 'flex';
  }

  showError(message) {
    this.hideAllStates();
    this.errorState.style.display = 'flex';
    const errorMessage = this.shadowRoot.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.textContent = message;
    }
  }

  hideAllStates() {
    this.loadingState.style.display = 'none';
    this.emptyState.style.display = 'none';
    this.errorState.style.display = 'none';
    this.listingsGrid.style.display = 'none';
  }
}

customElements.define('my-listings', MyListings);
export default MyListings;