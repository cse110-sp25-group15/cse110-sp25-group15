// src/components/edit-listing/edit-listing.js
import html from './edit-listing.html?raw';
import css from './edit-listing.css?raw';
import supabase from '../../scripts/utils/supabase.js';

class EditListingModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.currentListing = null;
    this.newImageFile = null;
    this._isVisible = false;
  }

  connectedCallback() {
    this.setupElements();
    this.setupEventListeners();
  }

  setupElements() {
    this.overlay = this.shadowRoot.querySelector('.overlay');
    this.form = this.shadowRoot.querySelector('.edit-form');
    this.titleInput = this.shadowRoot.querySelector('#edit-title');
    this.priceInput = this.shadowRoot.querySelector('#edit-price');
    this.conditionSelect = this.shadowRoot.querySelector('#edit-condition');
    this.categorySelect = this.shadowRoot.querySelector('#edit-category');
    this.descriptionTextarea = this.shadowRoot.querySelector('#edit-description');
    this.currentThumbnail = this.shadowRoot.querySelector('.current-thumbnail');
    this.mediaInput = this.shadowRoot.querySelector('#media-update');
    this.previewContainer = this.shadowRoot.querySelector('.preview-new-media');
    this.wordCounter = this.shadowRoot.querySelector('.word-count');
    this.loadingOverlay = this.shadowRoot.querySelector('.loading-overlay');
  }

  setupEventListeners() {
    // Close button
    this.shadowRoot.querySelector('.close-btn')?.addEventListener('click', () => {
      this.hide();
    });

    // Cancel button
    this.shadowRoot.querySelector('.btn-cancel')?.addEventListener('click', () => {
      this.hide();
    });

    // Form submission
    this.form?.addEventListener('submit', this.handleSubmit.bind(this));

    // Media change
    this.mediaInput?.addEventListener('change', this.handleMediaChange.bind(this));

    // Word count for description
    this.descriptionTextarea?.addEventListener('input', this.updateWordCount.bind(this));

    // Price formatting
    this.priceInput?.addEventListener('input', this.formatPrice.bind(this));

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._isVisible) {
        this.hide();
      }
    });

    // Click outside to close
    this.overlay?.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });
  }

  show(listingData) {
    if (!listingData) {
      console.error('No listing data provided');
      return;
    }

    this.currentListing = listingData;
    this.populateForm(listingData);
    this.overlay.classList.add('visible');
    this._isVisible = true;
    this.lockBodyScroll();
  }

  hide() {
    this.overlay.classList.remove('visible');
    this._isVisible = false;
    this.unlockBodyScroll();
    this.resetForm();
  }

  lockBodyScroll() {
    document.body.style.overflow = 'hidden';
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  unlockBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  populateForm(listing) {
    
    this.titleInput.value = listing.title || '';
    this.priceInput.value = listing.price || '';
    this.conditionSelect.value = listing.condition || '';
    this.categorySelect.value = listing.category || '';
    this.descriptionTextarea.value = listing.description || '';
   
    if (listing.thumbnail) {
      this.currentThumbnail.src = listing.thumbnail;
    } else {
      this.currentThumbnail.src = 'https://via.placeholder.com/300x300?text=No+Image';
    }
   
    this.updateWordCount();
  }

  handleMediaChange(e) {
    const file = e.target.files[0];
    if (!file) {return;}

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please select a valid image or video file');
      return;
    }

    this.newImageFile = file;
   
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewContainer.innerHTML = `
        <img src="${e.target.result}" alt="New image preview">
      `;
    };
    reader.readAsDataURL(file);
  }

  updateWordCount() {
    const words = this.descriptionTextarea.value.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    this.wordCounter.textContent = `${wordCount}/250`;
    
    if (wordCount > 250) {
      this.wordCounter.classList.add('exceeded');
    } else {
      this.wordCounter.classList.remove('exceeded');
    }
  }

  formatPrice(e) {
    let value = e.target.value.replace(/[^\d.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    e.target.value = value;
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const formData = this.gatherFormData();
    const errors = this.validateForm(formData);
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }
    
    this.showLoading();

    try {
     
      const updateData = {
        title: formData.title,
        price: parseFloat(formData.price),
        condition: formData.condition,
        category: formData.category,
        description: formData.description,
      };
      
      if (this.newImageFile) {
       
        updateData.newImage = this.newImageFile;
      }
     
      this.dispatchEvent(new CustomEvent('listing-update', {
        bubbles: true,
        composed: true,
        detail: {
          listingId: this.currentListing.listing_id,
          updates: updateData,
        },
      }));

      // Success - hide modal
      this.hideLoading();
      this.hide();
      
      // Show success message
      this.showSuccessMessage();

    } catch (error) {
      console.error('Error updating listing:', error);
      this.hideLoading();
      alert('Failed to update listing. Please try again.');
    }
  }

  gatherFormData() {
    return {
      title: this.titleInput.value.trim(),
      price: this.priceInput.value.trim(),
      condition: this.conditionSelect.value,
      category: this.categorySelect.value,
      description: this.descriptionTextarea.value.trim(),
    };
  }

  validateForm(data) {
    const errors = [];
    
    if (!data.title || data.title.length < 3) {
      errors.push('Title must be at least 3 characters');
    }
    
    if (!data.price || isNaN(parseFloat(data.price)) || parseFloat(data.price) <= 0) {
      errors.push('Please enter a valid price');
    }
    
    if (!data.condition) {
      errors.push('Please select a condition');
    }
    
    if (!data.category) {
      errors.push('Please select a category');
    }
    
    const wordCount = data.description.split(/\s+/).filter(Boolean).length;
    if (wordCount > 250) {
      errors.push('Description exceeds 250 words');
    }
    
    return errors;
  }

  showLoading() {
    if (!this.loadingOverlay) {
      
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'loading-overlay';
      loadingDiv.innerHTML = '<div class="spinner"></div>';
      this.shadowRoot.querySelector('.edit-modal').appendChild(loadingDiv);
      this.loadingOverlay = loadingDiv;
    }
    this.loadingOverlay.classList.add('visible');
  }

  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.remove('visible');
    }
  }

  showSuccessMessage() {
    
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 2000;
      font-weight: 500;
    `;
    successMsg.textContent = 'Listing updated successfully!';
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
      successMsg.remove();
    }, 3000);
  }

  resetForm() {
    this.form.reset();
    this.previewContainer.innerHTML = '';
    this.newImageFile = null;
    this.currentListing = null;
    this.wordCounter.textContent = '0/250';
    this.wordCounter.classList.remove('exceeded');
  }

  disconnectedCallback() {
    if (this._isVisible) {
      this.unlockBodyScroll();
    }
  }
}

customElements.define('edit-listing-modal', EditListingModal);
export default EditListingModal;