import html from './listing-form.html?raw';
import css from './listing-form.css?raw';

class ListingForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>${css}</style>${html}`;
    this._setupForm();
  }

  _setupForm() {
    this.form = this.shadowRoot.querySelector('.listing-form');
    this.wordCounter = this.shadowRoot.querySelector('#word-count');
    this.descriptionField = this.shadowRoot.querySelector('#description');
    this.mediaInput = this.shadowRoot.querySelector('#media-upload');
    this.previewModal = this.shadowRoot.querySelector('#preview-modal');
    this.closePreviewButton = this.shadowRoot.querySelector('.close-preview');
    this.previewButton = this.shadowRoot.querySelector('#preview-button');

    this.form.addEventListener('submit', this._handleSubmit.bind(this));
    this.descriptionField.addEventListener('input', this._updateWordCount.bind(this));
    this.mediaInput.addEventListener('change', this._previewMedia.bind(this));
    this.previewButton.addEventListener('click', this._showPreview.bind(this));
    this.closePreviewButton.addEventListener('click', this._hidePreview.bind(this));
  }

  _updateWordCount() {
    const wordCount = this.descriptionField.value.trim().split(/\s+/).filter(Boolean).length;
    this.wordCounter.textContent = `${wordCount}/250`;
  }

  _previewMedia() {
    const files = this.mediaInput.files;
    this.previewContainer.innerHTML = '';
    
    if (files.length === 0) {
      return; // Show the upload prompt again
    }

    Array.from(files).forEach((file) => {
      const element = file.type.startsWith('image/')
        ? document.createElement('img')
        : file.type.startsWith('video/')
          ? document.createElement('video')
          : null;

      if (element) {
        const container = document.createElement('div');
     
        container.className = 'thumbnail-container';
            
        element.className = 'thumbnail';
        element.src = URL.createObjectURL(file);
            
        if (element.tagName === 'VIDEO') {
     
          element.controls = true;
          element.muted = true;
          element.loop = true;
        }
            
        // Add remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-thumbnail';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          container.remove();
          this._updateFileList();
        });
            
        container.appendChild(element);
        container.appendChild(removeBtn);
        this.previewContainer.appendChild(container);
            
        element.onload = element.onloadeddata = () => URL.revokeObjectURL(element.src);
      }
    });
  }

  _validateForm(data) {
    const errors = [];
    if (!data.title || data.title.length < 3) {errors.push('Title must be at least 3 characters.');}
    if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(data.price)) {errors.push('Price must be a valid number.');}
    if (data.description.split(/\s+/).filter(Boolean).length > 250) {errors.push('Description exceeds 250 words.');}
    return errors;
  }

  _gatherFormData() {
    return {
      title: this.form.querySelector('input[name="title"]').value.trim(),
      price: this.form.querySelector('input[name="price"]').value.trim(),
      category: this.form.querySelector('select[name="category"]').value,
      condition: this.form.querySelector('select[name="condition"]').value,
      description: this.form.querySelector('textarea[name="description"]').value.trim(),
      files: Array.from(this.mediaInput.files),  // Full File objects, not just names
    };
  }

  _showPreview() {
    const formData = this._gatherFormData();
    this._updatePreviewContent(formData);
    this.previewModal.classList.add('visible');
  }

  _hidePreview() {
    this.previewModal.classList.remove('visible');
  }

  _updatePreviewContent(data) {
    const previewContent = this.shadowRoot.querySelector('.preview-content');
    
    // Update title (add this section)
    const previewTitle = previewContent.querySelector('.preview-title');
    if (previewTitle) {
      previewTitle.textContent = data.title || 'Untitled';
    }
    
    // Update price
    previewContent.querySelector('.preview-price').textContent = 
        data.price ? `$${parseFloat(data.price).toFixed(2)}` : '$00.00';
    
    // Update meta info
    const metaElements = previewContent.querySelectorAll('.preview-meta span');
    metaElements[0].textContent = 'Just Now';
    metaElements[2].textContent = data.category || 'Category';
    metaElements[4].textContent = data.condition || 'Condition';
    
    // Update description
    previewContent.querySelector('.preview-description').textContent = 
        data.description || 'No description provided';
    
    // Update seller info
    const sellerInfo = previewContent.querySelector('.preview-seller-info');
    sellerInfo.querySelector('p:nth-child(2)').textContent = 
        `Phone Number: ${data.phone || 'Not provided'}`;
    sellerInfo.querySelector('p:nth-child(3)').textContent = 
        `Instagram: ${data.instagram || 'Not provided'}`;
    
    // Update media preview (add this section)
    const mediaPreview = previewContent.querySelector('.preview-media');
    if (mediaPreview) {
      mediaPreview.innerHTML = '';
      if (data.files && data.files.length > 0) {
    
        data.files.forEach((file) => {
          const url = URL.createObjectURL(file);
          const mediaElement = file.type.startsWith('image/') 
            ? document.createElement('img')
            : document.createElement('video');
                
          mediaElement.src = url;
          mediaElement.className = 'preview-thumbnail';
                
          if (mediaElement.tagName === 'VIDEO') {
            mediaElement.controls = true;
            mediaElement.muted = true;
          }
    
          mediaElement.onload = () => URL.revokeObjectURL(url);
    
          mediaPreview.appendChild(mediaElement);
        });
      } else {
        mediaPreview.innerHTML = '<div class="no-media">No media uploaded</div>';
      }
    }
  }

  _handleSubmit(event) {
    console.log('Form submitted');
    event.preventDefault();
    const data = this._gatherFormData();
    const errors = this._validateForm(data);
    if (errors.length === 0) {
      this.dispatchEvent(new CustomEvent('listing-submit', {
        bubbles: true,
        composed: true,
        detail: data,
      }));
    } else {
      alert(errors.join('\n'));
    }
  }
}

customElements.define('listing-form', ListingForm);
export default ListingForm;