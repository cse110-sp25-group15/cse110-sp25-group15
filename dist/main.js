import{s as l}from"./bottom-nav.js";import w from"https://cdn.skypack.dev/heic2any";import p from"https://cdn.skypack.dev/browser-image-compression";const u=Object.freeze({SPORTS:"Sports",BOOKS:"Books",SUPPLIES:"Supplies",TECH:"Tech",TRANSPORTATION:"Transportation",APPAREL:"Apparel",DORM_LIFE:"Dorm Life",FURNITURE:"Furniture",OTHER:"Other"});class m{constructor(){this.listings=[]}async fetchAllListings(){try{const{data:r,error:e}=await l.from("listings").select();if(e)throw console.error("Error fetching listings:",e),e;return this.listings=r,this.listings}catch(r){throw console.error("Failed to fetch listings:",r),r}}async fetchListingsByCategory(r){if(!Object.values(u).includes(r))throw new Error(`Invalid category: ${r}`);try{const{data:e,error:n}=await l.from("listings").select().eq("category",r);if(n)throw console.error(`Error fetching ${r} listings:`,n),n;return e}catch(e){throw console.error(`Failed to fetch ${r} listings:`,e),e}}async fetchAllListingsSortByDate(r=!1){try{const{data:e,error:n}=await l.from("listings").select().order("date_posted",{ascending:r});if(n)throw console.error("Error fetching listings:",n),n;return e}catch(e){throw console.error("Failed to fetch listings:",e),e}}async fetchAllListingsSortByPrice(r){try{const{data:e,error:n}=await l.from("listings").select().order("price",{ascending:r});if(n)throw console.error("Error fetching listings by price:",n),n;return e}catch(e){throw console.error("Failed to fetch listings by price:",e),e}}async getListingById(r){const e=this.listings.find(n=>n.listing_id===r);if(e)return e;try{const{data:n,error:t}=await l.from("listings").select().eq("listing_id",r).single();return t?(console.error(`Error fetching listing ${r}:`,t),null):n}catch(n){return console.error(`Failed to fetch listing ${r}:`,n),null}}async fetchListingsByUser(r){try{const{data:e,error:n}=await l.from("listings").select("*").eq("user_id",r);if(n)throw console.error("Error fetching user listings:",n),n;return e}catch(e){throw console.error("Failed to fetch user listings:",e),e}}async deleteListingById(r){try{const{error:e}=await l.from("images").delete().eq("listing_id",r);e&&console.warn("Warning: failed to delete images for listing:",e);const{error:n}=await l.from("listings").delete().eq("listing_id",r);if(n)throw console.error("Error deleting listing:",n),n;console.log(`Listing ${r} deleted successfully.`)}catch(e){throw console.error("Failed to delete listing:",e),e}}formatListingForView(r){return{listing_id:r.listing_id,title:r.title,price:r.price,image_url:r.thumbnail||"https://via.placeholder.com/300x400",date_posted:r.date_posted}}async searchListings(r){if(!r||typeof r!="string")throw new Error("Query must be a non-empty string");try{const{data:e,error:n}=await l.from("listings").select().or(`title.ilike.%${r}%,description.ilike.%${r}%`);if(n)throw console.error("Error searching listings:",n),n;return e}catch(e){throw console.error("Failed to search listings:",e),e}}}class f{constructor(){this.model=new m,this.browsePage=document.querySelector("browse-page"),this.productsContainer=null,this.overlay=document.getElementById("product-detail-overlay"),this.categoryButtons=[],this.currentCategory=null}init(){if(!this.browsePage||!this.browsePage.shadowRoot){console.error("Browse page or shadow root not found");return}if(this.productsContainer=this.browsePage.shadowRoot.querySelector(".products-container"),!this.productsContainer){console.error("Products container not found");return}this.browsePage&&this.browsePage.shadowRoot?(this.categoryButtons=Array.from(this.browsePage.shadowRoot.querySelectorAll("category-button")),console.log("Found category buttons:",this.categoryButtons.length),this.categoryButtons.length>0):console.error("Cannot find category buttons: browse-page or its shadow root is missing"),this.loadListings(),document.addEventListener("card-click",r=>{console.log("Card clicked event received"),console.log(r.detail);const e=r.detail.listingId;this.showProductDetail(e)}),document.addEventListener("filter-changed",r=>{console.log("Filter changed event received:",r.detail);const e=r.detail.category;this.setSelectedCategory(e)})}setSelectedCategory(r){this.currentCategory=r,this.categoryButtons.forEach(e=>{e.shadowRoot.querySelector("slot").assignedNodes().map(o=>o.textContent).join("").trim()===r?e.setAttribute("selected",""):e.removeAttribute("selected")}),console.log("Category selected:",r),this.filterListingsByCategory(r)}async filterListingsByCategory(r){try{if(!this.productsContainer){console.error("Products container not found");return}this.productsContainer.innerHTML="";const e=await this.model.fetchAllListings(),n=r==="All"?e:e.filter(t=>t.category===r);n.forEach(t=>{this.renderListingCard(t)}),console.log(`Filtered listings by "${r}" category:`,n.length)}catch(e){console.error("Failed to filter listings:",e)}}async loadListings(){try{if(!this.productsContainer){console.error("Products container not found");return}this.productsContainer.innerHTML="";const r=await this.model.fetchAllListings();if(!this.productsContainer){console.error("Products container no longer available");return}r.forEach(e=>{this.renderListingCard(e)}),console.log("Loaded listings:",r)}catch(r){console.error("Controller failed to load listings:",r)}}renderListingCard(r){if(!this.productsContainer){console.error("Cannot render card, products container not available");return}const e=this.model.formatListingForView(r),n=document.createElement("product-card");n.setAttribute("listing-id",e.listing_id||""),n.setAttribute("title",e.title||""),n.setAttribute("price",e.price||""),n.setAttribute("image-url",e.image_url||""),n.setAttribute("date",e.date_posted||""),n.classList.add("card"),this.productsContainer.appendChild(n)}async showProductDetail(r){console.log("Showing product detail for listing ID:",r);try{const e=await this.model.getListingById(r);if(!e){console.error(`Listing with ID ${r} not found`);return}if(!this.overlay){console.error("Product overlay component not found");return}this.overlay.setAttribute("name",e.title||""),this.overlay.setAttribute("price",e.price||""),this.overlay.setAttribute("condition",e.condition||""),this.overlay.setAttribute("date",e.date_posted||""),this.overlay.setAttribute("description",e.description||""),this.overlay.setAttribute("images",e.thumbnail||""),this.overlay.show()}catch(e){console.error("Error showing product detail:",e)}}notifyError(r){alert(r)}notifySuccess(r){alert(r)}async searchListings(r){return await this.model.searchListings(r)}async renderSearchResults(r){if(!this.productsContainer){console.error("Products container not found");return}this.productsContainer.innerHTML="";try{const e=await this.searchListings(r);if(!e||e.length===0){this.productsContainer.innerHTML='<div class="no-results">No results found.</div>';return}e.forEach(n=>{this.renderListingCard(n)}),console.log(`Rendered ${e.length} search results for query: "${r}"`)}catch(e){this.productsContainer.innerHTML='<div class="no-results">Error searching listings.</div>',console.error("Error rendering search results:",e)}}}const y={NEW:"New",LIKE_NEW:"Like New",LIGHTLY_USED:"Lightly Used",USED:"Used"};class x{constructor(){this.model=new m}init(){document.addEventListener("listing-submit",this.handleListingSubmit.bind(this))}_generateUUID(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(r){const e=Math.random()*16|0;return(r==="x"?e:e&3|8).toString(16)})}async convertImageToWebP(r){if(!r)throw new Error("No file provided");const e=r.type;let n;try{if(e==="image/heic"||r.name.endsWith(".HEIC")){n=await w({blob:r,toType:"image/webp",quality:.8});const t=new File([n],r.name.replace(/\.\w+$/,".webp"),{type:"image/webp"});n=await p(t,{maxSizeMB:.1,maxWidthOrHeight:800,fileType:"image/webp",useWebWorker:!0})}else n=await p(r,{maxSizeMB:.1,maxWidthOrHeight:800,fileType:"image/webp",useWebWorker:!0});return n}catch(t){throw console.error("Conversion failed:",t),t}}async _uploadFile(r,e,n){const t=`${e}/${n}/${r.name}`,{data:o,error:i}=await l.storage.from("listimages").upload(t,r,{upsert:!1});if(i)throw console.error("Error uploading file:",i),i;const{data:s}=l.storage.from("listimages").getPublicUrl(t);if(console.log("Public URL:",s.publicUrl),s.error)throw console.error("Error getting public URL:",s.error),s.error;return s.publicUrl}async handleListingSubmit(r){console.log("Listing submit event received");const e=r.detail;if(console.log("Listing data:",e),!Object.values(u).includes(e.category)){this.notifyError("Invalid category selected.");return}if(!Object.values(y).includes(e.condition)){this.notifyError("Invalid condition selected.");return}try{const{data:{user:n},error:t}=await l.auth.getUser();if(!n){this.notifyError("You must be signed in to create a listing");return}const o=this._generateUUID();let i=null;if(e.files&&e.files.length>0)try{const g=await this.convertImageToWebP(e.files[0]),h=e.files[0].name.replace(/\.\w+$/,".webp"),b=new File([g],h,{type:"image/webp"});i=await this._uploadFile(b,n.id,o),delete e.files}catch(g){console.error("File upload error:",g),this.notifyError("File upload failed.");return}const s={...e,listing_id:o,user_id:n.id,thumbnail:i},{data:a,error:c}=await l.from("listings").insert([s]).select();if(c){this.notifyError(c.message||"Failed to create listing");return}this.notifySuccess("Listing created successfully"),r.target&&typeof r.target.resetForm=="function"&&r.target.resetForm()}catch(n){console.error("Error handling listing submission:",n),this.notifyError("An unexpected error occurred")}}notifyError(r){alert(r)}notifySuccess(r){alert(r)}}document.addEventListener("DOMContentLoaded",async()=>{const d=new f;d.init(),new x().init();const e=document.querySelector(".logo");e&&e.addEventListener("click",()=>{window.location.href="/"});const n=document.querySelector("hero-banner"),t=document.getElementById("browse-link");t&&t.addEventListener("click",s=>{s.preventDefault();const a=document.getElementById("marketplace");a&&(a.scrollIntoView({behavior:"instant"}),n&&n.remove())});const o=()=>{if(!n)return;n.getBoundingClientRect().bottom<=0&&n.remove()};window.addEventListener("scroll",o);const i=document.querySelector("search-box");i&&i.addEventListener("search-submit",async s=>{const a=s.detail.query;a&&await d.renderSearchResults(a)})});const v=`\r
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
</section>`,k=`:host {\r
  --gap: 16px;\r
  --max-columns: 6;\r
  --max-container-width: 1800px;\r
  --blue: #04133B;\r
  --gold: #F3C114;\r
  --white: #FFFFFF;\r
  --text-dark: #1a1a1a;\r
  --text-gray: #666666;\r
  --border-light: #e5e5e5;\r
}\r
\r
.browse-area {\r
  display: block;\r
  background-color: var(--white);\r
  width: 100%;\r
  padding: 0 5%;\r
  box-sizing: border-box; \r
}\r
\r
/* Header Section - Tenrevel Style */\r
.browse-header {\r
  background: var(--white);\r
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
  background-color: var(--white);\r
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
  background-color: var(--white);\r
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
  background: var(--white);\r
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
`,E=`<div class="card-container">\r
    <div class="image-container">\r
        <!-- Skeleton loader - shows while image is loading -->\r
        <div class="skeleton-loader"></div>\r
        \r
        <!-- Triton placeholder - shows during loading -->\r
        <div class="triton-placeholder"></div>\r
        \r
        <!-- Main product image -->\r
        <img\r
            class="card-image"\r
            src=""\r
            alt="Product image"\r
            loading="lazy"\r
        >\r
        \r
        <!-- Fallback SVG placeholder for broken images -->\r
        <svg\r
            class="placeholder-image"\r
            style="display: none;"\r
            xmlns="http://www.w3.org/2000/svg"\r
            viewBox="0 0 24 24"\r
            fill="none"\r
            stroke="currentColor"\r
            stroke-width="2"\r
            stroke-linecap="round"\r
            stroke-linejoin="round"\r
        >\r
            <rect\r
                x="3"\r
                y="3"\r
                width="18"\r
                height="18"\r
                rx="2"\r
                ry="2"\r
            ></rect>\r
            <circle\r
                cx="8.5"\r
                cy="8.5"\r
                r="1.5"\r
            ></circle>\r
            <polyline points="21 15 16 10 5 21"></polyline>\r
        </svg>\r
    </div>\r
    <div class="card-content">\r
        <h3 class="card-title"></h3>\r
        <p class="card-price"></p>\r
        <p class="card-date"></p>\r
    </div>\r
</div>`,L=`:host {\r
  display: block;\r
  width: 100%;\r
  box-sizing: border-box;\r
}\r
\r
.card-container {\r
  height: 100%;\r
  width: 100%;\r
  display: flex;\r
  flex-direction: column;\r
  overflow: hidden;\r
  border-radius: 8px;\r
  transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;\r
  border: none !important;\r
  outline: none;\r
  box-shadow: none;\r
}\r
\r
.card-container:hover {\r
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);\r
  cursor: pointer;\r
}\r
\r
.image-container {\r
  width: 100%;\r
  height: 80%;\r
  overflow: hidden;\r
  background-color: #f5f5f5;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  border-top-left-radius: 20px;\r
  border-top-right-radius: 20px;\r
  border-bottom-left-radius: 20px;\r
  border-bottom-right-radius: 20px;\r
  position: relative;\r
}\r
\r
/* Skeleton loader animation */\r
.skeleton-loader {\r
  position: absolute;\r
  top: 0;\r
  left: 0;\r
  width: 100%;\r
  height: 100%;\r
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);\r
  background-size: 200% 100%;\r
  animation: skeleton-loading 1.5s infinite;\r
  border-radius: 20px;\r
  z-index: 1;\r
}\r
\r
@keyframes skeleton-loading {\r
  0% { background-position: -200% 0; }\r
  100% { background-position: 200% 0; }\r
}\r
\r
/* Triton placeholder */\r
.triton-placeholder {\r
  position: absolute;\r
  top: 50%;\r
  left: 50%;\r
  transform: translate(-50%, -50%);\r
  width: 80px;\r
  height: 80px;\r
  opacity: 0.3;\r
  z-index: 2;\r
  background-image: url('triton.png');\r
  background-size: contain;\r
  background-repeat: no-repeat;\r
  background-position: center;\r
}\r
\r
.card-image {\r
  width: 100%;\r
  height: 100%;\r
  object-fit: cover;\r
  border-radius: 20px;\r
  opacity: 0;\r
  transition: opacity 0.4s ease-in;\r
  z-index: 3;\r
  position: relative;\r
}\r
\r
/* Image loaded state */\r
.card-image.loaded {\r
  opacity: 1;\r
}\r
\r
/* Hide skeleton and placeholder when image is loaded */\r
.image-container.image-loaded .skeleton-loader,\r
.image-container.image-loaded .triton-placeholder {\r
  display: none;\r
}\r
\r
/* Fallback placeholder when image fails to load */\r
.placeholder-image {\r
  width: 60px;\r
  height: 60px;\r
  opacity: 0.3;\r
  border-radius: 8px;\r
  position: absolute;\r
  z-index: 2;\r
}\r
\r
.card-content {\r
  padding: 5px;\r
  flex-grow: 1;\r
  display: flex;\r
  flex-direction: column;\r
  justify-content: space-evenly;\r
}\r
\r
.card-title {\r
  font-size: 1rem;\r
  font-weight: 600;\r
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\r
  margin: 0;\r
  color: black;\r
  overflow: hidden;\r
  text-overflow: ellipsis;\r
  display: -webkit-box;\r
  -webkit-line-clamp: 2;\r
  -webkit-box-orient: vertical;\r
  line-height: 1.3;\r
}\r
\r
.card-price {\r
  font-size: 0.9rem;\r
  font-weight: 700;\r
  color: #003057;\r
  margin: 0;\r
}\r
\r
.card-date {\r
  font-size: 0.75rem;\r
  color: #666;\r
  margin-top: 6px;\r
  font-style: italic;\r
  white-space: nowrap;\r
  overflow: hidden;\r
  text-overflow: ellipsis;\r
}`;class S extends HTMLElement{static get observedAttributes(){return["listing-id","title","price","image-url","date"]}constructor(){super(),this.attachShadow({mode:"open"}),this.imageLoaded=!1}connectedCallback(){var e;const r=document.createElement("template");r.innerHTML=`
      <style>${L}</style>
      ${E}
    `,this.shadowRoot.appendChild(r.content.cloneNode(!0)),this._updateContent(),this._setupImageLoading(),(e=this.shadowRoot.querySelector(".card-container"))==null||e.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("card-click",{bubbles:!0,composed:!0,detail:{listingId:this.getAttribute("listing-id")}}))})}_setupImageLoading(){const r=this.shadowRoot.querySelector(".card-image"),e=this.shadowRoot.querySelector(".image-container"),n=this.shadowRoot.querySelector(".placeholder-image");if(!r||!e)return;r.addEventListener("load",()=>{this.imageLoaded=!0,r.classList.add("loaded"),e.classList.add("image-loaded")}),r.addEventListener("error",()=>{this.imageLoaded=!1,e.classList.add("image-loaded"),r.style.display="none",n&&(n.style.display="block")});const t=this.getAttribute("image-url");t&&t!=="https://via.placeholder.com/300x400"?this._loadImage(t):(e.classList.add("image-loaded"),r.style.display="none",n&&(n.style.display="block"))}_loadImage(r){const e=this.shadowRoot.querySelector(".card-image"),n=this.shadowRoot.querySelector(".image-container");!e||!n||(this.imageLoaded=!1,e.classList.remove("loaded"),n.classList.remove("image-loaded"),e.style.display="block",e.src=r)}_getRelativeDate(r){if(!r)return"";const[e,n,t]=r.split("-").map(Number),o=new Date(e,n-1,t),i=new Date;o.setHours(0,0,0,0),i.setHours(0,0,0,0);const s=i-o,a=Math.floor(s/(1e3*60*60*24));if(a===0)return"Listed today";if(a===1)return"Listed yesterday";if(a<7)return`Listed ${a} days ago`;if(a<30){const c=Math.floor(a/7);return`Listed ${c} week${c>1?"s":""} ago`}if(a<365){const c=Math.floor(a/30);return`Listed ${c} month${c>1?"s":""} ago`}return`Listed ${o.toLocaleDateString()}`}attributeChangedCallback(r,e,n){e!==n&&this.shadowRoot&&(this._updateContent(),r==="image-url"&&n&&this._loadImage(n))}_updateContent(){const r=this.shadowRoot.querySelector(".card-title"),e=this.shadowRoot.querySelector(".card-price"),n=this.shadowRoot.querySelector(".card-image"),t=this.shadowRoot.querySelector(".card-date"),o=this.getAttribute("title");r&&(r.textContent=o||"");const i=this.getAttribute("price");e&&(e.textContent=i?`$${i}`:""),n&&(n.alt=o||"Product image");const s=this.getAttribute("date");t&&(t.textContent=s?this._getRelativeDate(s):"")}}customElements.define("product-card",S);class C extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});const r=document.createElement("template");r.innerHTML=`
          <style>${k}</style>
          ${v}
      `,this.shadowRoot.appendChild(r.content.cloneNode(!0))}static get observedAttributes(){return["new","low","high"]}connectedCallback(){console.log("BrowsePage connected"),this.shadowRoot.getElementById("dropdown").addEventListener("change",e=>{const n=e.target.value;console.log(e.target.value),["new","low","high"].forEach(t=>this.removeAttribute(t)),this.setAttribute(n)}),setTimeout(()=>{const e=this.shadowRoot.querySelector("category-button");e&&e.setAttribute("selected","")},100)}attributeChangedCallback(r,e,n){r!==null&&this.dispatchEvent(new CustomEvent("sort-change",{bubbles:!0,composed:!0}))}}customElements.define("browse-page",C);const R=`<div class="category-button">\r
    <button class="label" type="button">\r
        <slot></slot>\r
    </button>\r
</div>`,_=`.label {\r
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
}`;class F extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});const r=document.createElement("template");r.innerHTML=`
            <style>${_}</style>
            ${R}
        `,this.shadowRoot.appendChild(r.content.cloneNode(!0))}static get observedAttributes(){return["selected"]}connectedCallback(){this.shadowRoot.querySelector(".label").addEventListener("click",()=>{const n=this.shadowRoot.querySelector("slot").assignedNodes().map(o=>o.textContent).join("").trim(),t=new CustomEvent("filter-changed",{bubbles:!0,composed:!0,detail:{category:n}});this.dispatchEvent(t)})}attributeChangedCallback(r,e,n){if(r==="selected"){const t=this.hasAttribute("selected");this.updateSelected(t)}}updateSelected(r){this.shadowRoot.querySelector(".label").classList.toggle("selected",r)}}customElements.define("category-button",F);const z=`<div class="overlay">\r
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
</div>`,A=`/* UCSD Palette */\r
:host {\r
  --ucsd-blue: #04133B;\r
  --ucsd-gold: #F3C114;\r
  --ucsd-white: #FFFFFF;\r
  --ucsd-gold-dark: #B89B0E;\r
  font-family: system-ui, sans-serif;\r
  display: block;\r
}\r
\r
/* Layout */\r
.product-detail {\r
  border-top: 40px solid var(--ucsd-blue);\r
  padding: 2rem;\r
  background: var(--ucsd-white);\r
  display: flex;\r
  border-radius: 12px;\r
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\r
  width: 80%;\r
  max-height: 90vh;\r
  max-width: 900px;\r
  position: relative;\r
  margin: auto;\r
  transform: translateY(10vh);\r
  gap: 2rem;\r
}\r
\r
/* Gallery */\r
.gallery {\r
  flex: 1;\r
  display: flex;\r
  flex-direction: column;\r
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
  max-width: 100%;\r
  max-height: 100%;\r
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
  gap: 0.5em;\r
  background: var(--ucsd-gold);\r
  color: var(--ucsd-blue);\r
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
.send-btn:hover, .send-btn:focus {\r
  background: var(--ucsd-gold-dark);\r
  transform: translateY(-1px);\r
  outline: none;\r
}\r
\r
.send-btn svg {\r
  width: 14px;\r
  height: 14px;\r
  fill: currentColor;\r
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
  transition: background 0.2s;\r
}\r
\r
.close-btn:hover, .close-btn:focus {\r
  color: var(--ucsd-gold);\r
  outline: none;\r
}`;class B extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._currentIndex=0,this._isVisible=!1;const r=document.createElement("template");r.innerHTML=`
      <style>${A}</style>
      ${z}
    `,this.shadowRoot.appendChild(r.content.cloneNode(!0))}static get observedAttributes(){return["name","price","condition","date","description","images"]}attributeChangedCallback(r,e,n){console.log(`Attribute changed: ${r}, Old Value: ${e}, New Value: ${n}`),e!==n&&(console.log("Updating content due to attribute change"),this._updateContent())}connectedCallback(){this._updateContent(),this._addEventListeners(),this._initializeOverlay()}get images(){return(this.getAttribute("images")||"").split(/[\s,]+/).map(r=>r.trim()).filter(Boolean)}_initializeOverlay(){const r=this.shadowRoot.querySelector(".overlay");r&&(r.style.display="none",this._isVisible=!1)}_lockBodyScroll(){document.body.style.overflow="hidden",document.body.style.paddingRight=this._getScrollbarWidth()+"px"}_unlockBodyScroll(){document.body.style.overflow="",document.body.style.paddingRight=""}_getScrollbarWidth(){const r=document.createElement("div");r.style.cssText="width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(r);const e=r.offsetWidth-r.clientWidth;return document.body.removeChild(r),e}show(){const r=this.shadowRoot.querySelector(".overlay");r&&(r.style.display="block",this._isVisible=!0,this._lockBodyScroll(),console.log("Overlay shown"))}hide(){const r=this.shadowRoot.querySelector(".overlay");r&&(r.style.display="none",this._isVisible=!1,this._unlockBodyScroll(),console.log("Overlay hidden"))}_updateContent(){console.log("Updating content with images:",this.images);const r=this.images,e=this.shadowRoot.querySelector(".main-image");e&&(e.src=r[this._currentIndex]||"",e.alt=this.getAttribute("name")||"Product image");const n=this.shadowRoot.querySelector(".thumb-strip");n&&(n.innerHTML="",r.forEach((c,g)=>{const h=document.createElement("img");h.src=c,h.alt=`Thumbnail ${g+1}`,h.className=g===this._currentIndex?"active":"",h.tabIndex=0,h.addEventListener("click",()=>{this._currentIndex=g,this._updateContent()}),n.appendChild(h)}));const t=this.shadowRoot.querySelector(".product-name");t&&(t.textContent=this.getAttribute("name")||"");const o=this.shadowRoot.querySelector(".price");o&&(o.textContent=this.getAttribute("price")?`$${this.getAttribute("price")}`:"");const i=this.shadowRoot.querySelector(".condition");i&&(i.textContent=this.getAttribute("condition")||"");const s=this.shadowRoot.querySelector(".date");s&&(s.textContent=this.getAttribute("date")||"");const a=this.shadowRoot.querySelector(".description-block");a&&(a.textContent=this.getAttribute("description")||"")}_addEventListeners(){var n,t,o;(n=this.shadowRoot.querySelector(".gallery"))==null||n.addEventListener("keydown",i=>{i.key==="ArrowLeft"&&this._cycleImage(-1),i.key==="ArrowRight"&&this._cycleImage(1)}),(t=this.shadowRoot.querySelector(".send-btn"))==null||t.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("contact-seller",{bubbles:!0,composed:!0}))}),(o=this.shadowRoot.querySelector(".close-btn"))==null||o.addEventListener("click",()=>{this.hide()});const r=this.shadowRoot.querySelector(".overlay");r==null||r.addEventListener("click",i=>{i.target===r&&this.hide()});const e=this.shadowRoot.querySelector(".product-detail");e==null||e.addEventListener("click",i=>{i.stopPropagation()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&this._isVisible&&this.hide()})}_cycleImage(r){const e=this.images;e.length!==0&&(this._currentIndex=(this._currentIndex+r+e.length)%e.length,this._updateContent())}disconnectedCallback(){this._isVisible&&this._unlockBodyScroll()}}customElements.define("product-detail",B);const T=`<div class="hero-content">\r
    <div class="hero-text">\r
        <h1>DISCOVER<br>BUY OR <span class="sell-color">SELL.</span></h1>\r
        <a\r
            href="#marketplace"\r
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
            <source src="geiselV.mp4" type="video/mp4">\r
        </video>\r
    </div>\r
</div>`,q=`/* ─── VARIABLES & RESET ─── */\r
:root {\r
  --blue: #04133B;\r
  --gold: #F3C114;\r
  --white: #FFFFFF;\r
  --font: "Segoe UI", Arial, sans-serif;\r
  --navy-text: #04133B;\r
}\r
\r
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
}\r
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
\r
  font-size: calc(4rem + 4vw);\r
  line-height: 1.1;\r
  font-weight: 800;\r
  margin-bottom: 1.5rem;\r
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);\r
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
}`;class $ extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});const r=document.createElement("template");r.innerHTML=`
      <style>${q}</style>
      ${T}
    `,this.shadowRoot.appendChild(r.content.cloneNode(!0))}connectedCallback(){}}customElements.define("hero-banner",$);const I=`<!DOCTYPE html>\r
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
                <video\r
                    autoplay\r
                    muted\r
                    loop\r
                    playsinline\r
                >\r
                    <source src="lajolla.mp4" type="video/mp4">\r
                </video>\r
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
</html>`,M=`:root {\r
    --blue: #04133B;\r
    --gold: #F3C114;\r
    --white: #FFFFFF;\r
    --shadow: 0 8px 32px rgba(0, 0, 0, 0.15);\r
    --text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);\r
}\r
\r
* {\r
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
}`;class P extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});const r=document.createElement("template");r.innerHTML=`
      <style>${M}</style>
      ${I}
    `,this.shadowRoot.appendChild(r.content.cloneNode(!0)),this.activeCategory="all"}connectedCallback(){this.setupEventListeners(),console.log("SearchHero connected successfully")}setupEventListeners(){const r=this.shadowRoot.querySelector(".search-input"),e=this.shadowRoot.querySelector(".search-button"),n=()=>{const o=r==null?void 0:r.value.trim();o&&(this.dispatchEvent(new CustomEvent("search-submitted",{bubbles:!0,composed:!0,detail:{searchTerm:o,category:this.activeCategory}})),console.log(`Search: "${o}" in category: ${this.activeCategory}`))};e==null||e.addEventListener("click",n),r==null||r.addEventListener("keypress",o=>{o.key==="Enter"&&n()});const t=this.shadowRoot.querySelectorAll(".category-btn");t.forEach(o=>{o.addEventListener("click",()=>{t.forEach(i=>i.classList.remove("active")),o.classList.add("active"),this.activeCategory=o.getAttribute("data-category"),this.dispatchEvent(new CustomEvent("category-selected",{bubbles:!0,composed:!0,detail:{category:this.activeCategory}})),console.log(`Category selected: ${this.activeCategory}`)})})}}customElements.define("search-banner",P);const H=`<div class="chat-bubble">\r
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
</div>`,j=`:host {\r
    --blue: #04133B;\r
    --gold: #F3C114;\r
    --white: #FFFFFF;\r
    --navy-text: #04133B;\r
    display: block;\r
    position: fixed;\r
    bottom: 20px;\r
    right: 20px;\r
    border: transparent;\r
    border-radius: 8px;\r
    font-family: sans-serif;\r
    z-index: 999;\r
}\r
/* Chat Bubble Styles */\r
.chat-bubble {\r
    position: relative;\r
    width: 60px;\r
    height: 60px;\r
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
    width: 300px;\r
}\r
.back-button {\r
    cursor: pointer;\r
}`;class D extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._conversations=[{id:1,name:"Alice",preview:"Hey!",timestamp:"10:32 AM",unread:!0},{id:2,name:"Bob",preview:"See you soon.",timestamp:"9:14 AM",unread:!1},{id:3,name:"Carol",preview:"Got it.",timestamp:"Yesterday",unread:!0}]}connectedCallback(){const r=document.createElement("template");r.innerHTML=`<style>${j}</style>${H}`,this.shadowRoot.appendChild(r.content.cloneNode(!0)),this.shadowRoot.querySelector(".close-icon").addEventListener("click",()=>this.hideWidget()),this._handleEsc=n=>{n.key==="Escape"&&this.isConnected&&this.parentElement&&this.hideWidget()},this.shadowRoot.querySelector(".chat-bubble").addEventListener("click",()=>{this.toggleWidget()}),this.shadowRoot.querySelector(".widget-container").style.display="none",this._renderConversations(),this._isVisible=!1,document.addEventListener("keydown",this._handleEsc),this.shadowRoot.querySelector("input").addEventListener("input",n=>{const t=n.target.value.toLowerCase();this._renderConversations(t)}),this._renderConversations();const e=this.shadowRoot.querySelector(".back-button");e&&e.addEventListener("click",()=>{this.shadowRoot.querySelector(".chat-screen").classList.add("hidden"),this.shadowRoot.querySelector(".convo-list").style.display="block",this.shadowRoot.querySelector("header").style.display="flex",this.shadowRoot.querySelector("input").style.display="block"})}toggleWidget(){this._isVisible?this.hideWidget():this.showWidget()}showWidget(){this.shadowRoot.querySelector(".widget-container").style.display="block",this.shadowRoot.querySelector(".chat-bubble").style.display="none",this._isVisible=!0}hideWidget(){this.shadowRoot.querySelector(".widget-container").style.display="none",this.shadowRoot.querySelector(".chat-bubble").style.display="flex",this._isVisible=!1}disconnectedCallback(){document.removeEventListener("keydown",this._handleEsc),document.body.style.overflow=""}_renderConversations(r=""){const e=this.shadowRoot.querySelector(".convo-list");e.innerHTML="",this._conversations.filter(n=>n.name.toLowerCase().includes(r)).forEach(n=>{const t=document.createElement("div");t.classList.add("convo"),t.innerHTML=`
            <div class="avatar"></div>
            <div class="details">
            <div>
              <span class="name">${n.name}</span>
              <span class="timestamp">${n.timestamp}</span>
            </div>
            <div>${n.preview}</div>
            </div>
            ${n.unread?'<div class="unread-badge"></div>':""}
            `,t.addEventListener("click",()=>{this.shadowRoot.querySelector(".convo-list").style.display="none",this.shadowRoot.querySelector("header").style.display="none",this.shadowRoot.querySelector("input").style.display="none";const o=this.shadowRoot.querySelector(".chat-screen");o.classList.remove("hidden"),o.querySelector(".chat-title").textContent=n.name;const i=o.querySelector(".messages");i.innerHTML=`<div class="message">${n.preview}</div>`,this.dispatchEvent(new CustomEvent("chat-open",{detail:{id:n.id},bubbles:!0,composed:!0}))}),e.appendChild(t)})}}customElements.define("chat-widget",D);
