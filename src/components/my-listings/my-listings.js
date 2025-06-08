import html from './my-listings.html?raw';
import css from './my-listings.css?raw';
import supabase from '../../scripts/utils/supabase.js';

import '../browse-page/product-card/product-card.js';
import '../edit-listing/edit-listing.js';
import './delete-confirmation/delete-confirmation.js';

class MyListings extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Template clone (per guide: constructor → shadow DOM only)
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Component state
    this.listings = [];
    this.user = null;
    this.currentDeleteId = null;

    // Pre-bind handlers once
    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleCreateListing = this._handleCreateListing.bind(this);
    this._handleDeleteResult = this._handleDeleteResult.bind(this);
    this._handleListingUpdate = this._handleListingUpdate.bind(this);
  }

  connectedCallback() {
    // DOM refs
    this.listingsGrid = this.shadowRoot.querySelector('.listings-grid');
    this.loadingState = this.shadowRoot.querySelector('.loading-state');
    this.emptyState = this.shadowRoot.querySelector('.empty-state');
    this.errorState = this.shadowRoot.querySelector('.error-state');
    this.deleteModal = this.shadowRoot.querySelector('delete-confirmation');
    this.editModal = this.shadowRoot.querySelector('edit-listing-modal');

    // Delegated listeners
    this.shadowRoot.addEventListener('card-click', this._handleCardClick);
    this.shadowRoot.addEventListener('delete-result', this._handleDeleteResult);
    this.shadowRoot.addEventListener('listing-update', this._handleListingUpdate);

    // Create-listing buttons (two instances)
    this.shadowRoot
      .querySelectorAll('.create-listing-btn')
      .forEach((btn) => btn.addEventListener('click', this._handleCreateListing));

    // Initial data fetch
    this._loadUserListings();
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('card-click', this._handleCardClick);
    this.shadowRoot.removeEventListener('delete-result', this._handleDeleteResult);
    this.shadowRoot.removeEventListener('listing-update', this._handleListingUpdate);

    this.shadowRoot
      .querySelectorAll('.create-listing-btn')
      .forEach((btn) => btn.removeEventListener('click', this._handleCreateListing));
  }

  async _loadUserListings() {
    try {
      this._showLoading();

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user || authError) {
        this._showError('Please sign in to view your listings');
        return;
      }
      this.user = user;

      const { data: listings, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('date_posted', { ascending: false });

      if (error) {
        this._showError('Failed to load your listings');
        return;
      }

      this.listings = listings || [];
      this.listings.length ? this._renderListings() : this._showEmptyState();
    } catch {
      this._showError('An unexpected error occurred');
    }
  }

  _renderListings() {
    this._hideAllStates();
    this.listingsGrid.innerHTML = '';
    this.listingsGrid.style.display = 'grid';

    this.listings.forEach((listing) => {
      this.listingsGrid.appendChild(this._createListingCard(listing));
    });
  }

  _createListingCard(listing) {
    const wrapper = document.createElement('div');
    wrapper.className = 'listing-card-wrapper';

    /* product-card */
    const card = document.createElement('product-card');
    card.setAttribute('listing-id', listing.listing_id);
    card.setAttribute('title', listing.title);
    card.setAttribute('price', listing.price);
    card.setAttribute('image-url', listing.thumbnail);
    card.setAttribute('date', listing.date_posted);
    wrapper.appendChild(card);

    /* Actions (Edit / Delete) */
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    actions.append(
      this._createActionButton('edit', listing.listing_id),
      this._createActionButton('delete', listing.listing_id),
    );
    wrapper.appendChild(actions);

    return wrapper;
  }

  _createActionButton(type, listingId) {
    const button = document.createElement('button');
    const iconEdit =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
    const iconDelete =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2v2"></path></svg>';

    if (type === 'edit') {
      button.className = 'edit-btn';
      button.innerHTML = `${iconEdit} Edit`;
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        this._editListing(listingId);
      });
    } else {
      button.className = 'delete-btn';
      button.innerHTML = `${iconDelete} Delete`;
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.currentDeleteId = listingId;
        this.deleteModal.show();
      });
    }

    return button;
  }

  _handleCardClick(e) {
    // Placeholder for future navigation
    console.debug('Listing clicked:', e.detail.listingId);
  }

  _handleCreateListing() {
    window.location.href = '/cse110-sp25-group15/list';
  }

  async _handleDeleteResult(e) {
    if (!e.detail.confirmed || !this.currentDeleteId) {return;}

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('listing_id', this.currentDeleteId)
        .eq('user_id', this.user.id);

      if (error) {throw error;}

      this.listings = this.listings.filter((l) => l.listing_id !== this.currentDeleteId);
      this.listings.length ? this._renderListings() : this._showEmptyState();

      window.notify('Listing deleted successfully', 'success');
      this.dispatchEvent(new CustomEvent('listing-deleted', {
        bubbles: true,
        composed: true,
        detail: { listingId: this.currentDeleteId },
      }));
    } catch {
      window.notify('Failed to delete listing. Please try again.', 'error');
    } finally {
      this.currentDeleteId = null;
    }
  }

  _editListing(listingId) {
    const listing = this.listings.find((l) => l.listing_id === listingId);
    if (!listing) {return;}

    const listingWithImages = {
      ...listing,
      allImages: Array.isArray(listing.images) ? listing.images : [listing.thumbnail].filter(Boolean),
    };

    this.editModal.show(listingWithImages);
  }

  async _handleListingUpdate(e) {
    const { listingId, updates } = e.detail;
    try {
      const { error } = await supabase
        .from('listings')
        .update(updates)
        .eq('listing_id', listingId)
        .eq('user_id', this.user.id);

      if (error) {throw error;}

      await this._loadUserListings();
    } catch {
      window.notify('Failed to update listing. Please try again.', 'error');
    }
  }
 
  _showLoading() {
    this._hideAllStates();
    this.loadingState.style.display = 'flex';
  }

  _showEmptyState() {
    this._hideAllStates();
    this.emptyState.style.display = 'flex';
  }

  _showError(message) {
    this._hideAllStates();
    this.errorState.style.display = 'flex';
    this.shadowRoot.querySelector('.error-message').textContent = message;
  }

  _hideAllStates() {
    this.loadingState.style.display = 'none';
    this.emptyState.style.display = 'none';
    this.errorState.style.display = 'none';
    this.listingsGrid.style.display = 'none';
  }
}

customElements.define('my-listings', MyListings);
export default MyListings;