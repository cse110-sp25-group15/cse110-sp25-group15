//import html from './listing-form.html?raw';
//import css from './listing-form.css?raw';

class CreateListing extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    //this.shadowRoot.innerHTML = `
    //<style>${css}</style>
    //${html}
    //`;
    this._loadAssets();
  }
  async _loadAssets() {
    try {
      const [htmlRes, cssRes] = await Promise.all([
        fetch('listing-form.html'),
        fetch('listing-form.css'),
      ]);
      
      const html = await htmlRes.text();
      const css = await cssRes.text();
      
      this.shadowRoot.innerHTML = `
        <style>${css}</style>
        ${html}
      `;
      
      this._setupComponent();
    } catch (error) {
      console.error('Error loading assets:', error);
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; padding: 20px; color: red; }
        </style>
        <p>Error loading component. Check console.</p>
      `;
    }
  }
  _setupComponent() {
         
    this.card = this.shadowRoot.querySelector('#card-container') || this.shadowRoot.querySelector('.card-container');
    this.wordCounter = this.shadowRoot.querySelector('#word-count');
    this.description = this.shadowRoot.querySelector('#description');
    this.fileInput = this.shadowRoot.querySelector('#media-upload');
    this.previewContainer = this.shadowRoot.querySelector('#preview-container');

    this.card.addEventListener('submit', this._handleSubmit.bind(this));
    this.shadowRoot.querySelector('#preview-button')?.addEventListener('click', this._handlePreview.bind(this));
    this.description.addEventListener('input', this._updateWordCount.bind(this));
    this.fileInput.addEventListener('change', this._previewFiles.bind(this));
  }
        
  _updateWordCount() {
    const wordCount = this.description.value.trim().split(/\s+/).filter(Boolean).length;
    this.wordCounter.textContent = `${wordCount}/250`;
  }

  _previewFiles() {
    const files = this.fileInput.files;
    this.previewContainer.innerHTML = '';
    Array.from(files).forEach((file) => {
      const type = file.type;
      let element;

      if (type.startsWith('image/')) {
        element = document.createElement('img');
        element.className = 'thumbnail';
        element.src = URL.createObjectURL(file);
        element.onload = () => URL.revokeObjectURL(element.src);
      
      } else if (type.startsWith('video/')) {
        element = document.createElement('video');
        element.className = 'thumbnail';
        element.src = URL.createObjectURL(file);
        element.controls = true;
        element.muted = true;
        element.loop = true;
        element.onloadeddata = () => URL.revokeObjectURL(element.src);
      }

      if (element) {this.previewContainer.appendChild(element);}
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
      title: this.form.title.value.trim(),
      price: this.form.price.value.trim(),
      category: this.form.category.value,
      condition: this.form.condition.value,
      description: this.form.description.value.trim(),
      files: Array.from(this.fileInput.files).map((file) => file.name),
    };
  }

  _handleSubmit(event) {
    event.preventDefault();
    const data = this._gatherFormData();
    const errors = this._validateForm(data);
    if (errors.length === 0) {
      this.dispatchEvent(new CustomEvent('listing-complete', {
        bubbles: true,
        composed: true,
        detail: data,
      }));
    } else {
      alert(errors.join('\n'));
    }
  }
}

customElements.define('listing-form', CreateListing);
export default CreateListing;
