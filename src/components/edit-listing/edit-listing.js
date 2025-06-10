import html from './edit-listing.html?raw';
import css from './edit-listing.css?raw';

/**
 * A modal component for editing marketplace listings with image gallery support.
 * 
 * States:
 * - Hidden: Modal is not visible, body scroll is enabled
 * - Visible: Modal is displayed, body scroll is locked
 * - Loading: Form submission in progress with loading overlay
 * - Gallery Navigation: Multiple images with navigation controls active
 * 
 * Purpose:
 * - Provides interface for editing existing marketplace listings
 * - Handles form validation and data collection
 * - Supports image gallery navigation for listings with multiple images
 * - Manages file upload preview for new images
 * - Emits listing-update events with form data
 * - Prevents body scroll when modal is open
 */
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
    // Bind DOM elements
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
    this.closeBtn = this.shadowRoot.querySelector('.close-btn');
    this.cancelBtn = this.shadowRoot.querySelector('.btn-cancel');

    // Bind event handlers
    this._handleClose = this._handleClose.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleMediaChange = this._handleMediaChange.bind(this);
    this._handleDescriptionInput = this._handleDescriptionInput.bind(this);
    this._handlePriceInput = this._handlePriceInput.bind(this);
    this._handleEscKey = this._handleEscKey.bind(this);
    this._handleOverlayClick = this._handleOverlayClick.bind(this);

    // Add event listeners
    if (this.closeBtn) {this.closeBtn.addEventListener('click', this._handleClose);}
    if (this.cancelBtn) {this.cancelBtn.addEventListener('click', this._handleClose);}
    if (this.form) {this.form.addEventListener('submit', this._handleSubmit);}
    if (this.mediaInput) {this.mediaInput.addEventListener('change', this._handleMediaChange);}
    if (this.descriptionTextarea) {this.descriptionTextarea.addEventListener('input', this._handleDescriptionInput);}
    if (this.priceInput) {this.priceInput.addEventListener('input', this._handlePriceInput);}
    if (this.overlay) {this.overlay.addEventListener('click', this._handleOverlayClick);}
    
    document.addEventListener('keydown', this._handleEscKey);
  }

  disconnectedCallback() {
    if (this.closeBtn) {this.closeBtn.removeEventListener('click', this._handleClose);}
    if (this.cancelBtn) {this.cancelBtn.removeEventListener('click', this._handleClose);}
    if (this.form) {this.form.removeEventListener('submit', this._handleSubmit);}
    if (this.mediaInput) {this.mediaInput.removeEventListener('change', this._handleMediaChange);}
    if (this.descriptionTextarea) {this.descriptionTextarea.removeEventListener('input', this._handleDescriptionInput);}
    if (this.priceInput) {this.priceInput.removeEventListener('input', this._handlePriceInput);}
    if (this.overlay) {this.overlay.removeEventListener('click', this._handleOverlayClick);}
    
    document.removeEventListener('keydown', this._handleEscKey);

    if (this._isVisible) {
      this._renderBodyScrollUnlocked();
    }
  }

  /**
   * Shows the modal with listing data and locks body scroll
   */
  _renderModalVisible() {
    this.overlay.classList.add('visible');
    this._isVisible = true;
    this._renderBodyScrollLocked();
  }

  /**
   * Hides the modal and unlocks body scroll
   */
  _renderModalHidden() {
    this.overlay.classList.remove('visible');
    this._isVisible = false;
    this._renderBodyScrollUnlocked();
  }

  /**
   * Locks body scroll and adds padding to prevent layout shift
   */
  _renderBodyScrollLocked() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
  }

  /**
   * Unlocks body scroll and removes padding
   */
  _renderBodyScrollUnlocked() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  /**
   * Populates form fields with listing data and sets up image display
   */
  _renderFormData(listing) {
    this.titleInput.value = listing.title || '';
    this.priceInput.value = listing.price || '';
    this.conditionSelect.value = listing.condition || '';
    this.categorySelect.value = listing.category || '';
    this.descriptionTextarea.value = listing.description || '';

    const images = listing.allImages || (Array.isArray(listing.images) ? listing.images : [listing.thumbnail].filter(Boolean));
    if (images.length) {
      this.currentThumbnail.src = images[0];
      this._renderImageGallery(images);
    } else {
      this.currentThumbnail.src = 'https://via.placeholder.com/300x300?text=No+Image';
    }

    this._renderWordCount();
  }

  /**
   * Creates and displays image gallery with navigation controls for multiple images
   */
  _renderImageGallery(images) {
    this.allImages = images;
    this.currentImageIndex = 0;
    
    // Clean up existing gallery
    this.shadowRoot.querySelector('.image-gallery')?.remove();
    this.shadowRoot.querySelectorAll('.nav-btn').forEach((btn) => btn.remove());
    
    if (images.length <= 1) {return;}

    const container = this.currentThumbnail.parentNode;
    container.style.position = 'relative';

    // Create navigation buttons
    ['prev', 'next'].forEach((dir, i) => {
      const btn = document.createElement('button');
      btn.className = `nav-btn ${dir}-btn`;
      btn.type = 'button';
      btn.innerHTML = dir === 'prev' ? '‹' : '›';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this._handleImageNavigation(dir === 'prev' ? -1 : 1);
      });
      container.appendChild(btn);
    });

    // Create thumbnail strip
    const strip = document.createElement('div');
    strip.className = 'thumbnail-strip';
    images.forEach((url, i) => {
      const thumb = document.createElement('img');
      thumb.src = url;
      thumb.className = `thumbnail ${i === 0 ? 'active' : ''}`;
      thumb.addEventListener('click', () => this._handleThumbnailClick(i, url));
      strip.appendChild(thumb);
    });

    const gallery = document.createElement('div');
    gallery.className = 'image-gallery';
    gallery.appendChild(strip);
    container.parentNode.insertBefore(gallery, container.nextSibling);
  }

  /**
   * Updates the main image display and active thumbnail indicator
   */
  _renderImageNavigation(index) {
    this.currentThumbnail.src = this.allImages[index];
    this.shadowRoot.querySelectorAll('.thumbnail').forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
  }

  /**
   * Displays preview of newly selected image file
   */
  _renderImagePreview(file) {
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      this.previewContainer.innerHTML = `<img src="${target.result}" alt="New image preview">`;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Updates word count display and exceeded state
   */
  _renderWordCount() {
    const count = this.descriptionTextarea.value.trim().split(/\s+/).filter(Boolean).length;
    this.wordCounter.textContent = `${count}/250`;
    this.wordCounter.classList.toggle('exceeded', count > 250);
  }

  /**
   * Shows loading overlay during form submission
   */
  _renderLoadingVisible() {
    if (!this.loadingOverlay) {
      const div = document.createElement('div');
      div.className = 'loading-overlay';
      div.innerHTML = '<div class="spinner"></div>';
      this.shadowRoot.querySelector('.edit-modal').appendChild(div);
      this.loadingOverlay = div;
    }
    this.loadingOverlay.classList.add('visible');
  }

  /**
   * Hides loading overlay after form submission
   */
  _renderLoadingHidden() {
    this.loadingOverlay?.classList.remove('visible');
  }

  /**
   * Resets form to initial state and cleans up all dynamic content
   */
  _renderFormReset() {
    this.form.reset();
    this.previewContainer.innerHTML = '';
    this.newImageFile = null;
    this.currentListing = null;
    this.wordCounter.textContent = '0/250';
    this.wordCounter.classList.remove('exceeded');
    this.allImages = [];
    this.currentImageIndex = 0;
    
    // Clean up gallery elements
    this.shadowRoot.querySelector('.image-gallery')?.remove();
    this.shadowRoot.querySelectorAll('.nav-btn').forEach((btn) => btn.remove());
    
    const media = this.shadowRoot.querySelector('.current-media');
    if (media) {
      media.style.removeProperty('position');
    }
  }

  _handleClose() {
    this.hide();
  }

  _handleEscKey(e) {
    if (e.key === 'Escape' && this._isVisible) {
      this.hide();
    }
  }

  _handleOverlayClick(e) {
    if (e.target === this.overlay) {
      this.hide();
    }
  }

  _handleMediaChange(e) {
    const file = e.target.files[0];
    if (!file || (!file.type.startsWith('image/') && !file.type.startsWith('video/'))) {
      return window.notify('Please select valid image or video files', 'warning');
    }

    this.newImageFile = file;
    this._renderImagePreview(file);
  }

  _handleDescriptionInput() {
    this._renderWordCount();
  }

  _handlePriceInput(e) {
    const value = e.target.value.replace(/[^\d.]/g, '').split('.');
    e.target.value = value[0] + (value[1] ? '.' + value[1].slice(0, 2) : '');
  }

  _handleImageNavigation(direction) {
    this.currentImageIndex = (this.currentImageIndex + direction + this.allImages.length) % this.allImages.length;
    this._renderImageNavigation(this.currentImageIndex);
  }

  _handleThumbnailClick(index, url) {
    this.currentImageIndex = index;
    this.currentThumbnail.src = url;
    this._renderImageNavigation(index);
  }

  async _handleSubmit(e) {
    e.preventDefault();
    const data = this._gatherFormData();
    const errors = this._validateForm(data);
    
    if (errors.length) {
      return errors.forEach((err) => window.notify(err, 'warning'));
    }

    this._renderLoadingVisible();

    try {
      const update = {
        ...data,
        price: parseFloat(data.price),
        ...(this.newImageFile && { newImage: this.newImageFile }),
      };

      this.dispatchEvent(new CustomEvent('listing-update', {
        bubbles: true,
        composed: true,
        detail: {
          listingId: this.currentListing.listing_id,
          updates: update,
        },
      }));

      this._renderLoadingHidden();
      this.hide();
      window.notify('Listing updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      this._renderLoadingHidden();
      window.notify('Failed to update listing. Please try again.', 'error');
    }
  }

  show(data) {
    if (!data) {
      return console.error('No listing data provided');
    }
    this.currentListing = data;
    this._renderFormData(data);
    this._renderModalVisible();
  }

  hide() {
    this._renderModalHidden();
    this._renderFormReset();
  }

  _gatherFormData() {
    return {
      title: this.titleInput.value.trim(),
      price: this.priceInput.value.trim(),
      condition: this.conditionSelect.value,
      category: this.categorySelect.value,
      description: this.descriptionTextarea.value.trim(),
    };
  }

  _validateForm(data) {
    const errors = [];
    if (!data.title || data.title.length < 3) {
      errors.push('Title must be at least 3 characters');
    }
    if (!data.price || isNaN(+data.price) || +data.price <= 0) {
      errors.push('Please enter a valid price');
    }
    if (!data.condition) {
      errors.push('Please select a condition');
    }
    if (!data.category) {
      errors.push('Please select a category');
    }
    if (data.description.split(/\s+/).filter(Boolean).length > 250) {
      errors.push('Description exceeds 250 words');
    }
    return errors;
  }
}

customElements.define('edit-listing-modal', EditListingModal);
export default EditListingModal;