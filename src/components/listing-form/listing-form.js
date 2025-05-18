import html from './listing-form.html?raw';
import css from './listing-form.css?raw';

class CreateListing extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
        <style>${css}</style>
        ${html}
    `;
    this._loadAssets();
  }

  connectedCallback() {
    this.form = this.shadowRoot.querySelector('form');
    this.wordCounter = this.shadowRoot.querySelector('#word-count');
    this.description = this.shadowRoot.querySelector('#description');
    this.fileInput = this.shadowRoot.querySelector('#media-upload');
    this.previewContainer = this.shadowRoot.querySelector('#preview-container');

    this.form.addEventListener('submit', this._handleSubmit.bind(this));
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
      const thumb = document.createElement('img');
      thumb.src = URL.createObjectURL(file);
      thumb.alt = 'Uploaded media preview';
      thumb.className = 'thumbnail';
      thumb.onload = () => URL.revokeObjectURL(thumb.src);
      this.previewContainer.appendChild(thumb);
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

  _handlePreview(event) {
    event.preventDefault();
    const data = this._gatherFormData();
    const errors = this._validateForm(data);
    if (errors.length === 0) {
      this.dispatchEvent(new CustomEvent('listing-preview', {
        bubbles: true,
        composed: true,
        detail: data,
      }));
    } else {
      alert(errors.join('\n'));
    }
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
