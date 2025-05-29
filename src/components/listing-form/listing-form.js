import html from './listing-form.html?raw';
import css from './listing-form.css?raw';

class ListingForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>${css}</style>${html}`;
    this.uploadedFiles = [];
    this._setupForm();
  }

  _setupForm() {
    this.form = this.shadowRoot.querySelector('.listing-form');
    this.wordCounter = this.shadowRoot.querySelector('#word-count');
    this.descriptionField = this.shadowRoot.querySelector('#description');
    this.mediaInput = this.shadowRoot.querySelector('#media-upload');
    this.previewModal = this.shadowRoot.querySelector('#preview-modal');
    this.closePreviewButton = this.shadowRoot.querySelector('.close-preview');
    this.previewContainer = this.shadowRoot.querySelector('.preview-container');
    this.previewButton = this.shadowRoot.querySelector('#preview-button');
    this.uploadArea = this.shadowRoot.querySelector('.upload-area');
    this.uploadLabel = this.shadowRoot.querySelector('.upload-label');

    // Setup event listeners
    this.form.addEventListener('submit', this._handleSubmit.bind(this));
    this.descriptionField.addEventListener('input', this._updateWordCount.bind(this));
    this.mediaInput.addEventListener('change', this._handleFileSelect.bind(this));
    this.previewButton.addEventListener('click', this._showPreview.bind(this));
    this.closePreviewButton.addEventListener('click', this._hidePreview.bind(this));

    // Setup drag and drop
    this._setupDragAndDrop();

    // Setup price input formatting
    this._setupPriceInput();
  }

  _setupDragAndDrop() {
    const uploadArea = this.uploadArea;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      uploadArea.addEventListener(eventName, this._preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.add('drag-hover');
      }, false);
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.remove('drag-hover');
      }, false);
    });

    uploadArea.addEventListener('drop', this._handleDrop.bind(this), false);
  }

  _preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  _handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    this._processFiles(files);
  }

  _handleFileSelect(e) {
    const files = e.target.files;
    this._processFiles(files);
  }

  _processFiles(files) {
    const validFiles = Array.from(files).filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });

    if (validFiles.length === 0) {
      alert('Please select valid image or video files');
      return;
    }

    // Add new files to the existing array
    this.uploadedFiles = [...this.uploadedFiles, ...validFiles];
    this._displayUploadedFiles();
    this._updateUploadLabel();
  }

  _displayUploadedFiles() {
    this.previewContainer.innerHTML = '';
    
    this.uploadedFiles.forEach((file, index) => {
      const fileCard = document.createElement('div');
      fileCard.className = 'file-card';
      
      const thumbnail = document.createElement('div');
      thumbnail.className = 'thumbnail';
      
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        thumbnail.appendChild(img);
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.muted = true;
        thumbnail.appendChild(video);
        
        const playIcon = document.createElement('div');
        playIcon.className = 'play-icon';
        playIcon.innerHTML = '▶';
        thumbnail.appendChild(playIcon);
      }
      
      const fileName = document.createElement('div');
      fileName.className = 'file-name';
      fileName.textContent = file.name.length > 20 ? 
        file.name.substring(0, 17) + '...' : file.name;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '×';
      removeBtn.addEventListener('click', () => this._removeFile(index));
      
      fileCard.appendChild(thumbnail);
      fileCard.appendChild(fileName);
      fileCard.appendChild(removeBtn);
      
      this.previewContainer.appendChild(fileCard);
    });
  }

  _removeFile(index) {
    this.uploadedFiles.splice(index, 1);
    this._displayUploadedFiles();
    this._updateUploadLabel();
    
    // Clear the input if no files left
    if (this.uploadedFiles.length === 0) {
      this.mediaInput.value = '';
    }
  }

  _updateUploadLabel() {
    const uploadLabel = this.uploadLabel;
    const fileCount = this.uploadedFiles.length;
    
    if (fileCount === 0) {
      uploadLabel.innerHTML = `
        <div class="upload-icon">📁</div>
        <div class="upload-text">
          <p class="upload-main">Drag & Drop your files here</p>
          <p class="upload-sub">or click to browse</p>
        </div>
      `;
    } else {
      uploadLabel.innerHTML = `
        <div class="upload-icon">✓</div>
        <div class="upload-text">
          <p class="upload-main">${fileCount} file${fileCount > 1 ? 's' : ''} selected</p>
          <p class="upload-sub">Drop more files or click to add</p>
        </div>
      `;
    }
  }

  _setupPriceInput() {
    const priceInput = this.form.querySelector('input[name="price"]');
    
    priceInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/[^\d.]/g, '');
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0, 2);
      }
      e.target.value = value;
    });
  }

  _updateWordCount() {
    const words = this.descriptionField.value.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    this.wordCounter.textContent = `${wordCount}/250`;
    
    if (wordCount > 250) {
      this.wordCounter.classList.add('exceeded');
    } else {
      this.wordCounter.classList.remove('exceeded');
    }
  }

  _validateForm(data) {
    const errors = [];
    if (!data.title || data.title.length < 3) {
      errors.push('Title must be at least 3 characters.');
    }
    if (!data.price || isNaN(parseFloat(data.price))) {
      errors.push('Please enter a valid price.');
    }
    if (!data.category) {
      errors.push('Please select a category.');
    }
    if (!data.condition) {
      errors.push('Please select a condition.');
    }
    if (data.description.split(/\s+/).filter(Boolean).length > 250) {
      errors.push('Description exceeds 250 words.');
    }
    return errors;
  }

  _gatherFormData() {
    return {
      title: this.form.querySelector('input[name="title"]').value.trim(),
      price: this.form.querySelector('input[name="price"]').value.trim(),
      category: this.form.querySelector('select[name="category"]').value,
      condition: this.form.querySelector('select[name="condition"]').value,
      description: this.form.querySelector('textarea[name="description"]').value.trim(),
      files: this.uploadedFiles,
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
    
    // Update title
    const previewTitle = previewContent.querySelector('.preview-title');
    if (previewTitle) {
      previewTitle.textContent = data.title || 'Untitled';
    }
    
    // Update price
    previewContent.querySelector('.preview-price').textContent = 
        data.price ? `$${parseFloat(data.price).toFixed(2)}` : '$0.00';
    
    // Update meta info
    const metaElements = previewContent.querySelectorAll('.preview-meta span');
    metaElements[0].textContent = 'Just Now';
    metaElements[2].textContent = data.category || 'No category';
    metaElements[4].textContent = data.condition || 'No condition';
    
    // Update description
    previewContent.querySelector('.preview-description').textContent = 
        data.description || 'No description provided';
    
    // Update media preview
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