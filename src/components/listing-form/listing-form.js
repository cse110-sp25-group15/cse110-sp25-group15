import html from './listing-form.html?raw';
import css from './listing-form.css?raw';

class ListingForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>${css}</style>${html}`;
    this.uploadedFiles = [];
    this._currentPreviewIndex = 0;
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
    
    // Add ESC key handler for preview modal
    this.shadowRoot.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.previewModal.classList.contains('visible')) {
        this._hidePreview();
      }
    });

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
      window.notify('Please select valid image or video files', 'warning');
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
      
      // Add thumbnail indicator for first image
      if (index === 0) {
        fileCard.classList.add('is-thumbnail');
      }
      
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
      
      // Add thumbnail badge for first image
      if (index === 0) {
        const thumbnailBadge = document.createElement('div');
        thumbnailBadge.className = 'thumbnail-badge';
        thumbnailBadge.innerHTML = 'Main Photo';
        fileCard.appendChild(thumbnailBadge);
      }
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '×';
      removeBtn.addEventListener('click', () => this._removeFile(index));
      
      // Add reorder buttons (except for single file)
      if (this.uploadedFiles.length > 1) {
        const reorderContainer = document.createElement('div');
        reorderContainer.className = 'reorder-buttons';
        
        if (index > 0) {
          const moveUpBtn = document.createElement('button');
          moveUpBtn.className = 'move-btn move-up';
          moveUpBtn.innerHTML = '↑';
          moveUpBtn.title = 'Move up (make thumbnail)';
          moveUpBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._moveFile(index, index - 1);
          });
          reorderContainer.appendChild(moveUpBtn);
        }
        
        if (index < this.uploadedFiles.length - 1) {
          const moveDownBtn = document.createElement('button');
          moveDownBtn.className = 'move-btn move-down';
          moveDownBtn.innerHTML = '↓';
          moveDownBtn.title = 'Move down';
          moveDownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._moveFile(index, index + 1);
          });
          reorderContainer.appendChild(moveDownBtn);
        }
        
        fileCard.appendChild(reorderContainer);
      }
      
      fileCard.appendChild(thumbnail);
      fileCard.appendChild(fileName);
      fileCard.appendChild(removeBtn);
      
      this.previewContainer.appendChild(fileCard);
    });
  }

  _moveFile(fromIndex, toIndex) {
    // Swap files in array
    const temp = this.uploadedFiles[fromIndex];
    this.uploadedFiles[fromIndex] = this.uploadedFiles[toIndex];
    this.uploadedFiles[toIndex] = temp;
    
    // Refresh display
    this._displayUploadedFiles();
    this._updateUploadLabel();
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
    const uploadIcon = this.uploadLabel.querySelector('.upload-icon');
    const uploadMain = this.uploadLabel.querySelector('.upload-main');
    const uploadSub = this.uploadLabel.querySelector('.upload-sub');
    const fileCount = this.uploadedFiles.length;
    
    if (fileCount === 0) {
      uploadIcon.textContent = '📁';
      uploadMain.textContent = 'Drag & Drop your files here';
      uploadSub.textContent = 'or click to browse';
    } else {
      uploadIcon.textContent = '✓';
      uploadMain.textContent = `${fileCount} file${fileCount > 1 ? 's' : ''} selected`;
      uploadSub.innerHTML = 'Drop more files or <strong>click to add more</strong>';
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
    this._lockBodyScroll();
  }

  _hidePreview() {
    this.previewModal.classList.remove('visible');
    this._unlockBodyScroll();
    this._currentPreviewIndex = 0;
  }

  _lockBodyScroll() {
    document.body.style.overflow = 'hidden';
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  _unlockBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  _updatePreviewContent(data) {
    // Update title
    const previewTitle = this.shadowRoot.querySelector('.preview-title');
    if (previewTitle) {
      previewTitle.textContent = data.title || 'Untitled';
    }
    
    // Update price
    const priceEl = this.shadowRoot.querySelector('.preview-price');
    if (priceEl) {
      priceEl.textContent = data.price ? `$${parseFloat(data.price).toFixed(2)}` : '$0.00';
    }
    
    // Update condition
    const conditionEl = this.shadowRoot.querySelector('.preview-condition');
    if (conditionEl) {
      conditionEl.textContent = data.condition || 'No condition selected';
    }
    
    // Update category
    const categoryEl = this.shadowRoot.querySelector('.preview-category');
    if (categoryEl) {
      categoryEl.textContent = data.category || 'No category selected';
    }
    
    // Update description
    const descEl = this.shadowRoot.querySelector('.preview-description');
    if (descEl) {
      descEl.textContent = data.description || 'No description provided';
    }
    
    // Update media preview with gallery functionality
    this._updatePreviewGallery(data.files);
  }

  _updatePreviewGallery(files) {
    const mainImageContainer = this.shadowRoot.querySelector('.preview-gallery-main');
    const thumbStrip = this.shadowRoot.querySelector('.preview-thumb-strip');
    
    if (!mainImageContainer || !thumbStrip) {return;}
    
    // Clear existing content
    mainImageContainer.innerHTML = '';
    thumbStrip.innerHTML = '';
    
    if (!files || files.length === 0) {
      mainImageContainer.innerHTML = '<div class="no-media">No media uploaded</div>';
      return;
    }
    
    // Create main image/video element
    const firstFile = files[0];
    let mainElement;
    
    if (firstFile.type.startsWith('image/')) {
      mainElement = document.createElement('img');
      mainElement.className = 'preview-main-image';
      mainElement.src = URL.createObjectURL(firstFile);
      mainElement.alt = 'Product preview';
    } else if (firstFile.type.startsWith('video/')) {
      mainElement = document.createElement('video');
      mainElement.className = 'preview-main-video';
      mainElement.src = URL.createObjectURL(firstFile);
      mainElement.controls = true;
      mainElement.muted = true;
    }
    
    if (mainElement) {
      mainImageContainer.appendChild(mainElement);
    }
    
    // Create thumbnails only if multiple files
    if (files.length > 1) {
      files.forEach((file, index) => {
        let thumbElement;
        
        if (file.type.startsWith('image/')) {
          thumbElement = document.createElement('img');
          thumbElement.src = URL.createObjectURL(file);
          thumbElement.alt = `Thumbnail ${index + 1}`;
        } else if (file.type.startsWith('video/')) {
          thumbElement = document.createElement('video');
          thumbElement.src = URL.createObjectURL(file);
          thumbElement.muted = true;
        }
        
        if (thumbElement) {
          thumbElement.className = index === this._currentPreviewIndex ? 'active' : '';
          
          // Add thumbnail indicator for first image
          if (index === 0) {
            thumbElement.style.border = '3px solid #f3c114';
            thumbElement.title = 'Main Photo (Thumbnail)';
          }
          
          thumbElement.addEventListener('click', () => {
            this._currentPreviewIndex = index;
            
            // Update main display
            mainImageContainer.innerHTML = '';
            let newMainElement;
            
            if (file.type.startsWith('image/')) {
              newMainElement = document.createElement('img');
              newMainElement.className = 'preview-main-image';
              newMainElement.src = URL.createObjectURL(file);
              newMainElement.alt = 'Product preview';
            } else if (file.type.startsWith('video/')) {
              newMainElement = document.createElement('video');
              newMainElement.className = 'preview-main-video';
              newMainElement.src = URL.createObjectURL(file);
              newMainElement.controls = true;
              newMainElement.muted = true;
            }
            
            if (newMainElement) {
              mainImageContainer.appendChild(newMainElement);
            }
            
            // Update active state
            thumbStrip.querySelectorAll('img, video').forEach((el, i) => {
              el.className = i === index ? 'active' : '';
              if (i === 0) {
                el.style.border = '3px solid #f3c114';
                el.title = 'Main Photo (Thumbnail)';
              } else {
                el.style.border = '2px solid transparent';
                el.title = '';
              }
            });
          });
          
          thumbStrip.appendChild(thumbElement);
        }
      });
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
      errors.forEach((error) => window.notify(error, 'warning', 4000));
    }
  }

  // Clean up when component is removed
  disconnectedCallback() {
    this._unlockBodyScroll();
  }
}

customElements.define('listing-form', ListingForm);
export default ListingForm;