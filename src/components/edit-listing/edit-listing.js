import html from './edit-listing.html?raw';
import css from './edit-listing.css?raw';

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
    this._bindElements();
    this._bindEvents();
  }

  disconnectedCallback() {
    if (this._isVisible) {this._unlockBodyScroll();}
  }

  _bindElements() {
    const $ = (s) => this.shadowRoot.querySelector(s);
    this.overlay = $('.overlay');
    this.form = $('.edit-form');
    this.titleInput = $('#edit-title');
    this.priceInput = $('#edit-price');
    this.conditionSelect = $('#edit-condition');
    this.categorySelect = $('#edit-category');
    this.descriptionTextarea = $('#edit-description');
    this.currentThumbnail = $('.current-thumbnail');
    this.mediaInput = $('#media-update');
    this.previewContainer = $('.preview-new-media');
    this.wordCounter = $('.word-count');
    this.loadingOverlay = $('.loading-overlay');
  }

  _bindEvents() {
    this._onClose = this._onClose.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onMediaChange = this._onMediaChange.bind(this);
    this._onDescriptionInput = this._onDescriptionInput.bind(this);
    this._onPriceInput = this._onPriceInput.bind(this);
    this._onEscKey = this._onEscKey.bind(this);
    this._onOverlayClick = this._onOverlayClick.bind(this);

    this.shadowRoot.querySelector('.close-btn')?.addEventListener('click', this._onClose);
    this.shadowRoot.querySelector('.btn-cancel')?.addEventListener('click', this._onClose);
    this.form?.addEventListener('submit', this._onSubmit);
    this.mediaInput?.addEventListener('change', this._onMediaChange);
    this.descriptionTextarea?.addEventListener('input', this._onDescriptionInput);
    this.priceInput?.addEventListener('input', this._onPriceInput);
    document.addEventListener('keydown', this._onEscKey);
    this.overlay?.addEventListener('click', this._onOverlayClick);
  }

  show(data) {
    if (!data) {return console.error('No listing data provided');}
    this.currentListing = data;
    this._populateForm(data);
    this.overlay.classList.add('visible');
    this._isVisible = true;
    this._lockBodyScroll();
  }

  hide() {
    this.overlay.classList.remove('visible');
    this._isVisible = false;
    this._unlockBodyScroll();
    this._resetForm();
  }

  _onClose() {
    this.hide();
  }

  _onEscKey(e) {
    if (e.key === 'Escape' && this._isVisible) {this.hide();}
  }

  _onOverlayClick(e) {
    if (e.target === this.overlay) {this.hide();}
  }

  _lockBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
  }

  _unlockBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  _populateForm(listing) {
    this.titleInput.value = listing.title || '';
    this.priceInput.value = listing.price || '';
    this.conditionSelect.value = listing.condition || '';
    this.categorySelect.value = listing.category || '';
    this.descriptionTextarea.value = listing.description || '';

    const images = listing.allImages || (Array.isArray(listing.images) ? listing.images : [listing.thumbnail].filter(Boolean));
    if (images.length) {
      this.currentThumbnail.src = images[0];
      this._setupGallery(images);
    } else {
      this.currentThumbnail.src = 'https://via.placeholder.com/300x300?text=No+Image';
    }

    this._updateWordCount();
  }

  _setupGallery(images) {
    this.allImages = images;
    this.currentImageIndex = 0;
    this.shadowRoot.querySelector('.image-gallery')?.remove();
    if (images.length <= 1) {return;}

    const container = this.currentThumbnail.parentNode;
    container.style.position = 'relative';

    ['prev', 'next'].forEach((dir, i) => {
      const btn = document.createElement('button');
      btn.className = `nav-btn ${dir}-btn`;
      btn.type = 'button';
      btn.innerHTML = dir === 'prev' ? '‹' : '›';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this._navigateImage(dir === 'prev' ? -1 : 1);
      });
      container.appendChild(btn);
    });

    const strip = document.createElement('div');
    strip.className = 'thumbnail-strip';
    images.forEach((url, i) => {
      const thumb = document.createElement('img');
      thumb.src = url;
      thumb.className = `thumbnail ${i === 0 ? 'active' : ''}`;
      thumb.addEventListener('click', () => {
        this.currentImageIndex = i;
        this.currentThumbnail.src = url;
        this._updateActiveThumbnail(i);
      });
      strip.appendChild(thumb);
    });

    const gallery = document.createElement('div');
    gallery.className = 'image-gallery';
    gallery.appendChild(strip);
    container.parentNode.insertBefore(gallery, container.nextSibling);
  }

  _navigateImage(dir) {
    this.currentImageIndex = (this.currentImageIndex + dir + this.allImages.length) % this.allImages.length;
    this.currentThumbnail.src = this.allImages[this.currentImageIndex];
    this._updateActiveThumbnail(this.currentImageIndex);
  }

  _updateActiveThumbnail(index) {
    this.shadowRoot.querySelectorAll('.thumbnail').forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
  }

  _onMediaChange(e) {
    const file = e.target.files[0];
    if (!file || (!file.type.startsWith('image/') && !file.type.startsWith('video/')))
    {return window.notify('Please select valid image or video files', 'warning');}

    this.newImageFile = file;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      this.previewContainer.innerHTML = `<img src="${target.result}" alt="New image preview">`;
    };
    reader.readAsDataURL(file);
  }

  _onDescriptionInput() {
    this._updateWordCount();
  }

  _onPriceInput(e) {
    const v = e.target.value.replace(/[^\d.]/g, '').split('.');
    e.target.value = v[0] + (v[1] ? '.' + v[1].slice(0, 2) : '');
  }

  _updateWordCount() {
    const count = this.descriptionTextarea.value.trim().split(/\s+/).filter(Boolean).length;
    this.wordCounter.textContent = `${count}/250`;
    this.wordCounter.classList.toggle('exceeded', count > 250);
  }

  async _onSubmit(e) {
    e.preventDefault();
    const data = this._gatherFormData();
    const errors = this._validateForm(data);
    if (errors.length) {return errors.forEach((err) => window.notify(err, 'warning'));}

    this._showLoading();

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

      this._hideLoading();
      this.hide();
      window.notify('Listing updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      this._hideLoading();
      window.notify('Failed to update listing. Please try again.', 'error');
    }
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

  _validateForm(d) {
    const e = [];
    if (!d.title || d.title.length < 3) {e.push('Title must be at least 3 characters');}
    if (!d.price || isNaN(+d.price) || +d.price <= 0) {e.push('Please enter a valid price');}
    if (!d.condition) {e.push('Please select a condition');}
    if (!d.category) {e.push('Please select a category');}
    if (d.description.split(/\s+/).filter(Boolean).length > 250) {e.push('Description exceeds 250 words');}
    return e;
  }

  _showLoading() {
    if (!this.loadingOverlay) {
      const div = document.createElement('div');
      div.className = 'loading-overlay';
      div.innerHTML = '<div class="spinner"></div>';
      this.shadowRoot.querySelector('.edit-modal').appendChild(div);
      this.loadingOverlay = div;
    }
    this.loadingOverlay.classList.add('visible');
  }

  _hideLoading() {
    this.loadingOverlay?.classList.remove('visible');
  }

  _resetForm() {
    this.form.reset();
    this.previewContainer.innerHTML = '';
    this.newImageFile = null;
    this.currentListing = null;
    this.wordCounter.textContent = '0/250';
    this.wordCounter.classList.remove('exceeded');
    this.allImages = [];
    this.currentImageIndex = 0;
    this.shadowRoot.querySelector('.image-gallery')?.remove();
    this.shadowRoot.querySelectorAll('.nav-btn').forEach((btn) => btn.remove());
    const media = this.shadowRoot.querySelector('.current-media');
    if (media) {media.style.removeProperty('position');}
  }
}

customElements.define('edit-listing-modal', EditListingModal);
export default EditListingModal;