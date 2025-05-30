import"./bottom-nav.js";import"./main2.js";import"https://cdn.skypack.dev/heic2any";import"https://cdn.skypack.dev/browser-image-compression";const l=`<form class="listing-form">\r
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
                    <option value="Dorm_life">Dorm Life</option>\r
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
<!-- Preview Modal -->\r
<div class="preview-modal" id="preview-modal">\r
    <div class="preview-content">\r
        <div class="preview-header">\r
            <h1>UCSD MARKETPLACE</h1>\r
            <div class="draft-label">DRAFT PREVIEW</div>\r
        </div>\r
        <div class="preview-title">Untitled</div>\r
        <div class="preview-media"></div>\r
        <div class="preview-body">\r
            <div class="preview-price">$0.00</div>\r
            <div class="preview-meta">\r
                <span>Just Now</span>\r
                <span>•</span>\r
                <span>No category</span>\r
                <span>•</span>\r
                <span>No condition</span>\r
            </div>\r
            <div class="preview-description">\r
                Item description will appear here...\r
            </div>\r
            <div class="preview-seller-info">\r
                <h3>Seller's Info</h3>\r
                <p>Contact information will be displayed here</p>\r
            </div>\r
        </div>\r
        <div class="preview-actions">\r
            <button class="close-preview">Close Preview</button>\r
        </div>\r
    </div>\r
</div>`,d=`:host {\r
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
/* Preview Modal */\r
.preview-modal {\r
  position: fixed;\r
  top: 0;\r
  left: 0;\r
  width: 100%;\r
  height: 100%;\r
  background: rgba(0, 0, 0, 0.8);\r
  z-index: 1000;\r
  display: none;\r
  justify-content: center;\r
  align-items: center;\r
  padding: 2rem;\r
}\r
\r
.preview-modal.visible {\r
  display: flex;\r
}\r
\r
.preview-content {\r
  background: white;\r
  width: 100%;\r
  max-width: 700px;\r
  max-height: 90vh;\r
  overflow-y: auto;\r
  border-radius: 12px;\r
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);\r
}\r
\r
.preview-header {\r
  text-align: center;\r
  padding: 2rem;\r
  border-bottom: 1px solid #e9ecef;\r
}\r
\r
.preview-header h1 {\r
  color: var(--blue);\r
  margin: 0 0 0.5rem 0;\r
  font-size: 1.5rem;\r
}\r
\r
.draft-label {\r
  background: var(--gold);\r
  color: var(--navy-text);\r
  padding: 0.25rem 1rem;\r
  border-radius: 20px;\r
  font-size: 0.85rem;\r
  font-weight: 600;\r
  display: inline-block;\r
}\r
\r
.preview-title {\r
  font-size: 1.75rem;\r
  font-weight: 600;\r
  color: var(--navy-text);\r
  padding: 1.5rem 2rem 0;\r
}\r
\r
.preview-media {\r
  display: flex;\r
  gap: 0.5rem;\r
  flex-wrap: wrap;\r
  padding: 1rem 2rem;\r
}\r
\r
.preview-thumbnail {\r
  width: 120px;\r
  height: 120px;\r
  object-fit: cover;\r
  border-radius: 8px;\r
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\r
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
.preview-body {\r
  padding: 0 2rem 2rem;\r
}\r
\r
.preview-price {\r
  font-size: 2rem;\r
  color: var(--gold);\r
  font-weight: 600;\r
  margin: 1rem 0;\r
}\r
\r
.preview-meta {\r
  color: #6c757d;\r
  margin-bottom: 1.5rem;\r
  display: flex;\r
  gap: 0.5rem;\r
  flex-wrap: wrap;\r
  font-size: 0.9rem;\r
}\r
\r
.preview-description {\r
  line-height: 1.6;\r
  margin-bottom: 2rem;\r
  white-space: pre-wrap;\r
  color: #495057;\r
}\r
\r
.preview-seller-info {\r
  background: #f8f9fa;\r
  padding: 1.5rem;\r
  border-radius: 8px;\r
}\r
\r
.preview-seller-info h3 {\r
  margin: 0 0 0.5rem 0;\r
  color: var(--blue);\r
  font-size: 1.1rem;\r
}\r
\r
.preview-seller-info p {\r
  margin: 0;\r
  color: #6c757d;\r
}\r
\r
.preview-actions {\r
  padding: 1.5rem 2rem;\r
  border-top: 1px solid #e9ecef;\r
}\r
\r
.close-preview {\r
  background: var(--blue);\r
  color: white;\r
  border: none;\r
  padding: 0.875rem 1.75rem;\r
  border-radius: 8px;\r
  font-weight: 500;\r
  cursor: pointer;\r
  width: 100%;\r
  font-size: 1rem;\r
  transition: background 0.2s ease;\r
}\r
\r
.close-preview:hover {\r
  background: #030d2b;\r
}\r
\r
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
}`;class p extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`<style>${d}</style>${l}`,this.uploadedFiles=[],this._setupForm()}_setupForm(){this.form=this.shadowRoot.querySelector(".listing-form"),this.wordCounter=this.shadowRoot.querySelector("#word-count"),this.descriptionField=this.shadowRoot.querySelector("#description"),this.mediaInput=this.shadowRoot.querySelector("#media-upload"),this.previewModal=this.shadowRoot.querySelector("#preview-modal"),this.closePreviewButton=this.shadowRoot.querySelector(".close-preview"),this.previewContainer=this.shadowRoot.querySelector(".preview-container"),this.previewButton=this.shadowRoot.querySelector("#preview-button"),this.uploadArea=this.shadowRoot.querySelector(".upload-area"),this.uploadLabel=this.shadowRoot.querySelector(".upload-label"),this.form.addEventListener("submit",this._handleSubmit.bind(this)),this.descriptionField.addEventListener("input",this._updateWordCount.bind(this)),this.mediaInput.addEventListener("change",this._handleFileSelect.bind(this)),this.previewButton.addEventListener("click",this._showPreview.bind(this)),this.closePreviewButton.addEventListener("click",this._hidePreview.bind(this)),this._setupDragAndDrop(),this._setupPriceInput()}_setupDragAndDrop(){const r=this.uploadArea;["dragenter","dragover","dragleave","drop"].forEach(e=>{r.addEventListener(e,this._preventDefaults,!1)}),["dragenter","dragover"].forEach(e=>{r.addEventListener(e,()=>{r.classList.add("drag-hover")},!1)}),["dragleave","drop"].forEach(e=>{r.addEventListener(e,()=>{r.classList.remove("drag-hover")},!1)}),r.addEventListener("drop",this._handleDrop.bind(this),!1)}_preventDefaults(r){r.preventDefault(),r.stopPropagation()}_handleDrop(r){const n=r.dataTransfer.files;this._processFiles(n)}_handleFileSelect(r){const e=r.target.files;this._processFiles(e)}_processFiles(r){const e=Array.from(r).filter(n=>{const t=n.type.startsWith("image/"),o=n.type.startsWith("video/");return t||o});if(e.length===0){alert("Please select valid image or video files");return}this.uploadedFiles=[...this.uploadedFiles,...e],this._displayUploadedFiles(),this._updateUploadLabel()}_displayUploadedFiles(){this.previewContainer.innerHTML="",this.uploadedFiles.forEach((r,e)=>{const n=document.createElement("div");n.className="file-card";const t=document.createElement("div");if(t.className="thumbnail",r.type.startsWith("image/")){const a=document.createElement("img");a.src=URL.createObjectURL(r),t.appendChild(a)}else if(r.type.startsWith("video/")){const a=document.createElement("video");a.src=URL.createObjectURL(r),a.muted=!0,t.appendChild(a);const i=document.createElement("div");i.className="play-icon",i.innerHTML="▶",t.appendChild(i)}const o=document.createElement("div");o.className="file-name",o.textContent=r.name.length>20?r.name.substring(0,17)+"...":r.name;const s=document.createElement("button");s.className="remove-btn",s.innerHTML="×",s.addEventListener("click",()=>this._removeFile(e)),n.appendChild(t),n.appendChild(o),n.appendChild(s),this.previewContainer.appendChild(n)})}_removeFile(r){this.uploadedFiles.splice(r,1),this._displayUploadedFiles(),this._updateUploadLabel(),this.uploadedFiles.length===0&&(this.mediaInput.value="")}_updateUploadLabel(){const r=this.uploadLabel,e=this.uploadedFiles.length;e===0?r.innerHTML=`
        <div class="upload-icon">📁</div>
        <div class="upload-text">
          <p class="upload-main">Drag & Drop your files here</p>
          <p class="upload-sub">or click to browse</p>
        </div>
      `:r.innerHTML=`
        <div class="upload-icon">✓</div>
        <div class="upload-text">
          <p class="upload-main">${e} file${e>1?"s":""} selected</p>
          <p class="upload-sub">Drop more files or click to add</p>
        </div>
      `}_setupPriceInput(){this.form.querySelector('input[name="price"]').addEventListener("input",e=>{let n=e.target.value.replace(/[^\d.]/g,"");const t=n.split(".");t.length>2&&(n=t[0]+"."+t.slice(1).join("")),t[1]&&t[1].length>2&&(n=t[0]+"."+t[1].substring(0,2)),e.target.value=n})}_updateWordCount(){const e=this.descriptionField.value.trim().split(/\s+/).filter(Boolean).length;this.wordCounter.textContent=`${e}/250`,e>250?this.wordCounter.classList.add("exceeded"):this.wordCounter.classList.remove("exceeded")}_validateForm(r){const e=[];return(!r.title||r.title.length<3)&&e.push("Title must be at least 3 characters."),(!r.price||isNaN(parseFloat(r.price)))&&e.push("Please enter a valid price."),r.category||e.push("Please select a category."),r.condition||e.push("Please select a condition."),r.description.split(/\s+/).filter(Boolean).length>250&&e.push("Description exceeds 250 words."),e}_gatherFormData(){return{title:this.form.querySelector('input[name="title"]').value.trim(),price:this.form.querySelector('input[name="price"]').value.trim(),category:this.form.querySelector('select[name="category"]').value,condition:this.form.querySelector('select[name="condition"]').value,description:this.form.querySelector('textarea[name="description"]').value.trim(),files:this.uploadedFiles}}_showPreview(){const r=this._gatherFormData();this._updatePreviewContent(r),this.previewModal.classList.add("visible")}_hidePreview(){this.previewModal.classList.remove("visible")}_updatePreviewContent(r){const e=this.shadowRoot.querySelector(".preview-content"),n=e.querySelector(".preview-title");n&&(n.textContent=r.title||"Untitled"),e.querySelector(".preview-price").textContent=r.price?`$${parseFloat(r.price).toFixed(2)}`:"$0.00";const t=e.querySelectorAll(".preview-meta span");t[0].textContent="Just Now",t[2].textContent=r.category||"No category",t[4].textContent=r.condition||"No condition",e.querySelector(".preview-description").textContent=r.description||"No description provided";const o=e.querySelector(".preview-media");o&&(o.innerHTML="",r.files&&r.files.length>0?r.files.forEach(s=>{const a=URL.createObjectURL(s),i=s.type.startsWith("image/")?document.createElement("img"):document.createElement("video");i.src=a,i.className="preview-thumbnail",i.tagName==="VIDEO"&&(i.controls=!0,i.muted=!0),i.onload=()=>URL.revokeObjectURL(a),o.appendChild(i)}):o.innerHTML='<div class="no-media">No media uploaded</div>')}_handleSubmit(r){r.preventDefault();const e=this._gatherFormData(),n=this._validateForm(e);n.length===0?this.dispatchEvent(new CustomEvent("listing-submit",{bubbles:!0,composed:!0,detail:e})):alert(n.join(`
`))}}customElements.define("listing-form",p);
