import{s as o}from"./bottom-nav.js";import"./product-card.js";const d=`<div class="profile-container">\r
    <!-- Loading State -->\r
    <div class="loading-state">\r
        <div class="spinner"></div>\r
        <p>Loading profile...</p>\r
    </div>\r
\r
    <!-- Error State -->\r
    <div class="error-state">\r
        <p class="error-message">Failed to load profile</p>\r
    </div>\r
\r
    <!-- Profile Card -->\r
    <div class="profile-card">\r
        <div class="profile-header">\r
            <div class="profile-avatar"></div>\r
            <div class="profile-details">\r
                <h1 class="profile-name"></h1>\r
                <p class="profile-email"></p>\r
                <p class="member-since"></p>\r
            </div>\r
        </div>\r
    \r
        <div class="profile-stats">\r
            <div class="stat-item">\r
                <span class="stat-value listings-count">0</span>\r
                <span class="stat-label">Active Listings</span>\r
            </div>\r
        </div>\r
    \r
        <div class="profile-actions">\r
            <button class="sign-out-btn">Sign Out</button>\r
        </div>\r
    </div>\r
</div>`,c=`:host {\r
  --blue: #04133B;\r
  --gold: #F3C114;\r
  --white: #FFFFFF;\r
  --navy-text: #04133B;\r
  --light-gray: #f5f5f5;\r
  --border-light: #e5e5e5;\r
  display: block;\r
  font-family: system-ui, sans-serif;\r
}\r
\r
.profile-container {\r
  background: var(--white);\r
  border-radius: 12px;\r
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\r
  padding: 2rem;\r
}\r
\r
/* Loading State */\r
.loading-state {\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  justify-content: center;\r
  min-height: 300px;\r
  gap: 1rem;\r
}\r
\r
.spinner {\r
  width: 40px;\r
  height: 40px;\r
  border: 3px solid var(--light-gray);\r
  border-top-color: var(--gold);\r
  border-radius: 50%;\r
  animation: spin 1s linear infinite;\r
}\r
\r
@keyframes spin {\r
  to { transform: rotate(360deg); }\r
}\r
\r
/* Error State */\r
.error-state {\r
  display: none;\r
  flex-direction: column;\r
  align-items: center;\r
  justify-content: center;\r
  min-height: 300px;\r
  text-align: center;\r
}\r
\r
.error-message {\r
  color: #d32f2f;\r
  font-size: 1.1rem;\r
}\r
\r
/* Profile Card */\r
.profile-card {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 2rem;\r
}\r
\r
.profile-header {\r
  display: flex;\r
  align-items: center;\r
  gap: 2rem;\r
}\r
\r
.profile-avatar {\r
  width: 120px;\r
  height: 120px;\r
  border-radius: 50%;\r
  background: var(--gold);\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  overflow: hidden;\r
  flex-shrink: 0;\r
}\r
\r
.profile-avatar img {\r
  width: 100%;\r
  height: 100%;\r
  object-fit: cover;\r
}\r
\r
.avatar-initials {\r
  font-size: 3rem;\r
  font-weight: bold;\r
  color: var(--navy-text);\r
  text-transform: uppercase;\r
}\r
\r
.profile-details {\r
  flex: 1;\r
}\r
\r
.profile-name {\r
  font-size: 2rem;\r
  color: var(--navy-text);\r
  margin: 0 0 0.5rem 0;\r
  font-weight: 600;\r
}\r
\r
.profile-email {\r
  color: #666;\r
  font-size: 1.1rem;\r
  margin: 0 0 0.5rem 0;\r
}\r
\r
.member-since {\r
  color: #999;\r
  font-size: 0.9rem;\r
  margin: 0;\r
}\r
\r
.profile-stats {\r
  display: flex;\r
  gap: 3rem;\r
  padding: 1.5rem 0;\r
  border-top: 1px solid var(--border-light);\r
  border-bottom: 1px solid var(--border-light);\r
}\r
\r
.stat-item {\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  gap: 0.5rem;\r
}\r
\r
.stat-value {\r
  font-size: 2.5rem;\r
  font-weight: bold;\r
  color: var(--gold);\r
}\r
\r
.stat-label {\r
  color: #666;\r
  font-size: 0.9rem;\r
  text-transform: uppercase;\r
  letter-spacing: 0.05em;\r
}\r
\r
.profile-actions {\r
  display: flex;\r
  gap: 1rem;\r
}\r
\r
.sign-out-btn {\r
  background: var(--blue);\r
  color: var(--white);\r
  border: none;\r
  padding: 0.75rem 2rem;\r
  border-radius: 6px;\r
  font-size: 1rem;\r
  font-weight: 500;\r
  cursor: pointer;\r
  transition: background-color 0.2s ease;\r
}\r
\r
.sign-out-btn:hover {\r
  background: #02091f;\r
}\r
\r
@media (max-width: 768px) {\r
  .profile-container {\r
    padding: 1.5rem;\r
  }\r
  \r
  .profile-header {\r
    flex-direction: column;\r
    text-align: center;\r
  }\r
  \r
  .profile-avatar {\r
    width: 100px;\r
    height: 100px;\r
  }\r
  \r
  .avatar-initials {\r
    font-size: 2.5rem;\r
  }\r
  \r
  .profile-name {\r
    font-size: 1.5rem;\r
  }\r
  \r
  .profile-stats {\r
    justify-content: center;\r
  }\r
}`;class h extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.user=null}connectedCallback(){const r=document.createElement("template");r.innerHTML=`<style>${c}</style>${d}`,this.shadowRoot.appendChild(r.content.cloneNode(!0)),this.setupElements(),this.loadUserProfile(),this.setupEventListeners()}setupElements(){this.profileCard=this.shadowRoot.querySelector(".profile-card"),this.avatarEl=this.shadowRoot.querySelector(".profile-avatar"),this.nameEl=this.shadowRoot.querySelector(".profile-name"),this.emailEl=this.shadowRoot.querySelector(".profile-email"),this.memberSinceEl=this.shadowRoot.querySelector(".member-since"),this.listingsCountEl=this.shadowRoot.querySelector(".listings-count"),this.signOutBtn=this.shadowRoot.querySelector(".sign-out-btn"),this.loadingState=this.shadowRoot.querySelector(".loading-state"),this.errorState=this.shadowRoot.querySelector(".error-state")}setupEventListeners(){var r;(r=this.signOutBtn)==null||r.addEventListener("click",async()=>{await o.auth.signOut(),window.location.href="/cse110-sp25-group15/"}),o.auth.onAuthStateChange((n,t)=>{n==="SIGNED_OUT"&&(window.location.href="/cse110-sp25-group15/")})}async loadUserProfile(){try{this.showLoading();const{data:{user:r},error:n}=await o.auth.getUser();if(!r||n){this.showError("Please sign in to view your profile"),setTimeout(()=>{window.location.href="/cse110-sp25-group15/"},2e3);return}this.user=r;const{count:t,error:e}=await o.from("listings").select("listing_id",{count:"exact",head:!0}).eq("user_id",r.id);e&&console.error("Error fetching listings count:",e),this.updateProfileUI(r,t||0),this.hideLoading()}catch(r){console.error("Error loading profile:",r),this.showError("Failed to load profile data")}}updateProfileUI(r,n){var a;const t=this.getUserAvatarUrl(r);if(t){const s=document.createElement("img");s.src=t,s.alt="Profile avatar",s.onerror=()=>{s.remove(),this.setAvatarFallback(r)},this.avatarEl.innerHTML="",this.avatarEl.appendChild(s)}else this.setAvatarFallback(r);this.nameEl.textContent=((a=r.user_metadata)==null?void 0:a.full_name)||r.email.split("@")[0],this.emailEl.textContent=r.email;const i=new Date(r.created_at).toLocaleDateString("en-US",{month:"long",year:"numeric"});this.memberSinceEl.textContent=`Member since ${i}`,this.listingsCountEl.textContent=n}getUserAvatarUrl(r){var n,t,e,i;return((e=(t=(n=r==null?void 0:r.identities)==null?void 0:n[0])==null?void 0:t.identity_data)==null?void 0:e.avatar_url)||((i=r==null?void 0:r.user_metadata)==null?void 0:i.avatar_url)}setAvatarFallback(r){var e;const n=((e=r==null?void 0:r.user_metadata)==null?void 0:e.full_name)||(r==null?void 0:r.email)||"User",t=this.getInitials(n);this.avatarEl.innerHTML=`<span class="avatar-initials">${t}</span>`}getInitials(r){if(!r)return"U";const n=r.split(" ").filter(Boolean);return n.length===0?"U":n.length===1?n[0][0].toUpperCase():(n[0][0]+n[n.length-1][0]).toUpperCase()}showLoading(){this.loadingState.style.display="flex",this.profileCard.style.display="none",this.errorState.style.display="none"}hideLoading(){this.loadingState.style.display="none",this.profileCard.style.display="flex"}showError(r){this.loadingState.style.display="none",this.profileCard.style.display="none",this.errorState.style.display="flex";const n=this.shadowRoot.querySelector(".error-message");n&&(n.textContent=r)}}customElements.define("profile-info",h);const p=`<div class="my-listings-container">\r
    <div class="section-header">\r
        <h2>My Listings</h2>\r
        <button class="create-listing-btn">+ Create New Listing</button>\r
    </div>\r
\r
    <!-- Loading State -->\r
    <div class="loading-state">\r
        <div class="spinner"></div>\r
        <p>Loading your listings...</p>\r
    </div>\r
\r
    <!-- Empty State -->\r
    <div class="empty-state">\r
        <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ccc"
            stroke-width="2"
        >\r
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                ry="2"
            ></rect>\r
            <line
                x1="12"
                y1="8"
                x2="12"
                y2="16"
            ></line>\r
            <line
                x1="8"
                y1="12"
                x2="16"
                y2="12"
            ></line>\r
        </svg>\r
        <h3>No listings yet</h3>\r
        <p>Create your first listing to start selling on UCSD Marketplace</p>\r
        <button class="create-listing-btn">Create Your First Listing</button>\r
    </div>\r
\r
    <!-- Error State -->\r
    <div class="error-state">\r
        <p class="error-message">Failed to load listings</p>\r
    </div>\r
\r
    <!-- Listings Grid -->\r
    <div class="listings-grid"></div>\r
</div>`,g=`:host {\r
  --blue: #04133B;\r
  --gold: #F3C114;\r
  --white: #FFFFFF;\r
  --navy-text: #04133B;\r
  --light-gray: #f5f5f5;\r
  --border-light: #e5e5e5;\r
  --danger: #d32f2f;\r
  display: block;\r
  font-family: system-ui, sans-serif;\r
}\r
\r
.my-listings-container {\r
  background: var(--white);\r
  border-radius: 12px;\r
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\r
  padding: 2rem;\r
}\r
\r
.section-header {\r
  display: flex;\r
  justify-content: space-between;\r
  align-items: center;\r
  margin-bottom: 2rem;\r
}\r
\r
.section-header h2 {\r
  font-size: 1.5rem;\r
  color: var(--navy-text);\r
  margin: 0;\r
}\r
\r
.create-listing-btn {\r
  background: var(--gold);\r
  color: var(--navy-text);\r
  border: none;\r
  padding: 0.75rem 1.5rem;\r
  border-radius: 6px;\r
  font-size: 0.9rem;\r
  font-weight: 600;\r
  cursor: pointer;\r
  transition: background-color 0.2s ease;\r
}\r
\r
.create-listing-btn:hover {\r
  background: #d4a90f;\r
}\r
\r
/* Loading State */\r
.loading-state {\r
  display: none;\r
  flex-direction: column;\r
  align-items: center;\r
  justify-content: center;\r
  min-height: 300px;\r
  gap: 1rem;\r
}\r
\r
.spinner {\r
  width: 40px;\r
  height: 40px;\r
  border: 3px solid var(--light-gray);\r
  border-top-color: var(--gold);\r
  border-radius: 50%;\r
  animation: spin 1s linear infinite;\r
}\r
\r
@keyframes spin {\r
  to { transform: rotate(360deg); }\r
}\r
\r
/* Empty State */\r
.empty-state {\r
  display: none;\r
  flex-direction: column;\r
  align-items: center;\r
  justify-content: center;\r
  min-height: 300px;\r
  text-align: center;\r
  gap: 1rem;\r
}\r
\r
.empty-state svg {\r
  opacity: 0.3;\r
}\r
\r
.empty-state h3 {\r
  font-size: 1.25rem;\r
  color: var(--navy-text);\r
  margin: 0;\r
}\r
\r
.empty-state p {\r
  color: #666;\r
  margin: 0;\r
}\r
\r
/* Error State */\r
.error-state {\r
  display: none;\r
  flex-direction: column;\r
  align-items: center;\r
  justify-content: center;\r
  min-height: 300px;\r
  text-align: center;\r
}\r
\r
.error-message {\r
  color: var(--danger);\r
  font-size: 1.1rem;\r
}\r
\r
/* Listings Grid */\r
.listings-grid {\r
  display: none;\r
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));\r
  gap: 1.5rem;\r
}\r
\r
.listing-card-wrapper {\r
  position: relative;\r
  transition: transform 0.2s ease;\r
}\r
\r
.listing-card-wrapper:hover {\r
  transform: translateY(-4px);\r
}\r
\r
.listing-card-wrapper:hover .card-actions {\r
  opacity: 1;\r
  visibility: visible;\r
}\r
\r
/* Card Actions Overlay */\r
.card-actions {\r
  position: absolute;\r
  bottom: 0;\r
  left: 0;\r
  right: 0;\r
  background: rgba(0, 0, 0, 0.8);\r
  display: flex;\r
  justify-content: center;\r
  gap: 0.5rem;\r
  padding: 0.75rem;\r
  opacity: 0;\r
  visibility: hidden;\r
  transition: opacity 0.2s ease, visibility 0.2s ease;\r
  border-radius: 0 0 8px 8px;\r
}\r
\r
.edit-btn,\r
.delete-btn {\r
  display: flex;\r
  align-items: center;\r
  gap: 0.5rem;\r
  padding: 0.5rem 1rem;\r
  border: none;\r
  border-radius: 4px;\r
  font-size: 0.875rem;\r
  font-weight: 500;\r
  cursor: pointer;\r
  transition: background-color 0.2s ease;\r
}\r
\r
.edit-btn {\r
  background: var(--gold);\r
  color: var(--navy-text);\r
}\r
\r
.edit-btn:hover {\r
  background: #d4a90f;\r
}\r
\r
.delete-btn {\r
  background: var(--danger);\r
  color: var(--white);\r
}\r
\r
.delete-btn:hover {\r
  background: #b71c1c;\r
}\r
\r
@media (max-width: 768px) {\r
  .my-listings-container {\r
    padding: 1.5rem;\r
  }\r
  \r
  .section-header {\r
    flex-direction: column;\r
    gap: 1rem;\r
    align-items: stretch;\r
  }\r
  \r
  .create-listing-btn {\r
    width: 100%;\r
    text-align: center;\r
  }\r
  \r
  .listings-grid {\r
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\r
    gap: 1rem;\r
  }\r
}`;class m extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.listings=[],this.user=null}connectedCallback(){const r=document.createElement("template");r.innerHTML=`<style>${g}</style>${p}`,this.shadowRoot.appendChild(r.content.cloneNode(!0)),this.setupElements(),this.loadUserListings(),this.setupEventListeners()}setupElements(){this.listingsGrid=this.shadowRoot.querySelector(".listings-grid"),this.loadingState=this.shadowRoot.querySelector(".loading-state"),this.emptyState=this.shadowRoot.querySelector(".empty-state"),this.errorState=this.shadowRoot.querySelector(".error-state")}setupEventListeners(){this.shadowRoot.addEventListener("card-click",n=>{const t=n.detail.listingId;this.handleListingClick(t)}),this.shadowRoot.querySelectorAll(".create-listing-btn").forEach(n=>{n.addEventListener("click",()=>{window.location.href="/cse110-sp25-group15/list"})})}async loadUserListings(){try{this.showLoading();const{data:{user:r},error:n}=await o.auth.getUser();if(!r||n){this.showError("Please sign in to view your listings");return}this.user=r;const{data:t,error:e}=await o.from("listings").select("*").eq("user_id",r.id).order("date_posted",{ascending:!1});if(e){console.error("Error fetching listings:",e),this.showError("Failed to load your listings");return}this.listings=t||[],this.listings.length===0?this.showEmptyState():this.renderListings()}catch(r){console.error("Error loading listings:",r),this.showError("An unexpected error occurred")}}renderListings(){this.hideAllStates(),this.listingsGrid.style.display="grid",this.listingsGrid.innerHTML="",this.listings.forEach(r=>{const n=this.createListingCard(r);this.listingsGrid.appendChild(n)})}createListingCard(r){const n=document.createElement("div");n.className="listing-card-wrapper";const t=document.createElement("product-card");t.setAttribute("listing-id",r.listing_id||""),t.setAttribute("title",r.title||""),t.setAttribute("price",r.price||""),t.setAttribute("image-url",r.thumbnail||""),t.setAttribute("date",r.date_posted||"");const e=document.createElement("div");e.className="card-actions";const i=document.createElement("button");i.className="edit-btn",i.innerHTML=`
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      Edit
    `,i.onclick=s=>{s.stopPropagation(),this.editListing(r.listing_id)};const a=document.createElement("button");return a.className="delete-btn",a.innerHTML=`
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
      Delete
    `,a.onclick=s=>{s.stopPropagation(),this.confirmDelete(r.listing_id)},e.appendChild(i),e.appendChild(a),n.appendChild(t),n.appendChild(e),n}handleListingClick(r){console.log("Listing clicked:",r)}editListing(r){console.log("Edit listing:",r),alert("Edit functionality coming soon!")}async confirmDelete(r){if(confirm("Are you sure you want to delete this listing?"))try{const{error:n}=await o.from("listings").delete().eq("listing_id",r).eq("user_id",this.user.id);if(n)throw n;this.listings=this.listings.filter(t=>t.listing_id!==r),this.listings.length===0?this.showEmptyState():this.renderListings(),this.dispatchEvent(new CustomEvent("listing-deleted",{bubbles:!0,composed:!0,detail:{listingId:r}}))}catch(n){console.error("Error deleting listing:",n),alert("Failed to delete listing. Please try again.")}}showLoading(){this.hideAllStates(),this.loadingState.style.display="flex"}showEmptyState(){this.hideAllStates(),this.emptyState.style.display="flex"}showError(r){this.hideAllStates(),this.errorState.style.display="flex";const n=this.shadowRoot.querySelector(".error-message");n&&(n.textContent=r)}hideAllStates(){this.loadingState.style.display="none",this.emptyState.style.display="none",this.errorState.style.display="none",this.listingsGrid.style.display="none"}}customElements.define("my-listings",m);document.addEventListener("DOMContentLoaded",async()=>{const{data:{user:l}}=await o.auth.getUser();if(!l){window.location.href="/cse110-sp25-group15/";return}const r=document.querySelector(".logo");r&&r.addEventListener("click",()=>{window.location.href="/cse110-sp25-group15/"}),document.addEventListener("listing-deleted",()=>{const t=document.querySelector("profile-info");t&&typeof t.loadUserProfile=="function"&&t.loadUserProfile()});const n=document.querySelector("search-box");n&&n.addEventListener("search-submit",async t=>{const e=t.detail.query;e&&(window.location.href=`/cse110-sp25-group15/?search=${encodeURIComponent(e)}`)})});
