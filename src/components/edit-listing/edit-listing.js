
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
    this.currentImageIndex = 0;
    this.allImages = [];
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
    this.currentImageIndex = 0;
    this.allImages = [];
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
   
    // Handle multiple images
    const allImages = listing.allImages || (listing.images && Array.isArray(listing.images) ? listing.images : [listing.thumbnail].filter(Boolean));
    
    if (allImages && allImages.length > 0) {
      this.currentThumbnail.src = allImages[0]; // Show first image as main
      this.setupImageGallery(allImages);
    } else {
      this.currentThumbnail.src = 'https://via.placeholder.com/300x300?text=No+Image';
    }
   
    this.updateWordCount();
  }

  setupImageGallery(images) {
    this.allImages = images;
    this.currentImageIndex = 0;
    
    // Remove existing gallery if any
    const existingGallery = this.shadowRoot.querySelector('.image-gallery');
    if (existingGallery) {
      existingGallery.remove();
    }
    
    // Only create gallery if there are multiple images
    if (images.length <= 1) {
      return;
    }
    
    const currentMediaContainer = this.currentThumbnail.parentNode;
    
    // Create gallery container
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'image-gallery';
    
    // Create navigation arrows positioned over the main image
    if (images.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'nav-btn prev-btn';
      prevBtn.innerHTML = '‹';
      prevBtn.type = 'button';
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateImage(-1);
      });
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'nav-btn next-btn';
      nextBtn.innerHTML = '›';
      nextBtn.type = 'button';
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateImage(1);
      });
      
      // Add navigation to the current media container (over the main image)
      currentMediaContainer.style.position = 'relative';
      currentMediaContainer.appendChild(prevBtn);
      currentMediaContainer.appendChild(nextBtn);
    }
    
    // Create thumbnails strip
    const thumbnailStrip = document.createElement('div');
    thumbnailStrip.className = 'thumbnail-strip';
    
    images.forEach((imageUrl, index) => {
      const thumb = document.createElement('img');
      thumb.src = imageUrl;
      thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
      thumb.addEventListener('click', () => {
        this.currentImageIndex = index;
        this.currentThumbnail.src = imageUrl;
        this.updateThumbnailsActive(index);
      });
      thumbnailStrip.appendChild(thumb);
    });
    
    galleryContainer.appendChild(thumbnailStrip);
    
    // Insert gallery after the current media container
    currentMediaContainer.parentNode.insertBefore(galleryContainer, currentMediaContainer.nextSibling);
  }
  
  navigateImage(direction) {
    this.currentImageIndex = (this.currentImageIndex + direction + this.allImages.length) % this.allImages.length;
    this.currentThumbnail.src = this.allImages[this.currentImageIndex];
    this.updateThumbnailsActive(this.currentImageIndex);
  }
  
  updateThumbnailsActive(activeIndex) {
    const thumbnails = this.shadowRoot.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === activeIndex);
    });
  }

  handleMediaChange(e) {
    const file = e.target.files[0];
    if (!file) {return;}

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      window.notify('Please select valid image or video files', 'warning');
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
      errors.forEach((error) => window.notify(error, 'warning', 4000));
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
      window.notify('Failed to update listing. Please try again.', 'error');
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
    
    window.notify('Listing updated successfully!', 'success');
  }

  resetForm() {
    this.form.reset();
    this.previewContainer.innerHTML = '';
    this.newImageFile = null;
    this.currentListing = null;
    this.wordCounter.textContent = '0/250';
    this.wordCounter.classList.remove('exceeded');
    this.allImages = [];
    this.currentImageIndex = 0;
    
    // Remove any existing image gallery
    const existingGallery = this.shadowRoot.querySelector('.image-gallery');
    if (existingGallery) {
      existingGallery.remove();
    }
    
    // Remove navigation buttons from current media container
    const navButtons = this.shadowRoot.querySelectorAll('.nav-btn');
    navButtons.forEach((btn) => btn.remove());
    
    // Reset current media container positioning
    const currentMediaContainer = this.shadowRoot.querySelector('.current-media');
    if (currentMediaContainer) {
      currentMediaContainer.style.position = '';
    }
  }

  disconnectedCallback() {
    if (this._isVisible) {
      this.unlockBodyScroll();
    }
  }
}

customElements.define('edit-listing-modal', EditListingModal);
export default EditListingModal;