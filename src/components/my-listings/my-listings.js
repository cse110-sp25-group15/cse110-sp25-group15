import html from './my-listings.html?raw';
import css from './my-listings.css?raw';
import supabase from '../../scripts/utils/supabase.js';
import '../browse-page/product-card/product-card.js';
import '../edit-listing/edit-listing.js';
import deleteConfirmationCSS from './delete-confirmation.css?raw';

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
    console.log('Listing clicked:', listingId);
  }

  editListing(listingId) {
    try {
      
      const listing = this.listings.find((l) => l.listing_id === listingId);
      if (!listing) {
        console.error('Listing not found');
        return;
      }
      
      let editModal = this.shadowRoot.querySelector('edit-listing-modal');
      if (!editModal) {
        editModal = document.createElement('edit-listing-modal');
        this.shadowRoot.appendChild(editModal);
      }
      const listingWithImages = {
        ...listing,
        allImages: listing.images && Array.isArray(listing.images) ? listing.images : [listing.thumbnail].filter(Boolean),
      };
    
      editModal.show(listingWithImages);
      
      editModal.addEventListener('listing-update', async (e) => {
        const { listingId, updates } = e.detail;
      
        try {
          
          const { error } = await supabase
            .from('listings')
            .update(updates)
            .eq('listing_id', listingId)
            .eq('user_id', this.user.id);

          if (error) {throw error;}
          
          await this.loadUserListings();
        
        } catch (error) {
          console.error('Error updating listing:', error);
          window.notify('Failed to update listing. Please try again.', 'error');
        }
      }, { once: true });

    } catch (error) {
      console.error('Error editing listing:', error);
      window.notify('Failed to load listing for editing. Please try again.', 'error');
    }
  }

  async confirmDelete(listingId) {
  
    const confirmed = await this.showDeleteConfirmation();
  
    if (!confirmed) {
      return;
    }

    try {
   
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('listing_id', listingId)
        .eq('user_id', this.user.id); 

      if (error) {
        throw error;
      }
      
      this.listings = this.listings.filter((l) => l.listing_id !== listingId);
    
      if (this.listings.length === 0) {
        this.showEmptyState();
      } else {
        this.renderListings();
      }
      
      window.notify('Listing deleted successfully', 'success');
      
      this.dispatchEvent(new CustomEvent('listing-deleted', {
        bubbles: true,
        composed: true,
        detail: { listingId },
      }));

    } catch (error) {
      console.error('Error deleting listing:', error);
      window.notify('Failed to delete listing. Please try again.', 'error');
    }
  }
  showDeleteConfirmation() {
    return new Promise((resolve) => {
    // Create elements
      const overlay = document.createElement('div');
      overlay.className = 'delete-confirmation-overlay';
    
      const dialog = document.createElement('div');
      dialog.className = 'delete-confirmation-dialog';
    
      const title = document.createElement('h3');
      title.textContent = 'Delete Listing?';
    
      const message = document.createElement('p');
      message.textContent = 'Are you sure you want to delete this listing? This action cannot be undone.';
    
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'delete-confirmation-buttons';
    
      const cancelBtn = document.createElement('button');
      cancelBtn.id = 'cancel-delete';
      cancelBtn.className = 'btn-cancel';
      cancelBtn.textContent = 'Cancel';
    
      const confirmBtn = document.createElement('button');
      confirmBtn.id = 'confirm-delete';
      confirmBtn.className = 'btn-confirm-delete';
      confirmBtn.textContent = 'Delete';
    
      buttonContainer.appendChild(cancelBtn);
      buttonContainer.appendChild(confirmBtn);
      dialog.appendChild(title);
      dialog.appendChild(message);
      dialog.appendChild(buttonContainer);
      overlay.appendChild(dialog);
    
      const style = document.createElement('style');
      style.textContent = deleteConfirmationCSS;
    
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(overlay);
   
      cancelBtn.onclick = () => {
        overlay.remove();
        style.remove();
        resolve(false);
      };
    
      confirmBtn.onclick = () => {
        overlay.remove();
        style.remove();
        resolve(true);
      };
    
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          overlay.remove();
          style.remove();
          resolve(false);
        }
      };
    });
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