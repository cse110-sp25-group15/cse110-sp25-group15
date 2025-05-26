import"./bottom-nav.js";const d=`<form class="listing-form">\r
    <div class="form-columns">\r
        <div class="left-column">\r
            <div class="media-upload">\r
                <h2>Media Upload</h2>\r
                <div class="upload-container">\r
                    <label\r
                        for="media-upload"\r
                        class="media-label"\r
                        title="Upload Media"\r
                    >\r
                        <span class="folder-icon">Choose or Drag a File Here</span> \r
                        <input\r
                            type="file"\r
                            id="media-upload"\r
                            name="media"\r
                            accept="image/*,video/*"\r
                            multiple\r
                            hidden\r
                            required\r
                        >\r
\r
                    </label>\r
                    \r
                </div>\r
            </div>\r
        </div>\r
        <div class="right-column">\r
            <div class="field-cluster">\r
                <label>\r
                    Title\r
                    <input\r
                        type="text"\r
                        name="title"\r
                        placeholder="Untitled"\r
                        required\r
                    >\r
                </label>\r
                <label>\r
                    Price\r
                    <input\r
                        type="text"\r
                        name="price"\r
                        placeholder="$00.00"\r
                        required\r
                    >\r
                </label>\r
                <label>\r
                    Category\r
                    <select name="category" required>\r
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
                </label>\r
                <label>\r
                    Condition\r
                    <select name="condition" required>\r
                        <option value="">Select condition</option>\r
                        <option value="New">New</option>\r
                        <option value="Like New">Like New</option>\r
                        <option value="Lightly Used">Lightly Used</option>\r
                        <option value="Used">Used</option>\r
                    </select>\r
                </label>\r
            </div>\r
\r
            <div class="description">\r
                <label for="description">Description</label>\r
                <textarea\r
                    id="description"\r
                    name="description"\r
                    rows="5"\r
                    placeholder="Describe your item..."\r
                ></textarea>\r
                <div id="word-count">0/250</div>\r
            </div>\r
\r
            <div class="actions">\r
                \r
                <button\r
                    type="button"\r
                    id="preview-button"\r
                    class="pre-button"\r
                >See Preview</button>\r
                \r
                <button type="submit" class="comp-button">Complete</button>\r
            </div>\r
        </div>\r
    </div>\r
</form>\r
<div class="preview-modal" id="preview-modal">\r
    <div class="preview-content">\r
        <div class="preview-header">\r
            <h1>UCSD MARKETPLACE</h1>\r
            <div class="draft-label">DRAFT PREVIEW</div>\r
        </div>\r
        <div class="preview-title">Untitled</div>\r
        <div class="preview-media">\r
            \r
        </div>\r
        <div class="preview-body">\r
            <div class="preview-price">$00.00</div>\r
            <div class="preview-meta">\r
                <span>Just Now</span>\r
                <span>•</span>\r
                <span>Location</span>\r
                <span>•</span>\r
                <span>Condition</span>\r
            </div>\r
            \r
            <div class="preview-description">\r
                Item description will appear here...\r
            </div>\r
            \r
            <div class="preview-seller-info">\r
                <h3>Seller's Info</h3>\r
                <p>Phone Number: Not provided</p>\r
                <p>Instagram: Not provided</p>\r
            </div>\r
        </div>\r
        \r
        <div class="preview-actions">\r
            <button class="close-preview">Close Preview</button>\r
        </div>\r
    </div>\r
</div>`,p=`:host {\r
    --blue: #04133B;\r
    --gold: #F3C114;\r
    --white: #FFFFFF;\r
    --navy-text: #04133B;\r
    --light-gray: #f5f5f5;\r
\r
   font-family: sans-serif;\r
}\r
\r
.listing-form {\r
    display: flex;\r
    flex-direction: column;\r
    gap: 1.5rem;\r
}\r
\r
.form-columns {\r
    display: flex;\r
    gap: 2rem;\r
}\r
\r
.left-column {\r
    flex: 1;\r
    background-color: rgb(157, 156, 156);\r
}\r
\r
.right-column {\r
    flex: 1;\r
    display: flex;\r
    flex-direction: column;\r
    gap: 1rem;\r
}\r
\r
.media-upload {\r
    height: 100%;\r
    display: flex;\r
    flex-direction: column;\r
    align-items: center;\r
}\r
\r
.media-label {\r
    display: flex;\r
    flex-direction: column;\r
    align-items: center;\r
    justify-content: center;\r
    gap: 0.5rem;\r
    cursor: pointer;\r
    color: var(--blue);\r
    font-size: 1rem;\r
    padding: 2rem;\r
    border: 2px dashed var(--blue);\r
    border-radius: 8px;\r
    background-color: var(--light-gray);\r
    height: 100%;\r
    width: 100%;\r
    text-align: center;\r
}\r
\r
.folder-icon::before{\r
    content: "\\1f4C1";\r
    font-size: 1.5rem;\r
}\r
\r
.preview-container {\r
    display: flex;\r
    flex-wrap: wrap;\r
    gap: 0.5rem;\r
    margin-top: 1rem;\r
    min-height: 80px;\r
}\r
\r
.thumbnail {\r
    width: 80px;\r
    height: 80px;\r
    object-fit: cover;\r
    border: 1px solid var(--blue);\r
    border-radius: 4px;\r
    background-color: white;\r
}\r
\r
.field-cluster {\r
    display: flex;\r
    flex-direction: column;\r
}\r
\r
.field-cluster label {\r
    font-weight: 600;\r
    color: var(--navy-text);\r
    margin-bottom: 0.25rem;\r
}\r
\r
input[type="text"],\r
select,\r
textarea {\r
    padding: 0.75rem;\r
    border: 1px solid var(--blue);\r
    border-radius: 8px;\r
    font-size: 1rem;\r
    margin-top: 0.25rem;\r
}\r
\r
.description {\r
    display: flex;\r
    flex-direction: column;\r
    position: relative;\r
}\r
\r
#word-count {\r
    text-align: right;\r
    font-size: 0.875rem;\r
    color: var(--navy-text);\r
    margin-top: 0.25rem;\r
}\r
\r
.actions {\r
    display: flex;\r
    justify-content: space-between;\r
    gap: 1rem;\r
}\r
\r
#preview-button,\r
.comp-button {\r
    padding: 0.75rem 1.5rem;\r
    border-radius: 8px;\r
    font-size: 1rem;\r
    font-weight: bold;\r
    cursor: pointer;\r
    background: var(--gold);\r
    color: var(--navy-text);\r
    border: 2px solid var(--blue);\r
}\r
\r
.comp-button:hover {\r
    background-color: var(--navy-text);\r
    color: var(--white);\r
}\r
\r
#preview-button{\r
    background: var(--gold);\r
    border: 2px solid var(--blue);\r
    color:var(--navy-text);\r
}\r
\r
#preview-button:hover{\r
    background-color: var(--navy-text);\r
    color: var(--white); \r
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
}\r
\r
.preview-modal.visible {\r
    display: flex;\r
}\r
\r
.preview-content {\r
    background: white;\r
    width: 90%;\r
    max-width: 600px;\r
    max-height: 90vh;\r
    overflow-y: auto;\r
    padding: 2rem;\r
    border-radius: 8px;\r
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);\r
    position: relative;\r
}\r
\r
.preview-header {\r
    text-align: center;\r
    margin-bottom: 1.5rem;\r
}\r
\r
.preview-header h1 {\r
    color: var(--blue);\r
    margin: 0;\r
    font-size: 2rem;\r
}\r
\r
.draft-label {\r
    background: var(--gold);\r
    color: var(--navy-text);\r
    padding: 0.25rem 1rem;\r
    border-radius: 20px;\r
    font-size: 0.9rem;\r
    font-weight: bold;\r
    display: inline-block;\r
    margin-top: 0.5rem;\r
}\r
\r
.preview-price {\r
    font-size: 2rem;\r
    color: var(--gold);\r
    font-weight: bold;\r
    margin: 1rem 0;\r
}\r
\r
.preview-meta {\r
    color: #666;\r
    margin-bottom: 1.5rem;\r
    display: flex;\r
    gap: 0.5rem;\r
    flex-wrap: wrap;\r
}\r
\r
.preview-description {\r
    line-height: 1.6;\r
    margin-bottom: 2rem;\r
    white-space: pre-wrap;\r
}\r
\r
.preview-seller-info {\r
    background: #f5f5f5;\r
    padding: 1rem;\r
    border-radius: 8px;\r
}\r
\r
.preview-seller-info h3 {\r
    margin-top: 0;\r
    color: var(--blue);\r
}\r
\r
.close-preview {\r
    background: var(--blue);\r
    color: white;\r
    border: none;\r
    padding: 0.75rem 1.5rem;\r
    border-radius: 4px;\r
    font-weight: bold;\r
    cursor: pointer;\r
    margin-top: 1.5rem;\r
    width: 100%;\r
}\r
\r
.close-preview:hover {\r
    background: #030d2b;\r
}\r
\r
.preview-title {\r
    font-size: 1.5rem;\r
    font-weight: bold;\r
    color: var(--blue);\r
    margin-bottom: 0.5rem;\r
}\r
\r
.preview-media {\r
    display: flex;\r
    gap: 0.5rem;\r
    flex-wrap: wrap;\r
    margin: 1rem 0;\r
}\r
\r
.preview-thumbnail {\r
    width: 100px;\r
    height: 100px;\r
    object-fit: cover;\r
    border-radius: 4px;\r
    border: 1px solid #ddd;\r
}\r
\r
.no-media {\r
    color: #666;\r
    font-style: italic;\r
}\r
\r
/* For video thumbnails */\r
.preview-thumbnail[controls] {\r
    background: #000;\r
}\r
\r
header{\r
    position: fixed;\r
    top: 0;\r
    left: 0;\r
    width: 100%;\r
    z-index: 10;\r
}\r
.site-header {\r
  height: var(--nav-h);\r
  background: var(--blue);\r
  display: grid;\r
  grid-template-columns: auto 1fr auto;\r
  align-items: center;\r
  padding: 0 1rem;\r
  z-index: 10;\r
}\r
\r
.site-header .logo {\r
  display: inline-flex;\r
  align-items: center;\r
  color: var(--gold);\r
  font-weight: bold;\r
}\r
\r
.site-header .logo img {\r
  height: 32px;\r
  margin-right: 0.5rem;\r
}\r
\r
.site-header .logo span {\r
  font-size: 1.2rem;\r
}\r
\r
.main-nav {\r
  justify-self: center;\r
  display: flex;\r
  gap: 2rem;\r
}\r
\r
.main-nav a {\r
  color: var(--gold);\r
  text-decoration: none;\r
  font-size: 0.9rem;\r
  letter-spacing: 0.05em;\r
  text-transform: uppercase;\r
}\r
\r
.user-icons {\r
  justify-self: end;\r
  display: flex;\r
  align-items: center;\r
  gap: 1rem;\r
}`;class c extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`<style>${p}</style>${d}`,this._setupForm()}_setupForm(){this.form=this.shadowRoot.querySelector(".listing-form"),this.wordCounter=this.shadowRoot.querySelector("#word-count"),this.descriptionField=this.shadowRoot.querySelector("#description"),this.mediaInput=this.shadowRoot.querySelector("#media-upload"),this.previewModal=this.shadowRoot.querySelector("#preview-modal"),this.closePreviewButton=this.shadowRoot.querySelector(".close-preview"),this.previewButton=this.shadowRoot.querySelector("#preview-button"),this.form.addEventListener("submit",this._handleSubmit.bind(this)),this.descriptionField.addEventListener("input",this._updateWordCount.bind(this)),this.mediaInput.addEventListener("change",this._previewMedia.bind(this)),this.previewButton.addEventListener("click",this._showPreview.bind(this)),this.closePreviewButton.addEventListener("click",this._hidePreview.bind(this))}_updateWordCount(){const r=this.descriptionField.value.trim().split(/\s+/).filter(Boolean).length;this.wordCounter.textContent=`${r}/250`}_previewMedia(){const r=this.mediaInput.files;this.previewContainer.innerHTML="",r.length!==0&&Array.from(r).forEach(e=>{const n=e.type.startsWith("image/")?document.createElement("img"):e.type.startsWith("video/")?document.createElement("video"):null;if(n){const t=document.createElement("div");t.className="thumbnail-container",n.className="thumbnail",n.src=URL.createObjectURL(e),n.tagName==="VIDEO"&&(n.controls=!0,n.muted=!0,n.loop=!0);const i=document.createElement("button");i.className="remove-thumbnail",i.innerHTML="&times;",i.addEventListener("click",a=>{a.stopPropagation(),t.remove(),this._updateFileList()}),t.appendChild(n),t.appendChild(i),this.previewContainer.appendChild(t),n.onload=n.onloadeddata=()=>URL.revokeObjectURL(n.src)}})}_validateForm(r){const e=[];return(!r.title||r.title.length<3)&&e.push("Title must be at least 3 characters."),/^[0-9]+(\.[0-9]{1,2})?$/.test(r.price)||e.push("Price must be a valid number."),r.description.split(/\s+/).filter(Boolean).length>250&&e.push("Description exceeds 250 words."),e}_gatherFormData(){return{title:this.form.querySelector('input[name="title"]').value.trim(),price:this.form.querySelector('input[name="price"]').value.trim(),category:this.form.querySelector('select[name="category"]').value,condition:this.form.querySelector('select[name="condition"]').value,description:this.form.querySelector('textarea[name="description"]').value.trim(),files:Array.from(this.mediaInput.files)}}_showPreview(){const r=this._gatherFormData();this._updatePreviewContent(r),this.previewModal.classList.add("visible")}_hidePreview(){this.previewModal.classList.remove("visible")}_updatePreviewContent(r){const e=this.shadowRoot.querySelector(".preview-content"),n=e.querySelector(".preview-title");n&&(n.textContent=r.title||"Untitled"),e.querySelector(".preview-price").textContent=r.price?`$${parseFloat(r.price).toFixed(2)}`:"$00.00";const t=e.querySelectorAll(".preview-meta span");t[0].textContent="Just Now",t[2].textContent=r.category||"Category",t[4].textContent=r.condition||"Condition",e.querySelector(".preview-description").textContent=r.description||"No description provided";const i=e.querySelector(".preview-seller-info");i.querySelector("p:nth-child(2)").textContent=`Phone Number: ${r.phone||"Not provided"}`,i.querySelector("p:nth-child(3)").textContent=`Instagram: ${r.instagram||"Not provided"}`;const a=e.querySelector(".preview-media");a&&(a.innerHTML="",r.files&&r.files.length>0?r.files.forEach(l=>{const s=URL.createObjectURL(l),o=l.type.startsWith("image/")?document.createElement("img"):document.createElement("video");o.src=s,o.className="preview-thumbnail",o.tagName==="VIDEO"&&(o.controls=!0,o.muted=!0),o.onload=()=>URL.revokeObjectURL(s),a.appendChild(o)}):a.innerHTML='<div class="no-media">No media uploaded</div>')}_handleSubmit(r){console.log("Form submitted"),r.preventDefault();const e=this._gatherFormData(),n=this._validateForm(e);n.length===0?this.dispatchEvent(new CustomEvent("listing-submit",{bubbles:!0,composed:!0,detail:e})):alert(n.join(`
`))}}customElements.define("listing-form",c);
