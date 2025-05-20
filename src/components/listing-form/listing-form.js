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
    this.previewContainer = this.shadowRoot.querySelector('#preview-container');

    this.form.addEventListener('submit', this._handleSubmit.bind(this));
    this.descriptionField.addEventListener('input', this._updateWordCount.bind(this));
    this.mediaInput.addEventListener('change', this._previewMedia.bind(this));
  }

  _updateWordCount() {
    const wordCount = this.descriptionField.value.trim().split(/\s+/).filter(Boolean).length;
    this.wordCounter.textContent = `${wordCount}/250`;
  }

  _previewMedia() {
    const files = this.mediaInput.files;
    this.previewContainer.innerHTML = '';
    Array.from(files).forEach((file) => {
      const element = file.type.startsWith('image/')
        ? document.createElement('img')
        : file.type.startsWith('video/')
          ? document.createElement('video')
          : null;

      if (element) {
        element.className = 'thumbnail';
        element.src = URL.createObjectURL(file);
        if (element.tagName === 'VIDEO') {
          element.controls = true;
          element.muted = true;
          element.loop = true;
        }
        element.onload = element.onloadeddata = () => URL.revokeObjectURL(element.src);
        this.previewContainer.appendChild(element);
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
