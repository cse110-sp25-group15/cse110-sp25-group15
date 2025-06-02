import"./bottom-nav.js";import"./main2.js";import"./product-card.js";import"https://cdn.skypack.dev/heic2any";import"https://cdn.skypack.dev/browser-image-compression";const s=`\r
\r
<section class="browse-area">\r
    <div class="browse-header">\r
        <div class="header-top">\r
            <h1 class="browse-title">Listings</h1>\r
            <p class="browse-tagline">Discover the latest campus essentials today!</p>\r
        </div>\r
    </div>\r
    <div class="categories">\r
        <!-- Categories go here - KEEP ORIGINAL STRUCTURE -->\r
        <div class="category-list">\r
            <category-button>All</category-button>\r
            <category-button>Sports</category-button>\r
            <category-button>Books</category-button>\r
            <category-button>Supplies</category-button>\r
            <category-button>Tech</category-button>\r
            <category-button>Transportation</category-button>\r
            <category-button>Apparel</category-button>\r
            <category-button>Dorm Life</category-button>\r
            <category-button>Furniture</category-button>\r
            <category-button>Other</category-button>\r
        </div>\r
\r
        <!-- Sort Options - KEEP ORIGINAL -->\r
        <div class="sort-option">\r
            <label for="dropdown"></label>\r
            <select id="dropdown" name="options">\r
                <option value="featured">Featured</option>\r
                <option class="option-value" value="new">Newest</option>\r
                <option value="low">Price: Low to High</option>\r
                <option value="high">Price: High to Low</option>\r
            </select>\r
        </div>\r
    </div>\r
\r
    <div class="products-container">\r
        <!-- JS will load the products -->\r
    </div>\r
    <page-switcher id="pagination"></page-switcher>\r
</section>`,d=`:host {\r
  --gap: 16px;\r
  --max-columns: 6;\r
  --max-container-width: 1800px;\r
}\r
\r
.browse-area {\r
  display: block;\r
  background-color: white;\r
  width: 100%;\r
  padding: 0 5%;\r
  box-sizing: border-box; \r
}\r
\r
/* Header Section - Tenrevel Style */\r
.browse-header {\r
  background: white;\r
  width: 100%;\r
  max-width: var(--max-container-width);\r
  padding: 2rem 0;\r
  border-bottom: 1px solid var(--border-light);\r
  justify-self: center;\r
}\r
\r
.header-top {\r
  display: flex;\r
  justify-content: space-between;\r
  align-items: center;\r
  width: 100%;\r
}\r
\r
.browse-title {\r
  font-size: 2rem;\r
  font-weight: 600;\r
  color: var(--text-dark);\r
  margin: 0;\r
}\r
\r
.browse-tagline {\r
  color: var(--text-dark);\r
  font-size: 1rem;\r
  font-weight: 400;\r
  margin: 0;\r
  max-width: 400px;\r
}\r
\r
/* Categories Section - Keep Original Structure */\r
.categories {\r
  position: sticky;\r
  top: 76px;\r
  z-index: 10;\r
  display: flex;\r
  gap: 1rem;\r
  align-items: center;\r
  justify-content: space-between;\r
  background-color: white;\r
  width: 100%;\r
  max-width: var(--max-container-width);\r
  margin: 0 auto;\r
  padding: 1.5rem 0;\r
  /* Remove both box-shadow and border-bottom */\r
}\r
\r
\r
.category-list {\r
  display: flex;\r
  gap: 16px;\r
  flex-wrap: wrap;\r
  justify-content: flex-start;\r
  align-items: center;\r
}\r
\r
\r
#dropdown {\r
  padding: 0.5rem 2rem 0.5rem 0.75rem;\r
  background-color: white;\r
  color: var(--text-dark);\r
  font-weight: 600;\r
  border-radius: 4px;\r
  cursor: pointer;\r
  font-size: 0.9rem;\r
  min-width: 140px; \r
}\r
\r
#dropdown option {\r
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\r
  font-weight: 550;\r
}\r
\r
.products-container {\r
  display: flex;\r
  flex-wrap: wrap;\r
  justify-content: flex-start;\r
  align-content: flex-start;\r
  gap: var(--gap);\r
  background: white;\r
  width: 100%; \r
  margin: 1rem auto 0 auto;\r
  padding: var(--gap);\r
  box-sizing: border-box;\r
}\r
/* Product Cards - Responsive with fixed column counts */\r
.card {\r
  aspect-ratio: 3 / 4;\r
  box-sizing: border-box;\r
  background: white;\r
  border-radius: 8px;\r
}\r
\r
.card:hover {\r
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\r
}\r
\r
/* 2 columns */\r
@media (max-width: 950px) {\r
  .card { width: calc(50% - (var(--gap) / 2)); }\r
}\r
/* 3 columns */\r
@media (min-width: 951px) and (max-width: 1250px) {\r
  .card { width: calc(33.3333% - (var(--gap) * 2 / 3)); }\r
}\r
/* 4 columns */\r
@media (min-width: 1251px) and (max-width: 1550px) {\r
  .card { width: calc(25% - (var(--gap) * 3 / 4)); }\r
}\r
/* 5 columns */\r
@media (min-width: 1551px) and (max-width: 1950px) {\r
  .card { width: calc(20% - (var(--gap) * 4 / 5)); }\r
}\r
/* 6 columns (maximum) */\r
@media (min-width: 1951px) {\r
  .card { width: calc(16.6667% - (var(--gap) * 5 / 6)); }\r
  .products-container { max-width: var(--max-container-width); }\r
}\r
`;class l extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});const r=document.createElement("template");r.innerHTML=`
          <style>${d}</style>
          ${s}
      `,this.shadowRoot.appendChild(r.content.cloneNode(!0))}static get observedAttributes(){return["new","low","high"]}connectedCallback(){console.log("BrowsePage connected"),this.shadowRoot.getElementById("dropdown").addEventListener("change",n=>{const e=n.target.value;console.log(n.target.value),(e==="new"||e==="low"||e==="high"||e==="featured")&&this.dispatchEvent(new CustomEvent("sort-change",{bubbles:!0,composed:!0,detail:{sortBy:e}}))}),setTimeout(()=>{const n=this.shadowRoot.querySelector("category-button");n&&n.setAttribute("selected","")},100)}attributeChangedCallback(r,n,e){}}customElements.define("browse-page",l);const c=`<div class="category-button">\r
    <button class="label" type="button">\r
        <slot></slot>\r
    </button>\r
</div>`,h=`.label {\r
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\r
    padding: 6px 12px;\r
    font-weight: 500;\r
    color: #666666;\r
    background-color: transparent;\r
    border: none;\r
    font-size: 1rem;\r
    cursor: pointer;\r
    transition: color 0.2s ease;\r
    white-space: nowrap;\r
}\r
\r
.label:hover {\r
    color: #1a1a1a;\r
}\r
\r
.label.selected {\r
    color: #04133B;\r
    font-weight: 600;\r
    border-bottom: 2px solid #04133B;\r
}`;class p extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});const r=document.createElement("template");r.innerHTML=`
            <style>${h}</style>
            ${c}
        `,this.shadowRoot.appendChild(r.content.cloneNode(!0))}static get observedAttributes(){return["selected"]}connectedCallback(){this.shadowRoot.querySelector(".label").addEventListener("click",()=>{const e=this.shadowRoot.querySelector("slot").assignedNodes().map(t=>t.textContent).join("").trim(),o=new CustomEvent("filter-changed",{bubbles:!0,composed:!0,detail:{category:e}});this.dispatchEvent(o)})}attributeChangedCallback(r,n,e){if(r==="selected"){const o=this.hasAttribute("selected");this.updateSelected(o)}}updateSelected(r){this.shadowRoot.querySelector(".label").classList.toggle("selected",r)}}customElements.define("category-button",p);const m=`<div class="overlay">\r
    <section class="product-detail">\r
        <button\r
            class="close-btn"\r
            type="button"\r
            aria-label="Close"\r
        >&times;</button>\r
        <div class="gallery" tabindex="0">\r
            <div class="gallery-main">\r
                <img\r
                    class="main-image"\r
                    src=""\r
                    alt="Product image"\r
                    width="400"\r
                    height="400"\r
                    loading="lazy"\r
                    decoding="async"\r
                >\r
            </div>\r
            <div class="thumb-strip"></div>\r
        </div>\r
        <div class="meta-panel">\r
            <h1 class="product-name"></h1>\r
            <div class="price"></div>\r
            <div class="meta-table">\r
                <div class="date"></div>\r
                <div class="condition"></div>\r
            </div>\r
            <b class="description-title">Description:</b>\r
            <p class="description-block"></p>\r
            <div class="contact-box">\r
                <textarea\r
                    class="contact-message"\r
                    rows="2"\r
                    placeholder="Hi, is this still available?"\r
                ></textarea>\r
                <button class="send-btn" type="button">\r
                    <svg\r
                        xmlns="http://www.w3.org/2000/svg"\r
                        viewBox="0 0 24 24"\r
                        fill="none"\r
                        stroke="currentColor"\r
                        stroke-width="2"\r
                        stroke-linecap="round"\r
                        stroke-linejoin="round"\r
                    >\r
                        <path d="m3 3 3 9-3 9 19-9Z"/>\r
                        <path d="m6 12 13 0"/>\r
                    </svg>\r
                    Send Message\r
                </button>\r
            </div>\r
            <slot></slot>\r
        </div>\r
    </section>\r
</div>`,g=`/* UCSD Palette */\r
:host {\r
  --ucsd-blue: var(--blue);\r
  --ucsd-gold: var(--gold);\r
  --ucsd-white: var(--white);\r
  --ucsd-gold-dark: #B89B0E;\r
  font-family: system-ui, sans-serif;\r
  display: block;\r
}\r
\r
.overlay {\r
  position: fixed;\r
  top: 0;\r
  left: 0;\r
  width: 100%;\r
  height: 100%;\r
  background-color: rgba(0, 0, 0, 0.7);\r
  z-index: 1000;\r
  display: none;\r
  justify-content: center;\r
  align-items: center;\r
  padding: 20px;\r
  box-sizing: border-box;\r
  overflow-y: auto;\r
}\r
\r
.close-btn {\r
  position: absolute;\r
  top: -50px;\r
  right: -10px;\r
  z-index: 10;\r
  background: transparent;\r
  border: none;\r
  color: var(--ucsd-white);\r
  font-size: 2rem;\r
  font-weight: bold;\r
  cursor: pointer;\r
  padding: 0.2em 0.5em;\r
  border-radius: 50%;\r
}\r
\r
.close-btn:hover, .close-btn:focus {\r
  color: var(--ucsd-gold);\r
}\r
\r
/* Layout */\r
.product-detail {\r
  display: flex;\r
  width: 80%;\r
  max-height: 90vh;\r
  max-width: 900px;\r
  position: relative;\r
  padding: 2rem;\r
  margin: auto;\r
  gap: 2rem;\r
  background: var(--ucsd-white);\r
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\r
  border-radius: 12px;\r
  border-top: 40px solid var(--ucsd-blue);\r
  transform: translateY(10vh);\r
}\r
\r
/* Gallery */\r
.gallery {\r
  display: flex;\r
  flex-direction: column;\r
  flex: 1;\r
  justify-content: flex-start;\r
  background: var(--ucsd-white);\r
  border-radius: 8px;\r
  max-height: 600px;\r
  overflow: hidden;\r
}\r
\r
.gallery-main {\r
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
.gallery-main .main-image {\r
  width: 100%;\r
  height: 100%;\r
  border-radius: 8px;\r
  display: block;\r
  object-fit: cover;\r
}\r
\r
/* Loading state to prevent layout shift */\r
.gallery-main .main-image:not([src]),\r
.gallery-main .main-image[src=""] {\r
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);\r
  background-size: 200% 100%;\r
  animation: loading 1.5s infinite;\r
}\r
\r
@keyframes loading {\r
  0% { background-position: 200% 0; }\r
  100% { background-position: -200% 0; }\r
}\r
\r
/* Thumbnails */\r
.thumb-strip {\r
  display: flex;\r
  gap: 0.5rem;\r
  margin-top: 1rem;\r
  justify-content: flex-start;\r
  flex-wrap: wrap;\r
}\r
\r
.thumb-strip img {\r
  width: 60px;\r
  height: 60px;\r
  object-fit: cover;\r
  border-radius: 4px;\r
  border: 2px solid transparent;\r
  cursor: pointer;\r
  background: var(--ucsd-white);\r
  transition: border 0.2s;\r
}\r
\r
.thumb-strip img.active {\r
  border-color: var(--ucsd-gold);\r
  box-shadow: 0 0 0 1px var(--ucsd-gold-dark);\r
}\r
\r
/* Meta Panel */\r
.meta-panel {\r
  flex: 1;\r
  display: flex;\r
  flex-direction: column;\r
  max-width: 400px;\r
  padding-left: 1rem;\r
}\r
\r
.product-name {\r
  color: var(--ucsd-blue);\r
  font-size: 2rem;\r
  margin: 0 0 1rem 0;\r
  font-weight: 700;\r
  line-height: 1.2;\r
}\r
\r
.price {\r
  color: var(--ucsd-gold);\r
  font-size: 1.8rem;\r
  font-weight: 600;\r
  margin: 0 0 1rem 0;\r
}\r
\r
.meta-table {\r
  margin-bottom: 1.5rem;\r
}\r
\r
.meta-table .date,\r
.meta-table .condition {\r
  display: flex;\r
  align-items: center;\r
  gap: 0.5em;\r
  color: var(--ucsd-blue);\r
  font-size: 0.9rem;\r
  font-weight: 500;\r
  margin-bottom: 0.5rem;\r
}\r
\r
/* Description */\r
.description-title {\r
  color: var(--ucsd-blue);\r
  font-size: 1.1rem;\r
  font-weight: 600;\r
  margin: 0 0 0.5rem 0;\r
}\r
\r
.description-block {\r
  min-height: 120px;  \r
  max-height: 180px; \r
  font-size: 0.9rem;\r
  margin: 0 0 1.5rem 0;\r
  overflow-y: auto;\r
  background: var(--ucsd-white);\r
  border-radius: 8px;\r
  color: var(--ucsd-blue);\r
  line-height: 1.5;\r
}\r
\r
.contact-box {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 0.75rem;\r
  margin-top: 0.5rem;\r
}\r
\r
.contact-message {\r
  resize: none;\r
  min-height: 2.5em;\r
  max-height: 6em;\r
  font-size: 0.9rem;\r
  border-radius: 6px;\r
  border: 1px solid #ddd;\r
  padding: 0.75em;\r
  color: var(--ucsd-blue);\r
  background: var(--ucsd-white);\r
  font-family: inherit;\r
  width: 100%;\r
  box-sizing: border-box;\r
}\r
\r
.send-btn {\r
  display: inline-flex;\r
  align-items: center;\r
  justify-content: center;\r
  cursor: pointer;\r
  border: none;\r
  gap: 0.5em;\r
  border-radius: 6px;\r
  font-size: 0.85rem;\r
  font-weight: 600;\r
  padding: 0.6em 1.2em;\r
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\r
  transition: background 0.2s, color 0.2s, transform 0.1s;\r
  background: var(--ucsd-gold);\r
  color: var(--ucsd-blue);\r
  align-self: flex-start;\r
  min-width: 140px;\r
}\r
\r
.send-btn:hover, .send-btn:focus {\r
  background: var(--ucsd-gold-dark);\r
  transform: translateY(-1px);\r
}\r
\r
.send-btn svg {\r
  width: 14px;\r
  height: 14px;\r
  fill: currentColor;\r
}\r
\r
\r
@media (max-width: 1024px) {\r
  .product-detail {\r
    flex-direction: column;\r
    width: 90%;\r
    max-width: 600px;\r
    padding: 1.5rem;\r
    gap: 1.5rem;\r
  }\r
\r
  .gallery {\r
    width: 100%;\r
  }\r
\r
  .gallery-main {\r
    height: 300px;\r
  }\r
\r
  .meta-panel {\r
    width: 100%; \r
    max-width: none;\r
    padding-left: 0;\r
  }\r
\r
  .product-name {\r
    font-size: 1.75rem;\r
  }\r
\r
  .price {\r
    font-size: 1.5rem;\r
  }\r
}`;class u extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._currentIndex=0,this._isVisible=!1;const r=document.createElement("template");r.innerHTML=`
      <style>${g}</style>
      ${m}
    `,this.shadowRoot.appendChild(r.content.cloneNode(!0))}static get observedAttributes(){return["name","price","condition","date","description","images"]}attributeChangedCallback(r,n,e){n!==e&&this._updateContent()}connectedCallback(){var r,n,e,o,t;this.gallery=this.shadowRoot.querySelector(".gallery"),this.sendButton=this.shadowRoot.querySelector(".send-btn"),this.closeButton=this.shadowRoot.querySelector(".close-btn"),this.overlay=this.shadowRoot.querySelector(".overlay"),this.productDetail=this.shadowRoot.querySelector(".product-detail"),this._initializeOverlay(),this._updateContent(),this._handleKeyDown=this._handleKeyDown.bind(this),this._handleContactClick=this._handleContactClick.bind(this),this._handleCloseClick=this._handleCloseClick.bind(this),this._handleOverlayClick=this._handleOverlayClick.bind(this),this._stopPropagation=this._stopPropagation.bind(this),this._handleEscKey=this._handleEscKey.bind(this),(r=this.gallery)==null||r.addEventListener("keydown",this._handleKeyDown),(n=this.sendButton)==null||n.addEventListener("click",this._handleContactClick),(e=this.closeButton)==null||e.addEventListener("click",this._handleCloseClick),(o=this.overlay)==null||o.addEventListener("click",this._handleOverlayClick),(t=this.productDetail)==null||t.addEventListener("click",this._stopPropagation),document.addEventListener("keydown",this._handleEscKey)}disconnectedCallback(){var r,n,e,o,t;this._isVisible&&this._unlockBodyScroll(),(r=this.gallery)==null||r.removeEventListener("keydown",this._handleKeyDown),(n=this.sendButton)==null||n.removeEventListener("click",this._handleContactClick),(e=this.closeButton)==null||e.removeEventListener("click",this._handleCloseClick),(o=this.overlay)==null||o.removeEventListener("click",this._handleOverlayClick),(t=this.productDetail)==null||t.removeEventListener("click",this._stopPropagation),document.removeEventListener("keydown",this._handleEscKey)}_updateContent(){const r=this.images,n=this.shadowRoot.querySelector(".main-image");n&&(n.src=r[this._currentIndex]||"",n.alt=this.getAttribute("name")||"Product image");const e=this.shadowRoot.querySelector(".thumb-strip");e&&(e.innerHTML="",r.length>1&&r.forEach((o,t)=>{const i=document.createElement("img");i.src=o,i.alt=`Thumbnail ${t+1}`,i.className=t===this._currentIndex?"active":"",i.tabIndex=0,i.addEventListener("click",()=>{this._currentIndex=t,this._updateContent()}),e.appendChild(i)})),this._setText(".product-name",this.getAttribute("name")),this._setText(".price",this.getAttribute("price")?`$${this.getAttribute("price")}`:""),this._setText(".condition",this.getAttribute("condition")),this._setText(".date",this.getAttribute("date")),this._setText(".description-block",this.getAttribute("description"))}_setText(r,n){const e=this.shadowRoot.querySelector(r);e&&(e.textContent=n||"")}_handleKeyDown(r){r.key==="ArrowLeft"&&this._cycleImage(-1),r.key==="ArrowRight"&&this._cycleImage(1)}_handleContactClick(){this.dispatchEvent(new CustomEvent("contact-seller",{bubbles:!0,composed:!0}))}_handleCloseClick(){this.hide()}_handleOverlayClick(r){r.target===this.overlay&&this.hide()}_stopPropagation(r){r.stopPropagation()}_handleEscKey(r){r.key==="Escape"&&this._isVisible&&this.hide()}get images(){const r=this.getAttribute("images")||"";if(r.startsWith("[")&&r.endsWith("]"))try{return JSON.parse(r).filter(Boolean)}catch(n){return console.warn("Failed to parse images JSON:",n),[]}else return r.split(/[\s,]+/).map(n=>n.trim()).filter(Boolean)}_initializeOverlay(){this.overlay&&(this.overlay.style.display="none",this._isVisible=!1)}_lockBodyScroll(){document.body.style.overflow="hidden",document.body.style.paddingRight=this._getScrollbarWidth()+"px"}_unlockBodyScroll(){document.body.style.overflow="",document.body.style.paddingRight=""}_getScrollbarWidth(){const r=document.createElement("div");r.style.cssText="width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(r);const n=r.offsetWidth-r.clientWidth;return document.body.removeChild(r),n}show(){this.overlay&&(this.overlay.style.display="block",this._isVisible=!0,this._lockBodyScroll())}hide(){this.overlay&&(this.overlay.style.display="none",this._isVisible=!1,this._unlockBodyScroll())}_cycleImage(r){const n=this.images;n.length!==0&&(this._currentIndex=(this._currentIndex+r+n.length)%n.length,this._updateContent())}}customElements.define("product-detail",u);const b=`<div class="hero-content">\r
    <div class="hero-text">\r
        <h1>DISCOVER<br>BUY OR <span class="sell-color">SELL.</span></h1>\r
        <a\r
            id="browse-link"\r
            class="btn"\r
        >START BROWSING</a>\r
\r
        <p class="tagline">A TRUSTED DIGITAL MARKETPLACE FOR STUDENTS AND STAFF</p>\r
    </div>\r
    <div class="hero-image">\r
        <video\r
            autoplay\r
            muted\r
            loop\r
            playsinline\r
        >\r
            <source src="geiselnc.mp4" type="video/mp4">\r
        </video>\r
    </div>\r
</div>`,v=`\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
  margin: 0;\r
  padding: 0;\r
}\r
\r
:host {\r
  display: block;\r
  font-family: var(--font);\r
  height: 100%;\r
  background: var(--blue);\r
  color: var(--white);\r
}\r
\r
.hero-content {\r
  display: flex;\r
  position: relative;\r
  align-items: center;\r
  height: 100%;\r
  min-height: calc(100vh - 76px); /* Consider the header height */\r
  animation: hero-fade-in 1.2s cubic-bezier(.4,1.4,.6,1) both;\r
}\r
\r
@keyframes hero-fade-in {\r
  from {\r
    opacity: 0;\r
    transform: translateY(32px) scale(0.98);\r
  }\r
  to {\r
    opacity: 1;\r
    transform: translateY(0) scale(1);\r
  }\r
}\r
\r
\r
.hero-text {\r
  flex: 0 0 1rem;\r
  padding: 1rem;\r
  white-space: nowrap;\r
  z-index: 2;\r
  position: relative;\r
}\r
\r
.hero-text h1 {\r
  font-size: calc(4rem + 4vw);\r
  line-height: 1.1;\r
  font-weight: 800;\r
  margin-bottom: 1.5rem;\r
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);\r
  color: white;\r
}\r
\r
.btn {\r
  display: inline-block;\r
  background: var(--gold);\r
  color: var(--blue);\r
  text-transform: uppercase;\r
  text-decoration: none;\r
  font-weight: 700;\r
  padding: 0.75rem 2rem;\r
  border-radius: 4px;\r
  letter-spacing: 0.05em;\r
  margin-bottom: 0.5rem;\r
    transition: all 0.25s ease-in-out;\r
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\r
}\r
\r
.btn:hover {\r
 background-color: #d4a90f;\r
  transform: translateY(-1px);\r
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);\r
}\r
\r
.tagline {\r
  font-size: 0.8rem;\r
  letter-spacing: 0.05em;\r
  opacity: 0.8;\r
  margin: 0;\r
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);\r
  color: white;\r
}\r
\r
.hero-image {\r
 position: absolute;\r
  right: 0;\r
  height: 100%;\r
  width: 75%;\r
  overflow: hidden;\r
  z-index: 1;\r
  border-radius: 1.8rem 0 0 1.8rem;\r
}\r
\r
.sell-color {\r
  color: var(--gold);\r
}\r
.hero-image::after {\r
  content: '';\r
  position: absolute;\r
  top: 0;\r
  left: 0;\r
  width: 100%;\r
  height: 100%;\r
  z-index: 1; \r
}\r
.hero-image video {\r
  width: 100%;\r
  height: 100%;\r
  object-fit: cover;\r
  object-position: center;\r
}\r
\r
@media (max-width: 800px) {\r
  .hero-content {\r
    flex-direction: column;\r
    align-items: center;\r
    padding: 1rem;\r
  }\r
  \r
  .hero-image {\r
    position: relative;\r
    width: 100%;\r
    height: 40vh; /* Fixed height for the image on mobile */\r
    border-radius: 1.5rem;\r
    margin-bottom: 2rem;\r
    order: 1; /* Place the image at the top */\r
  }\r
  \r
  .hero-image::after {\r
    background: linear-gradient(0deg, rgba(4,19,59,0.3) 0%, rgba(4,19,59,0.1) 100%);\r
  }\r
  \r
  .hero-text {\r
    order: 2; /* Place the text under the image */\r
    width: 100%;\r
    text-align: center;\r
    white-space: normal;\r
    padding: 0;\r
    padding-top: 1rem;\r
  }\r
  \r
  .hero-text h1 {\r
    font-size: calc(2rem + 4vw);\r
  }\r
}\r
\r
/* Further adjustments for very small screens */\r
@media (max-width: 480px) {\r
  .hero-image {\r
    height: 35vh;\r
  }\r
  \r
  .hero-text h1 {\r
    font-size: calc(1.8rem + 3vw);\r
  }\r
  \r
  .btn {\r
    padding: 0.6rem 1.5rem;\r
    font-size: 0.9rem;\r
  }\r
}@media (max-width: 800px) {\r
  .hero-content {\r
    flex-direction: column-reverse;\r
    text-align: center;\r
  }\r
  .hero-text {\r
    white-space: normal;\r
    padding: 2rem;\r
  }\r
  .hero-image {\r
    width: 100%;\r
    height: auto;\r
    border-radius: 1.5rem;\r
    margin-top: 2rem;\r
    padding-left: 0;\r
  }\r
}`;class w extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});const r=document.createElement("template");r.innerHTML=`
      <style>${v}</style>
      ${b}
    `,this.shadowRoot.appendChild(r.content.cloneNode(!0))}connectedCallback(){}}customElements.define("hero-banner",w);const x=`<!DOCTYPE html>\r
