const l=`<div class="card-container">\r
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
</div>`,c=`:host {\r
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
  object-fit: cover;\r
  border-radius: 20px;\r
  opacity: 0;\r
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
}`;class h extends HTMLElement{static get observedAttributes(){return["listing-id","title","price","image-url","date"]}constructor(){super(),this.attachShadow({mode:"open"}),this.imageLoaded=!1}connectedCallback(){var r;const e=document.createElement("template");e.innerHTML=`
      <style>${c}</style>
      ${l}
    `,this.shadowRoot.appendChild(e.content.cloneNode(!0)),this._updateContent(),this._setupImageLoading(),(r=this.shadowRoot.querySelector(".card-container"))==null||r.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("card-click",{bubbles:!0,composed:!0,detail:{listingId:this.getAttribute("listing-id")}}))})}_setupImageLoading(){const e=this.shadowRoot.querySelector(".card-image"),r=this.shadowRoot.querySelector(".image-container"),n=this.shadowRoot.querySelector(".placeholder-image");if(!e||!r)return;e.addEventListener("load",()=>{this.imageLoaded=!0,e.classList.add("loaded"),r.classList.add("image-loaded")}),e.addEventListener("error",()=>{this.imageLoaded=!1,r.classList.add("image-loaded"),e.style.display="none",n&&(n.style.display="block")});const t=this.getAttribute("image-url");t&&t!=="https://via.placeholder.com/300x400"?this._loadImage(t):(r.classList.add("image-loaded"),e.style.display="none",n&&(n.style.display="block"))}_loadImage(e){const r=this.shadowRoot.querySelector(".card-image"),n=this.shadowRoot.querySelector(".image-container");!r||!n||(this.imageLoaded=!1,r.classList.remove("loaded"),n.classList.remove("image-loaded"),r.style.display="block",r.src=e)}_getRelativeDate(e){if(!e)return"";const[r,n,t]=e.split("-").map(Number),i=new Date(r,n-1,t),a=new Date;i.setHours(0,0,0,0),a.setHours(0,0,0,0);const d=a-i,o=Math.floor(d/(1e3*60*60*24));if(o===0)return"Listed today";if(o===1)return"Listed yesterday";if(o<7)return`Listed ${o} days ago`;if(o<30){const s=Math.floor(o/7);return`Listed ${s} week${s>1?"s":""} ago`}if(o<365){const s=Math.floor(o/30);return`Listed ${s} month${s>1?"s":""} ago`}return`Listed ${i.toLocaleDateString()}`}attributeChangedCallback(e,r,n){r!==n&&this.shadowRoot&&(this._updateContent(),e==="image-url"&&n&&this._loadImage(n))}_updateContent(){const e=this.shadowRoot.querySelector(".card-title"),r=this.shadowRoot.querySelector(".card-price"),n=this.shadowRoot.querySelector(".card-image"),t=this.shadowRoot.querySelector(".card-date"),i=this.getAttribute("title");e&&(e.textContent=i||"");const a=this.getAttribute("price");r&&(r.textContent=a?`$${a}`:""),n&&(n.alt=i||"Product image");const d=this.getAttribute("date");t&&(t.textContent=d?this._getRelativeDate(d):"")}}customElements.define("product-card",h);
