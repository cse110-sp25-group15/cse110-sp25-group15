import"./bottom-nav.js";import"./main2.js";import"https://cdn.skypack.dev/heic2any";import"https://cdn.skypack.dev/browser-image-compression";const c=`<form class="listing-form">\r
    <div class="form-grid">\r
        <!-- Media Upload Section -->\r
        <div class="upload-section">\r
            <h3 class="section-title">Photos & Videos</h3>\r
            <div class="upload-area">\r
                <label for="media-upload" class="upload-label">\r
                    <div class="upload-icon">📁</div>\r
                    <div class="upload-text">\r
                        <p class="upload-main">Drag & Drop your files here</p>\r
                        <p class="upload-sub">or click to browse</p>\r
                    </div>\r
                    <input\r
                        type="file"\r
                        id="media-upload"\r
                        name="media"\r
                        accept="image/*,video/*"\r
                        multiple\r
                        hidden\r
                    >\r
                </label>\r
                <div class="preview-container"></div>\r
            </div>\r
        </div>\r
\r
        <!-- Form Fields Section -->\r
        <div class="form-section">\r
            <h3 class="section-title">Item Details</h3>\r
            \r
            <div class="form-group">\r
                <label for="title">Title</label>\r
                <input\r
                    type="text"\r
                    id="title"\r
                    name="title"\r
                    placeholder="What are you selling?"\r
                    required\r
                >\r
            </div>\r
\r
            <div class="form-row">\r
                <div class="form-group">\r
                    <label for="price">Price</label>\r
                    <div class="price-input-wrapper">\r
                        <span class="price-symbol">$</span>\r
                        <input\r
                            type="text"\r
                            id="price"\r
                            name="price"\r
                            placeholder="0.00"\r
                            required\r
                        >\r
                    </div>\r
                </div>\r
\r
                <div class="form-group">\r
                    <label for="condition">Condition</label>\r
                    <select\r
                        id="condition"\r
                        name="condition"\r
                        required\r
                    >\r
                        <option value="">Select condition</option>\r
                        <option value="New">New</option>\r
                        <option value="Like New">Like New</option>\r
                        <option value="Lightly Used">Lightly Used</option>\r
                        <option value="Used">Used</option>\r
                    </select>\r
                </div>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="category">Category</label>\r
                <select\r
                    id="category"\r
                    name="category"\r
                    required\r
                >\r
                    <option value="">Select category</option>\r
                    <option value="Sports">Sports</option>\r
                    <option value="Books">Books</option>\r
                    <option value="Supplies">Supplies</option>\r
                    <option value="Tech">Tech</option>\r
                    <option value="Transportation">Transportation</option>\r
                    <option value="Apparel">Apparel</option>\r
                    <option value="Dorm Life">Dorm Life</option>\r
                    <option value="Furniture">Furniture</option>\r
                    <option value="Other">Other</option>\r
                </select>\r
            </div>\r
\r
            <div class="form-group">\r
                <label for="description">Description</label>\r
                <textarea\r
                    id="description"\r
                    name="description"\r
                    rows="6"\r
                    placeholder="Describe your item in detail..."\r
                ></textarea>\r
                <div id="word-count" class="word-count">0/250</div>\r
            </div>\r
\r
            <div class="actions">\r
                <button\r
                    type="button"\r
                    id="preview-button"\r
                    class="btn btn-secondary"\r
                >\r
                    <span class="btn-icon">👁</span>\r
                    Preview\r
                </button>\r
                <button type="submit" class="btn btn-primary">\r
                    <span class="btn-icon">✓</span>\r
                    Create Listing\r
                </button>\r
            </div>\r
        </div>\r
    </div>\r
</form>\r
\r
<div class="preview-modal" id="preview-modal">\r
    <div class="preview-content">\r
        <button\r
            class="close-preview"\r
            type="button"\r
            aria-label="Close"\r
        >&times;</button>\r
        \r
        <div class="preview-gallery">\r
            <div class="preview-gallery-main">\r
                <img\r
                    class="preview-main-image"\r
                    src=""\r
                    alt="Product preview"\r
                >\r
            </div>\r
            <div class="preview-thumb-strip"></div>\r
        </div>\r
        \r
        <div class="preview-meta-panel">\r
            <h1 class="preview-title">Untitled</h1>\r
            <div class="preview-price">$0.00</div>\r
            <div class="preview-meta-table">\r
                <div class="preview-date">Just Now</div>\r
                <div class="preview-condition">No condition selected</div>\r
            </div>\r
            <b class="preview-description-title">Description:</b>\r
            <p class="preview-description">Item description will appear here...</p>\r
            <div class="preview-contact-box">\r
                <textarea\r
                    class="preview-contact-message"\r
                    rows="2"\r
                    placeholder="Hi, is this still available?"\r
                    disabled\r
                ></textarea>\r
                <button\r
                    class="preview-send-btn"\r
                    type="button"\r
                    disabled\r
                >\r
                    <svg\r
                        xmlns="http://www.w3.org/2000/svg"\r
                        viewBox="0 0 24 24"\r
                        fill="none"\r
                        stroke="currentColor"\r
                        stroke-width="2"\r
                        stroke-linecap="round"\r
                        stroke-linejoin="round"\r
                        width="14"\r
                        height="14"\r
                    >\r
                        <path d="m3 3 3 9-3 9 19-9Z"/>\r
                        <path d="m6 12 13 0"/>\r
                    </svg>\r
                    Send Message\r
                </button>\r
            </div>\r
        </div>\r
    </div>\r
</div>`,m=`:host {\r
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\r
  display: block;\r
  width: 100%;\r
}\r
\r
.listing-form {\r
  display: block;\r
  width: 100%;\r
  max-width: 1400px;\r
  margin: 0 auto;\r
}\r
\r
.form-grid {\r
  display: grid;\r
  grid-template-columns: 1fr 1fr;\r
  gap: 3rem;\r
  background: white;\r
  border-radius: 12px;\r
  padding: 2.5rem;\r
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\r
}\r
\r
.section-title {\r
  font-size: 1.25rem;\r
  font-weight: 600;\r
  color: var(--navy-text);\r
  margin: 0 0 1.5rem 0;\r
}\r
\r
/* Upload Section */\r
.upload-section {\r
  display: flex;\r
  flex-direction: column;\r
}\r
\r
.upload-area {\r
  background: #f8f9fa;\r
  border: 2px dashed #dee2e6;\r
  border-radius: 12px;\r
  padding: 2rem;\r
  transition: all 0.3s ease;\r
  flex: 1;\r
  display: flex;\r
  flex-direction: column;\r
}\r
\r
.upload-area.drag-hover {\r
  border-color: var(--gold);\r
  background: #fffdf5;\r
  transform: scale(1.02);\r
}\r
\r
.upload-label {\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  justify-content: center;\r
  cursor: pointer;\r
  padding: 3rem 2rem;\r
  text-align: center;\r
  transition: all 0.3s ease;\r
}\r
\r
.upload-icon {\r
  font-size: 3rem;\r
  margin-bottom: 1rem;\r
  opacity: 0.8;\r
  transition: transform 0.3s ease;\r
}\r
\r
.upload-label:hover .upload-icon {\r
  transform: scale(1.1);\r
}\r
\r
.upload-text {\r
  color: #6c757d;\r
}\r
\r
.upload-main {\r
  font-size: 1.1rem;\r
  font-weight: 500;\r
  margin: 0 0 0.5rem 0;\r
  color: var(--navy-text);\r
}\r
\r
.upload-sub {\r
  font-size: 0.9rem;\r
  margin: 0;\r
  color: #6c757d;\r
}\r
\r
/* File Preview Grid */\r
.preview-container {\r
  display: grid;\r
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\r
  gap: 1rem;\r
  margin-top: 1.5rem;\r
}\r
\r
.file-card {\r
  position: relative;\r
  background: white;\r
  border-radius: 8px;\r
  overflow: hidden;\r
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\r
  transition: transform 0.2s ease;\r
}\r
\r
.file-card:hover {\r
  transform: translateY(-2px);\r
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);\r
}\r
\r
.file-card .thumbnail {\r
  width: 100%;\r
  height: 100px;\r
  background: #f5f5f5;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  position: relative;\r
  overflow: hidden;\r
}\r
\r
.file-card .thumbnail img,\r
.file-card .thumbnail video {\r
  width: 100%;\r
  height: 100%;\r
  object-fit: cover;\r
}\r
\r
.file-card .play-icon {\r
  position: absolute;\r
  width: 40px;\r
  height: 40px;\r
  background: rgba(0, 0, 0, 0.7);\r
  color: white;\r
  border-radius: 50%;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  font-size: 1rem;\r
}\r
\r
.file-card .file-name {\r
  padding: 0.5rem;\r
  font-size: 0.75rem;\r
  color: #495057;\r
  text-align: center;\r
  white-space: nowrap;\r
  overflow: hidden;\r
  text-overflow: ellipsis;\r
}\r
\r
.file-card .remove-btn {\r
  position: absolute;\r
  top: 4px;\r
  right: 4px;\r
  width: 24px;\r
  height: 24px;\r
  background: rgba(220, 53, 69, 0.9);\r
  color: white;\r
  border: none;\r
  border-radius: 50%;\r
  font-size: 1.2rem;\r
  line-height: 1;\r
  cursor: pointer;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  opacity: 0;\r
  transition: opacity 0.2s ease;\r
}\r
\r
.file-card:hover .remove-btn {\r
  opacity: 1;\r
}\r
\r
.remove-btn:hover {\r
  background: #dc3545;\r
  transform: scale(1.1);\r
}\r
\r
/* Form Section */\r
.form-section {\r
  display: flex;\r
  flex-direction: column;\r
}\r
\r
.form-group {\r
  margin-bottom: 1.5rem;\r
}\r
\r
.form-group label {\r
  display: block;\r
  font-weight: 500;\r
  color: var(--navy-text);\r
  margin-bottom: 0.5rem;\r
  font-size: 0.95rem;\r
}\r
\r
.form-row {\r
  display: grid;\r
  grid-template-columns: 1fr 1fr;\r
  gap: 1.5rem;\r
}\r
\r
input[type="text"],\r
select,\r
textarea {\r
  width: 100%;\r
  padding: 0.75rem 1rem;\r
  border: 1px solid #dee2e6;\r
  border-radius: 8px;\r
  font-size: 1rem;\r
  transition: border-color 0.2s ease, box-shadow 0.2s ease;\r
  background: white;\r
  color: var(--navy-text);\r
}\r
\r
input[type="text"]:focus,\r
select:focus,\r
textarea:focus {\r
  outline: none;\r
  border-color: var(--gold);\r
  box-shadow: 0 0 0 3px rgba(243, 193, 20, 0.1);\r
}\r
\r
/* Price Input */\r
.price-input-wrapper {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
}\r
\r
.price-symbol {\r
  position: absolute;\r
  left: 1rem;\r
  padding-bottom: 4.5px;\r
  color: #6c757d;\r
  font-weight: 500;\r
}\r
\r
.price-input-wrapper input {\r
  padding-left: 2rem;\r
}\r
\r
/* Select Styling */\r
select {\r
  appearance: none;\r
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");\r
  background-repeat: no-repeat;\r
  background-position: right 1rem center;\r
  padding-right: 2.5rem;\r
}\r
\r
/* Textarea */\r
textarea {\r
  resize: vertical;\r
  min-height: 120px;\r
  font-family: inherit;\r
}\r
\r
.word-count {\r
  text-align: right;\r
  font-size: 0.85rem;\r
  color: #6c757d;\r
  margin-top: 0.25rem;\r
}\r
\r
.word-count.exceeded {\r
  color: #dc3545;\r
  font-weight: 500;\r
}\r
\r
/* Buttons */\r
.actions {\r
  display: flex;\r
  gap: 1rem;\r
  margin-top: 2rem;\r
}\r
\r
.file-card.is-thumbnail {\r
  border: 2px solid var(--gold);\r
  box-shadow: 0 4px 12px rgba(243, 193, 20, 0.3);\r
}\r
\r
.thumbnail-badge {\r
  position: absolute;\r
  top: -4px;\r
  left: 50%;\r
  transform: translateX(-50%);\r
  background: var(--gold);\r
  color: var(--navy-text);\r
  font-size: .75rem;\r
  font-weight: 600;\r
  padding: 2px 8px;\r
  border-radius: 10px;\r
  white-space: nowrap;\r
  z-index: 5;\r
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\r
}\r
\r
\r
.reorder-buttons {\r
  position: absolute;\r
  top: 4px;\r
  left: 4px;\r
  display: flex;\r
  flex-direction: column;\r
  gap: 2px;\r
  opacity: 0;\r
  transition: opacity 0.2s ease;\r
  z-index: 4;\r
}\r
\r
.file-card:hover .reorder-buttons {\r
  opacity: 1;\r
}\r
\r
.move-btn {\r
  width: 20px;\r
  height: 20px;\r
  background: rgba(255, 255, 255, 0.9);\r
  border: 1px solid #ddd;\r
  border-radius: 3px;\r
  font-size: 12px;\r
  cursor: pointer;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  transition: all 0.2s ease;\r
}\r
\r
.move-btn:hover {\r
  background: var(--gold);\r
  color: var(--navy-text);\r
  transform: scale(1.1);\r
}\r
\r
\r
.upload-text .upload-sub {\r
  color: var(--gold);\r
  font-weight: 500;\r
}\r
\r
\r
.preview-thumb-strip img:first-child,\r
.preview-thumb-strip video:first-child {\r
  border: 3px solid var(--gold) !important;\r
  box-shadow: 0 0 0 1px rgba(243, 193, 20, 0.5);\r
}\r
\r
\r
.file-card {\r
  position: relative;\r
}\r
.btn {\r
  display: inline-flex;\r
  align-items: center;\r
  gap: 0.5rem;\r
  padding: 0.875rem 1.75rem;\r
  border: none;\r
  border-radius: 8px;\r
  font-size: 1rem;\r
  font-weight: 500;\r
  cursor: pointer;\r
  transition: all 0.2s ease;\r
  text-transform: none;\r
  letter-spacing: 0.02em;\r
}\r
\r
.btn-icon {\r
  font-size: 1.1rem;\r
}\r
\r
.btn-primary {\r
  background: var(--gold);\r
  color: var(--navy-text);\r
  flex: 1;\r
}\r
\r
.btn-primary:hover {\r
  background: #d4a90f;\r
  transform: translateY(-1px);\r
  box-shadow: 0 4px 12px rgba(243, 193, 20, 0.3);\r
}\r
\r
.btn-secondary {\r
  background: white;\r
  color: var(--navy-text);\r
  border: 2px solid var(--blue);\r
}\r
\r
.btn-secondary:hover {\r
  background: var(--blue);\r
  color: white;\r
}\r
\r
.preview-modal {\r
  position: fixed;\r
  top: 0;\r
  left: 0;\r
  width: 100%;\r
  height: 100%;\r
  background: rgba(0, 0, 0, 0.7);\r
  z-index: 1000;\r
  display: none;\r
  justify-content: center;\r
  align-items: center;\r
  padding: 20px;\r
  box-sizing: border-box;\r
  overflow-y: auto;\r
}\r
\r
.preview-modal.visible {\r
  display: flex;\r
}\r
\r
.preview-content {\r
  border-top: 40px solid var(--blue);\r
  padding: 2rem;\r
  background: var(--white);\r
  display: flex;\r
  border-radius: 12px;\r
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\r
  width: 80%;\r
  max-height: 90vh;\r
  max-width: 900px;\r
  position: relative;\r
  margin: auto;\r
  gap: 2rem;\r
  overflow: hidden;\r
}\r
\r
.preview-gallery {\r
  flex: 1;\r
  display: flex;\r
  flex-direction: column;\r
  justify-content: flex-start;\r
  background: var(--white);\r
  border-radius: 8px;\r
  max-height: 600px;\r
  overflow: hidden;\r
}\r
\r
.preview-gallery-main {\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  width: 100%;\r
  height: 400px;\r
  position: relative;\r
  overflow: hidden;\r
  background: #f8f9fa;\r
  border-radius: 8px;\r
}\r
\r
.preview-gallery-main img,\r
.preview-gallery-main video {\r
  width: 100%;\r
  height: 100%;\r
  max-width: 100%;\r
  max-height: 100%;\r
  border-radius: 8px;\r
  display: block;\r
  object-fit: cover;\r
}\r
\r
.preview-thumb-strip {\r
  display: flex;\r
  gap: 0.5rem;\r
  margin-top: 1rem;\r
  justify-content: flex-start;\r
  flex-wrap: wrap;\r
}\r
\r
.preview-thumb-strip img,\r
.preview-thumb-strip video {\r
  width: 60px;\r
  height: 60px;\r
  object-fit: cover;\r
  border-radius: 4px;\r
  border: 2px solid transparent;\r
  cursor: pointer;\r
  background: var(--white);\r
  transition: border 0.2s;\r
}\r
\r
.preview-thumb-strip img.active,\r
.preview-thumb-strip video.active {\r
  border-color: var(--gold);\r
  box-shadow: 0 0 0 1px #B89B0E;\r
}\r
\r
.preview-meta-panel {\r
  flex: 1;\r
  display: flex;\r
  flex-direction: column;\r
  max-width: 400px;\r
  padding-left: 1rem;\r
}\r
\r
.preview-title {\r
  color: var(--blue);\r
  font-size: 2rem;\r
  margin: 0 0 1rem 0;\r
  font-weight: 700;\r
  line-height: 1.2;\r
}\r
\r
.preview-price {\r
  color: var(--gold);\r
  font-size: 1.8rem;\r
  font-weight: 600;\r
  margin: 0 0 1rem 0;\r
}\r
\r
.preview-meta-table {\r
  margin-bottom: 1.5rem;\r
}\r
\r
.preview-date,\r
.preview-condition {\r
  display: flex;\r
  align-items: center;\r
  gap: 0.5em;\r
  color: var(--blue);\r
  font-size: 0.9rem;\r
  font-weight: 500;\r
  margin-bottom: 0.5rem;\r
}\r
\r
.preview-description-title {\r
  color: var(--blue);\r
  font-size: 1.1rem;\r
  font-weight: 600;\r
  margin: 0 0 0.5rem 0;\r
}\r
\r
.preview-description {\r
  min-height: 120px;\r
  max-height: 180px;\r
  font-size: 0.9rem;\r
  margin: 0 0 1.5rem 0;\r
  overflow-y: auto;\r
  background: var(--white);\r
  border-radius: 8px;\r
  color: var(--blue);\r
  line-height: 1.5;\r
}\r
\r
.preview-contact-box {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 0.75rem;\r
  margin-top: 0.5rem;\r
}\r
\r
.preview-contact-message {\r
  resize: none;\r
  min-height: 2.5em;\r
  max-height: 6em;\r
  font-size: 0.9rem;\r
  border-radius: 6px;\r
  border: 1px solid #ddd;\r
  padding: 0.75em;\r
  color: var(--blue);\r
  background: var(--white);\r
  font-family: inherit;\r
  width: 100%;\r
  box-sizing: border-box;\r
}\r
\r
.preview-send-btn {\r
  display: inline-flex;\r
  align-items: center;\r
  justify-content: center;\r
  gap: 0.5em;\r
  background: var(--gold);\r
  color: var(--blue);\r
  border: none;\r
  border-radius: 6px;\r
  font-size: 0.85rem;\r
  font-weight: 600;\r
  padding: 0.6em 1.2em;\r
  cursor: pointer;\r
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\r
  transition: background 0.2s, color 0.2s, transform 0.1s;\r
  align-self: flex-start;\r
  min-width: 140px;\r
}\r
\r
.preview-send-btn:hover {\r
  background: #B89B0E;\r
  transform: translateY(-1px);\r
}\r
\r
.close-preview {\r
  position: absolute;\r
  top: 1rem;            \r
  right: 1rem;             \r
  z-index: 10;\r
  background: transparent;\r
  color: var(--ucsd-blue); \r
  font-size: 1.5rem;     \r
  font-weight: bold;\r
  cursor: pointer;\r
  padding: 0.2em 0.5em;\r
  border-radius: 50%;\r
  transition: color 0.2s;\r
  border:none\r
}\r
\r
.close-preview:hover {\r
  color: var(--gold);\r
}\r
\r
.no-media {\r
  color: #6c757d;\r
  font-style: italic;\r
  padding: 2rem;\r
  text-align: center;\r
  background: #f8f9fa;\r
  border-radius: 8px;\r
  width: 100%;\r
}\r
\r
@media (max-width: 1024px) {\r
  .form-grid {\r
    grid-template-columns: 1fr;\r
    gap: 2rem;\r
  }\r
  \r
  .upload-area {\r
    min-height: 300px;\r
  }\r
}\r
@media (max-width: 768px) {\r
    .listing-page-container {\r
        padding: 2rem 1rem;\r
    }\r
    \r
    .listing-header {\r
        padding: 2rem 1.5rem;\r
    }\r
    \r
    .listing-header h1 {\r
        font-size: 2rem;\r
    }\r
    \r
    .listing-header p {\r
        font-size: 1.1rem;\r
    }\r
}`;class u extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`<style>${m}</style>${c}`,this.uploadedFiles=[],this._currentPreviewIndex=0,this._setupForm()}_setupForm(){this.form=this.shadowRoot.querySelector(".listing-form"),this.wordCounter=this.shadowRoot.querySelector("#word-count"),this.descriptionField=this.shadowRoot.querySelector("#description"),this.mediaInput=this.shadowRoot.querySelector("#media-upload"),this.previewModal=this.shadowRoot.querySelector("#preview-modal"),this.closePreviewButton=this.shadowRoot.querySelector(".close-preview"),this.previewContainer=this.shadowRoot.querySelector(".preview-container"),this.previewButton=this.shadowRoot.querySelector("#preview-button"),this.uploadArea=this.shadowRoot.querySelector(".upload-area"),this.uploadLabel=this.shadowRoot.querySelector(".upload-label"),this.form.addEventListener("submit",this._handleSubmit.bind(this)),this.descriptionField.addEventListener("input",this._updateWordCount.bind(this)),this.mediaInput.addEventListener("change",this._handleFileSelect.bind(this)),this.previewButton.addEventListener("click",this._showPreview.bind(this)),this.closePreviewButton.addEventListener("click",this._hidePreview.bind(this)),this.shadowRoot.addEventListener("keydown",r=>{r.key==="Escape"&&this.previewModal.classList.contains("visible")&&this._hidePreview()}),this._setupDragAndDrop(),this._setupPriceInput()}_setupDragAndDrop(){const r=this.uploadArea;["dragenter","dragover","dragleave","drop"].forEach(e=>{r.addEventListener(e,this._preventDefaults,!1)}),["dragenter","dragover"].forEach(e=>{r.addEventListener(e,()=>{r.classList.add("drag-hover")},!1)}),["dragleave","drop"].forEach(e=>{r.addEventListener(e,()=>{r.classList.remove("drag-hover")},!1)}),r.addEventListener("drop",this._handleDrop.bind(this),!1)}_preventDefaults(r){r.preventDefault(),r.stopPropagation()}_handleDrop(r){const n=r.dataTransfer.files;this._processFiles(n)}_handleFileSelect(r){const e=r.target.files;this._processFiles(e)}_processFiles(r){const e=Array.from(r).filter(n=>{const i=n.type.startsWith("image/"),a=n.type.startsWith("video/");return i||a});if(e.length===0){alert("Please select valid image or video files");return}this.uploadedFiles=[...this.uploadedFiles,...e],this._displayUploadedFiles(),this._updateUploadLabel()}_displayUploadedFiles(){this.previewContainer.innerHTML="",this.uploadedFiles.forEach((r,e)=>{const n=document.createElement("div");n.className="file-card",e===0&&n.classList.add("is-thumbnail");const i=document.createElement("div");if(i.className="thumbnail",r.type.startsWith("image/")){const o=document.createElement("img");o.src=URL.createObjectURL(r),i.appendChild(o)}else if(r.type.startsWith("video/")){const o=document.createElement("video");o.src=URL.createObjectURL(r),o.muted=!0,i.appendChild(o);const t=document.createElement("div");t.className="play-icon",t.innerHTML="▶",i.appendChild(t)}const a=document.createElement("div");if(a.className="file-name",a.textContent=r.name.length>20?r.name.substring(0,17)+"...":r.name,e===0){const o=document.createElement("div");o.className="thumbnail-badge",o.innerHTML="Main Photo",n.appendChild(o)}const s=document.createElement("button");if(s.className="remove-btn",s.innerHTML="×",s.addEventListener("click",()=>this._removeFile(e)),this.uploadedFiles.length>1){const o=document.createElement("div");if(o.className="reorder-buttons",e>0){const t=document.createElement("button");t.className="move-btn move-up",t.innerHTML="↑",t.title="Move up (make thumbnail)",t.addEventListener("click",l=>{l.stopPropagation(),this._moveFile(e,e-1)}),o.appendChild(t)}if(e<this.uploadedFiles.length-1){const t=document.createElement("button");t.className="move-btn move-down",t.innerHTML="↓",t.title="Move down",t.addEventListener("click",l=>{l.stopPropagation(),this._moveFile(e,e+1)}),o.appendChild(t)}n.appendChild(o)}n.appendChild(i),n.appendChild(a),n.appendChild(s),this.previewContainer.appendChild(n)})}_moveFile(r,e){const n=this.uploadedFiles[r];this.uploadedFiles[r]=this.uploadedFiles[e],this.uploadedFiles[e]=n,this._displayUploadedFiles(),this._updateUploadLabel()}_removeFile(r){this.uploadedFiles.splice(r,1),this._displayUploadedFiles(),this._updateUploadLabel(),this.uploadedFiles.length===0&&(this.mediaInput.value="")}_updateUploadLabel(){const r=this.uploadLabel.querySelector(".upload-icon"),e=this.uploadLabel.querySelector(".upload-main"),n=this.uploadLabel.querySelector(".upload-sub"),i=this.uploadedFiles.length;i===0?(r.textContent="📁",e.textContent="Drag & Drop your files here",n.textContent="or click to browse"):(r.textContent="✓",e.textContent=`${i} file${i>1?"s":""} selected`,n.innerHTML="Drop more files or <strong>click to add more</strong>")}_setupPriceInput(){this.form.querySelector('input[name="price"]').addEventListener("input",e=>{let n=e.target.value.replace(/[^\d.]/g,"");const i=n.split(".");i.length>2&&(n=i[0]+"."+i.slice(1).join("")),i[1]&&i[1].length>2&&(n=i[0]+"."+i[1].substring(0,2)),e.target.value=n})}_updateWordCount(){const e=this.descriptionField.value.trim().split(/\s+/).filter(Boolean).length;this.wordCounter.textContent=`${e}/250`,e>250?this.wordCounter.classList.add("exceeded"):this.wordCounter.classList.remove("exceeded")}_validateForm(r){const e=[];return(!r.title||r.title.length<3)&&e.push("Title must be at least 3 characters."),(!r.price||isNaN(parseFloat(r.price)))&&e.push("Please enter a valid price."),r.category||e.push("Please select a category."),r.condition||e.push("Please select a condition."),r.description.split(/\s+/).filter(Boolean).length>250&&e.push("Description exceeds 250 words."),e}_gatherFormData(){return{title:this.form.querySelector('input[name="title"]').value.trim(),price:this.form.querySelector('input[name="price"]').value.trim(),category:this.form.querySelector('select[name="category"]').value,condition:this.form.querySelector('select[name="condition"]').value,description:this.form.querySelector('textarea[name="description"]').value.trim(),files:this.uploadedFiles}}_showPreview(){const r=this._gatherFormData();this._updatePreviewContent(r),this.previewModal.classList.add("visible"),this._lockBodyScroll()}_hidePreview(){this.previewModal.classList.remove("visible"),this._unlockBodyScroll(),this._currentPreviewIndex=0}_lockBodyScroll(){document.body.style.overflow="hidden";const r=window.innerWidth-document.documentElement.clientWidth;document.body.style.paddingRight=`${r}px`}_unlockBodyScroll(){document.body.style.overflow="",document.body.style.paddingRight=""}_updatePreviewContent(r){const e=this.shadowRoot.querySelector(".preview-title");e&&(e.textContent=r.title||"Untitled");const n=this.shadowRoot.querySelector(".preview-price");n&&(n.textContent=r.price?`$${parseFloat(r.price).toFixed(2)}`:"$0.00");const i=this.shadowRoot.querySelector(".preview-condition");i&&(i.textContent=r.condition||"No condition selected");const a=this.shadowRoot.querySelector(".preview-category");a&&(a.textContent=r.category||"No category selected");const s=this.shadowRoot.querySelector(".preview-description");s&&(s.textContent=r.description||"No description provided"),this._updatePreviewGallery(r.files)}_updatePreviewGallery(r){const e=this.shadowRoot.querySelector(".preview-gallery-main"),n=this.shadowRoot.querySelector(".preview-thumb-strip");if(!e||!n)return;if(e.innerHTML="",n.innerHTML="",!r||r.length===0){e.innerHTML='<div class="no-media">No media uploaded</div>';return}const i=r[0];let a;i.type.startsWith("image/")?(a=document.createElement("img"),a.className="preview-main-image",a.src=URL.createObjectURL(i),a.alt="Product preview"):i.type.startsWith("video/")&&(a=document.createElement("video"),a.className="preview-main-video",a.src=URL.createObjectURL(i),a.controls=!0,a.muted=!0),a&&e.appendChild(a),r.length>1&&r.forEach((s,o)=>{let t;s.type.startsWith("image/")?(t=document.createElement("img"),t.src=URL.createObjectURL(s),t.alt=`Thumbnail ${o+1}`):s.type.startsWith("video/")&&(t=document.createElement("video"),t.src=URL.createObjectURL(s),t.muted=!0),t&&(t.className=o===this._currentPreviewIndex?"active":"",o===0&&(t.style.border="3px solid #f3c114",t.title="Main Photo (Thumbnail)"),t.addEventListener("click",()=>{this._currentPreviewIndex=o,e.innerHTML="";let l;s.type.startsWith("image/")?(l=document.createElement("img"),l.className="preview-main-image",l.src=URL.createObjectURL(s),l.alt="Product preview"):s.type.startsWith("video/")&&(l=document.createElement("video"),l.className="preview-main-video",l.src=URL.createObjectURL(s),l.controls=!0,l.muted=!0),l&&e.appendChild(l),n.querySelectorAll("img, video").forEach((d,p)=>{d.className=p===o?"active":"",p===0?(d.style.border="3px solid #f3c114",d.title="Main Photo (Thumbnail)"):(d.style.border="2px solid transparent",d.title="")})}),n.appendChild(t))})}_handleSubmit(r){r.preventDefault();const e=this._gatherFormData(),n=this._validateForm(e);n.length===0?this.dispatchEvent(new CustomEvent("listing-submit",{bubbles:!0,composed:!0,detail:e})):alert(n.join(`
`))}disconnectedCallback(){this._unlockBodyScroll()}}customElements.define("listing-form",u);