<html lang="en">\r
    <head>\r
        <meta charset="UTF-8">\r
        <meta name="viewport" content="width=device-width, initial-scale=1.0">\r
        <title>Improved Search Banner</title>\r
        <link rel="stylesheet" href="styles.css">\r
    </head>\r
    <body>\r
        <section class="search-banner">\r
            <div class="video-background">\r
                <img src="banner.jpg" alt="UCSD banner image">\r
            </div>\r
            <div class="video-overlay"></div>\r
            <div class="banner-content">\r
                <h1 class="headline">Find what you need. Share what you don't.</h1>\r
                <div class="search-container">\r
                    <div class="search-bar">\r
                        <div class="search-icon">\r
                            <svg\r
                                xmlns="http://www.w3.org/2000/svg"\r
                                width="22"\r
                                height="22"\r
                                viewBox="0 0 24 24"\r
                            >\r
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>\r
                            </svg>\r
                        </div>\r
                        <input\r
                            type="text"\r
                            class="search-input"\r
                            placeholder="What are you looking for?"\r
                            aria-label="Search marketplace"\r
                        >\r
                        <button class="search-button" type="button">\r
                            <svg\r
                                xmlns="http://www.w3.org/2000/svg"\r
                                width="18"\r
                                height="18"\r
                                viewBox="0 0 24 24"\r
                            >\r
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>\r
                            </svg>\r
                        </button>\r
                    </div>\r
                </div>\r
            </div>\r
        </section>\r
\r
        <script src="script.js"><\/script>\r
    </body>\r
</html>`,y=`* {\r
    margin: 0;\r
    padding: 0;\r
    box-sizing: border-box;\r
    font-family: "Segoe UI", Arial, sans-serif;\r
}\r
\r
body {\r
    background-color: #f7f7f7;\r
    padding: 0; /* Removed padding to prevent interference with alignment */\r
}\r
\r
.search-banner {\r
    width: 90%;\r
    margin-top: 2rem;\r
    max-width: 1800px;\r
    height: 400px;\r
    position: relative;\r
    border-radius: 16px;\r
    overflow: hidden;\r
    box-shadow: var(--shadow);\r
    box-sizing: border-box;\r
    justify-self: center;\r
}\r
\r
.video-background {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    width: 100%;\r
    height: 100%;\r
    z-index: 1;\r
}\r
\r
.video-background video {\r
    width: 100%;\r
    height: 100%;\r
    object-fit: cover;\r
}\r
\r
.video-overlay {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    width: 100%;\r
    height: 100%;\r
    background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5));\r
    z-index: 2;\r
}\r
\r
.banner-content {\r
    position: relative;\r
    z-index: 3;\r
    width: 100%;\r
    height: 100%;\r
    display: flex;\r
    flex-direction: column;\r
    justify-content: center;\r
    align-items: center;\r
    padding: 2rem;\r
}\r
\r
.headline {\r
    font-size: 2rem;\r
    font-weight: 700;\r
    color: var(--white);\r
    text-shadow: var(--text-shadow);\r
    margin-bottom: 2rem;\r
    text-align: center;\r
    max-width: 700px;\r
    text-wrap: nowrap;\r
}\r
\r
.search-container {\r
    width: 100%;\r
    max-width: 600px;\r
}\r
\r
.search-bar {\r
    display: flex;\r
    align-items: center;\r
    background: var(--white);\r
    border-radius: 30px;\r
    padding: 0.5rem;\r
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\r
    border: 1px solid #e0e0e0;\r
    position: relative;\r
    height: 60px;\r
}\r
\r
.search-icon {\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    padding: 0 1rem;\r
}\r
\r
.search-input {\r
    flex: 1;\r
    border: none;\r
    outline: none;\r
    font-size: 1rem;\r
    padding: 0 1rem;\r
    height: 100%;\r
    background: transparent;\r
}\r
\r
.search-input::placeholder {\r
    color: #999;\r
}\r
\r
.search-button {\r
    background: var(--blue);\r
    border: none;\r
    border-radius: 50%;\r
    width: 44px;\r
    height: 44px;\r
    margin-right: 0.5rem;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    cursor: pointer;\r
    transition: all 0.2s ease;\r
}\r
\r
.search-button:hover {\r
    background: var(--gold);\r
    transform: scale(1.05);\r
}\r
\r
.search-button svg {\r
    fill: var(--white);\r
}\r
\r
\r
@media (max-width: 800px) {\r
    .search-banner {\r
        height: 350px;\r
    }\r
    \r
    .headline {\r
        font-size: 2rem;\r
        margin-bottom: 1.5rem;\r
        text-wrap: wrap;\r
    }\r
    \r
    .search-bar {\r
        height: 50px;\r
    }\r
}\r
\r
@media (max-width: 500px) {\r
    .search-banner {\r
        height: 300px;\r
        border-radius: 12px;\r
    }\r
    \r
    .headline {\r
        font-size: 1.6rem;\r
        margin-bottom: 1.25rem;\r
        text-wrap: wrap;\r
    }\r
    \r
    .search-bar {\r
        height: 46px;\r
    }\r
    \r
    .search-button {\r
        width: 36px;\r
        height: 36px;\r
    }\r

}`;class R extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});const r=document.createElement("template");r.innerHTML=`
      <style>${C}</style>
      ${E}
    `,this.shadowRoot.appendChild(r.content.cloneNode(!0)),this.activeCategory="all"}connectedCallback(){this.setupEventListeners(),console.log("SearchHero connected successfully")}setupEventListeners(){const r=this.shadowRoot.querySelector(".search-input"),n=this.shadowRoot.querySelector(".search-button"),e=()=>{const t=r.value.trim();t&&this.dispatchEvent(new CustomEvent("search-submit",{bubbles:!0,composed:!0,detail:{query:t}})),console.log(`Search submitted: ${t}`)};n==null||n.addEventListener("click",e),r==null||r.addEventListener("keypress",t=>{t.key==="Enter"&&e()});const o=this.shadowRoot.querySelectorAll(".category-btn");o.forEach(t=>{t.addEventListener("click",()=>{o.forEach(i=>i.classList.remove("active")),t.classList.add("active"),this.activeCategory=t.getAttribute("data-category"),this.dispatchEvent(new CustomEvent("category-selected",{bubbles:!0,composed:!0,detail:{category:this.activeCategory}})),console.log(`Category selected: ${this.activeCategory}`)})})}}customElements.define("search-banner",R);const L=`<div class="chat-bubble">\r

    <svg\r
        xmlns="http://www.w3.org/2000/svg"\r
        width="24"\r
        height="24"\r
        viewBox="0 0 24 24"\r
        fill="none"\r
        stroke="currentColor"\r
        stroke-width="2"\r
        stroke-linecap="round"\r
        stroke-linejoin="round"\r
    >\r
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>\r
    </svg>\r
    <span class="unread-count">2</span>\r
</div>\r
<div class = "widget-container">\r
    <header>\r
        <span>Chat</span>\r
        <span class = "close-icon">&times;</span>\r
    </header>\r
    <input type = "search" placeholder="Search conversation...">\r
    <div class = "convo-list"></div>\r
    <div class="chat-screen hidden">\r
        <header class="chat-header">\r
            <span class="back-button">&larr;</span>\r
            <span class="chat-title">Chat</span>\r
        </header>\r
        <div class="messages">\r
            <div class="message">Hey there!</div>\r
        </div>\r
        <input class="message-input" placeholder="Type a message...">\r
    </div>\r
</div>`,S=`:host {\r
    display: block;\r
    position: fixed;\r
    bottom: 20px;\r
    right: 20px;\r
    /*border: 1px solid var(--blue);*/\r
    font-family: sans-serif;\r
    z-index: 999;\r
    transition: bottom 0.01s ease;\r
}\r
\r
:host(.above-bottom-nav) {\r
    bottom: calc(20px + var(--bottom-nav-height, 200px));\r
}\r
/* Chat Bubble Styles */\r
.chat-bubble {\r
    position: relative;\r
    width: 60px;\r
    height: 60px;\r
    /*border-radius: 50%;*/\r
    border: 1px solid var(--gold);\r
    border-radius: 50%;\r
    background-color: var(--blue);\r
    color: var(--white);\r
    display: flex;\r
    justify-content: center;\r
    align-items: center;\r
    cursor: pointer;\r
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\r
    transition: transform 0.2s ease, box-shadow 0.2s ease;\r
}\r
.chat-bubble:hover {\r
    /*border-color: 1px solid var(--white);*/\r
    transform: scale(1.05);\r
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);\r
}\r
.chat-bubble svg {\r
    width: 28px;\r
    height: 28px;\r
}\r
.unread-count {\r
    position: absolute;\r
    top: 0;\r
    right: 0;\r
    background-color: var(--gold);\r
    color: var(--blue);\r
    font-size: 12px;\r
    font-weight: bold;\r
    width: 20px;\r
    height: 20px;\r
    border-radius: 50%;\r
    display: flex;\r
    justify-content: center;\r
    align-items: center;\r
    border: 2px solid var(--white);\r
}\r
header {\r
    background-color: var(--blue);\r
    color: var(--white);\r
    padding: 12px;\r
    display: flex;\r
    justify-content: space-between;\r
    align-items: center;\r
    font-size: 16px;\r
}\r
.menu-icon, .close-icon {\r
    cursor: pointer;\r
}\r
input[type = "search"] {\r
    border: none;\r
    padding: 10px;\r
    font-size: 14px;\r
    border-top: 1px solid var(--blue);\r
    border-bottom: 1px solid var(--blue);\r
    outline: none;\r
    caret-color: var(--gold);\r
    width: 100%;\r
    box-sizing: border-box;\r
}\r
.convo-list {\r
    max-height: 300px;\r
    overflow-y: auto;\r
    display: block;\r
}\r
.convo {\r
    padding: 10px;\r
    border-bottom: #eee;\r
    display: flex;\r
    align-items: center;\r
    cursor: pointer;\r
    transition: background 0.2s ease;\r
}\r
.convo:hover {\r
    background: #F5F5F5;\r
}\r
.avatar {\r
    width: 40px;\r
    height: 40px;\r
    border-radius: 50%;\r
    background: gray;\r
    margin-right: 10px;\r
    flex-shrink: 0;\r
}\r
.chat-screen {\r
    display: flex;\r
    flex-direction: column;\r
    height: 300px;\r
    background: var(--white);\r
}\r
.chat-screen.hidden {\r
    display: none;\r
}\r
.chat-header {\r
    background: var(--blue);\r
    color: var(--white);\r
    padding: 10px;\r
    display: flex;\r
    align-items: center;\r
    gap: 12px;\r
    font-weight: bold;\r
}\r
.message-input {\r
    border: none;\r
    border-top: 1px solid #ccc;\r
    padding: 10px;\r
    font-size: 14px;\r
    outline: none;\r
}\r
.messages {\r
    flex: 1;\r
    padding: 10px;\r
    overflow-y: auto;\r
}\r
.message {\r
    background: #eee;\r
    padding: 8px 12px;\r
    border-radius: 12px;\r
    margin-bottom: 8px;\r
    max-width: 70%;\r
}\r
.details {\r
    flex-grow: 1;\r
    overflow: hidden;\r
}\r
.details > div:first-child {\r
    display: flex;\r
    justify-content: space-between;\r
    align-items: center;\r
}\r
.details > div:first-child .name {\r
    font-weight: 600;\r
    font-size: 0.9rem;\r
    color: var(--navy-text);\r
}\r
.details > div:first-child .timestamp {\r
    font-size: 0.75rem;\r
    color: var(--navy-text);\r
    font-weight: normal;\r
}\r
.details > div:last-child {\r
    font-size: 0.85rem;\r
    color: #666;\r
    text-overflow: ellipsis;\r
    white-space: nowrap;\r
    overflow: hidden;\r
}\r
.unread-badge {\r
    width: 10px;\r
    height: 10px;\r
    background: var(--gold);\r
    border-radius: 50%;\r
    margin-left: 6px;\r
    flex-shrink: 0;\r
}\r
.widget-container{\r
    background-color: white;\r
    border: 1px solid var(--blue);\r
    width: 300px;\r
}\r
.back-button {\r
    cursor: pointer;\r

}`;class _ extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._conversations=[{id:1,name:"Alice",preview:"Hey!",timestamp:"10:32 AM",unread:!0},{id:2,name:"Bob",preview:"See you soon.",timestamp:"9:14 AM",unread:!1},{id:3,name:"Carol",preview:"Got it.",timestamp:"Yesterday",unread:!0}]}connectedCallback(){const r=document.createElement("template");r.innerHTML=`<style>${z}</style>${L}`,this.shadowRoot.appendChild(r.content.cloneNode(!0)),this.shadowRoot.querySelector(".close-icon").addEventListener("click",()=>this.hideWidget()),this._handleEsc=o=>{o.key==="Escape"&&this.isConnected&&this.parentElement&&this.hideWidget()};const n=document.querySelector("chat-widget");document.addEventListener("user-signed-out",()=>{n.style.display="none",console.log("receive event logout")}),document.addEventListener("user-signed-in",()=>{n.style.display="block",console.log("receive event login")}),this.shadowRoot.querySelector(".chat-bubble").addEventListener("click",()=>{this.toggleWidget()}),this.shadowRoot.querySelector(".widget-container").style.display="none",this._renderConversations(),this._isVisible=!1,document.addEventListener("keydown",this._handleEsc),this.shadowRoot.querySelector("input").addEventListener("input",o=>{const t=o.target.value.toLowerCase();this._renderConversations(t)}),this._renderConversations();const e=this.shadowRoot.querySelector(".back-button");e&&e.addEventListener("click",()=>{this.shadowRoot.querySelector(".chat-screen").classList.add("hidden"),this.shadowRoot.querySelector(".convo-list").style.display="block",this.shadowRoot.querySelector("header").style.display="flex",this.shadowRoot.querySelector("input").style.display="block"})}toggleWidget(){this._isVisible?this.hideWidget():this.showWidget()}showWidget(){this.shadowRoot.querySelector(".widget-container").style.display="block",this.shadowRoot.querySelector(".chat-bubble").style.display="none",this._isVisible=!0}hideWidget(){this.shadowRoot.querySelector(".widget-container").style.display="none",this.shadowRoot.querySelector(".chat-bubble").style.display="flex",this._isVisible=!1}disconnectedCallback(){document.removeEventListener("keydown",this._handleEsc),document.body.style.overflow=""}_renderConversations(r=""){const n=this.shadowRoot.querySelector(".convo-list");n.innerHTML="",this._conversations.filter(e=>e.name.toLowerCase().includes(r)).forEach(e=>{const o=document.createElement("div");o.classList.add("convo"),o.innerHTML=`

            <div class="avatar"></div>
            <div class="details">
            <div>
              <span class="name">${e.name}</span>
              <span class="timestamp">${e.timestamp}</span>
            </div>
            <div>${e.preview}</div>
            </div>
            ${e.unread?'<div class="unread-badge"></div>':""}
            `,o.addEventListener("click",()=>{this.shadowRoot.querySelector(".convo-list").style.display="none",this.shadowRoot.querySelector("header").style.display="none",this.shadowRoot.querySelector("input").style.display="none";const t=this.shadowRoot.querySelector(".chat-screen");t.classList.remove("hidden"),t.querySelector(".chat-title").textContent=e.name;const i=t.querySelector(".messages");i.innerHTML=`<div class="message">${e.preview}</div>`,this.dispatchEvent(new CustomEvent("chat-open",{detail:{id:e.id},bubbles:!0,composed:!0}))}),n.appendChild(o)})}}customElements.define("chat-widget",C);
