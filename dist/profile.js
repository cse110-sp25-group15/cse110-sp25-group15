
import{s as a}from"./bottom-nav.js";import"./product-card.js";const c=`<div class="profile-container">\r

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
</div>`,p=`\r
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

}`;class h extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.user=null}connectedCallback(){const r=document.createElement("template");r.innerHTML=`<style>${p}</style>${c}`,this.shadowRoot.appendChild(r.content.cloneNode(!0)),this.setupElements(),this.loadUserProfile(),this.setupEventListeners()}setupElements(){this.profileCard=this.shadowRoot.querySelector(".profile-card"),this.avatarEl=this.shadowRoot.querySelector(".profile-avatar"),this.nameEl=this.shadowRoot.querySelector(".profile-name"),this.emailEl=this.shadowRoot.querySelector(".profile-email"),this.memberSinceEl=this.shadowRoot.querySelector(".member-since"),this.listingsCountEl=this.shadowRoot.querySelector(".listings-count"),this.signOutBtn=this.shadowRoot.querySelector(".sign-out-btn"),this.loadingState=this.shadowRoot.querySelector(".loading-state"),this.errorState=this.shadowRoot.querySelector(".error-state")}setupEventListeners(){var r;(r=this.signOutBtn)==null||r.addEventListener("click",async()=>{await a.auth.signOut(),window.location.href="/cse110-sp25-group15/"}),a.auth.onAuthStateChange((n,e)=>{n==="SIGNED_OUT"&&(window.location.href="/cse110-sp25-group15/")})}async loadUserProfile(){try{this.showLoading();const{data:{user:r},error:n}=await a.auth.getUser();if(!r||n){this.showError("Please sign in to view your profile"),setTimeout(()=>{window.location.href="/cse110-sp25-group15/"},2e3);return}this.user=r;const{count:e,error:t}=await a.from("listings").select("listing_id",{count:"exact",head:!0}).eq("user_id",r.id);t&&console.error("Error fetching listings count:",t),this.updateProfileUI(r,e||0),this.hideLoading()}catch(r){console.error("Error loading profile:",r),this.showError("Failed to load profile data")}}updateProfileUI(r,n){var s;const e=this.getUserAvatarUrl(r);if(e){const i=document.createElement("img");i.src=e,i.alt="Profile avatar",i.onerror=()=>{i.remove(),this.setAvatarFallback(r)},this.avatarEl.innerHTML="",this.avatarEl.appendChild(i)}else this.setAvatarFallback(r);this.nameEl.textContent=((s=r.user_metadata)==null?void 0:s.full_name)||r.email.split("@")[0],this.emailEl.textContent=r.email;const o=new Date(r.created_at).toLocaleDateString("en-US",{month:"long",year:"numeric"});this.memberSinceEl.textContent=`Member since ${o}`,this.listingsCountEl.textContent=n}getUserAvatarUrl(r){var n,e,t,o;return((t=(e=(n=r==null?void 0:r.identities)==null?void 0:n[0])==null?void 0:e.identity_data)==null?void 0:t.avatar_url)||((o=r==null?void 0:r.user_metadata)==null?void 0:o.avatar_url)}setAvatarFallback(r){var t;const n=((t=r==null?void 0:r.user_metadata)==null?void 0:t.full_name)||(r==null?void 0:r.email)||"User",e=this.getInitials(n);this.avatarEl.innerHTML=`<span class="avatar-initials">${e}</span>`}getInitials(r){if(!r)return"U";const n=r.split(" ").filter(Boolean);return n.length===0?"U":n.length===1?n[0][0].toUpperCase():(n[0][0]+n[n.length-1][0]).toUpperCase()}showLoading(){this.loadingState.style.display="flex",this.profileCard.style.display="none",this.errorState.style.display="none"}hideLoading(){this.loadingState.style.display="none",this.profileCard.style.display="flex"}showError(r){this.loadingState.style.display="none",this.profileCard.style.display="none",this.errorState.style.display="flex";const n=this.shadowRoot.querySelector(".error-message");n&&(n.textContent=r)}}customElements.define("profile-info",h);const g=`<div class="my-listings-container">\r

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
        <svg\r
            width="80"\r
            height="80"\r
            viewBox="0 0 24 24"\r
            fill="none"\r
            stroke="#ccc"\r
            stroke-width="2"\r
        >\r
            <rect\r
                x="3"\r
                y="3"\r
                width="18"\r
                height="18"\r
                rx="2"\r
                ry="2"\r
            ></rect>\r
            <line\r
                x1="12"\r
                y1="8"\r
                x2="12"\r
                y2="16"\r
            ></line>\r
            <line\r
                x1="8"\r
                y1="12"\r
                x2="16"\r
                y2="12"\r
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
    <edit-listing-modal></edit-listing-modal>\r
</div>`,u=`:host {\r
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
/* Updated Card Wrapper - No overlap solution */\r
.listing-card-wrapper {\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
  gap: 0.5rem;\r
}\r
\r
/* Product card should not be affected by wrapper hover */\r
.listing-card-wrapper product-card {\r
  width: 100%;\r
  transition: transform 0.2s ease, box-shadow 0.2s ease;\r
}\r
\r
.listing-card-wrapper:hover product-card {\r
  transform: translateY(-2px);\r
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);\r
}\r
\r
/* Card Actions - Now positioned below the card */\r
.card-actions {\r
  display: flex;\r
  justify-content: center;\r
  gap: 0.5rem;\r
  padding: 0.5rem;\r
  background: #f8f9fa;\r
  border-radius: 8px;\r
  opacity: 0;\r
  visibility: hidden;\r
  transform: translateY(-10px);\r
  transition: all 0.2s ease;\r
}\r
\r
.listing-card-wrapper:hover .card-actions {\r
  opacity: 1;\r
  visibility: visible;\r
  transform: translateY(0);\r
}\r
\r
/* Alternative overlay design (if you prefer overlay) */\r
.listing-card-wrapper.overlay-style {\r
  position: relative;\r
}\r
\r
.listing-card-wrapper.overlay-style .card-actions {\r
  position: absolute;\r
  bottom: 10px;\r
  left: 50%;\r
  transform: translateX(-50%) translateY(10px);\r
  background: rgba(255, 255, 255, 0.95);\r
  backdrop-filter: blur(10px);\r
  border-radius: 8px;\r
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\r
  padding: 0.5rem;\r
}\r
\r
.listing-card-wrapper.overlay-style:hover .card-actions {\r
  transform: translateX(-50%) translateY(0);\r
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
  transition: all 0.2s ease;\r
}\r
\r
.edit-btn {\r
  background: var(--gold);\r
  color: var(--navy-text);\r
}\r
\r
.edit-btn:hover {\r
  background: #d4a90f;\r
  transform: scale(1.05);\r
}\r
\r
.delete-btn {\r
  background: var(--danger);\r
  color: var(--white);\r
}\r
\r
.delete-btn:hover {\r
  background: #b71c1c;\r
  transform: scale(1.05);\r
}\r
\r
/* Edit Modal */\r
edit-listing-modal {\r
  position: relative;\r
  z-index: 1100;\r
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
  \r
  .card-actions {\r
    opacity: 1;\r
    visibility: visible;\r
    transform: translateY(0);\r
  }\r
}`,m=`<div class="overlay">\r
    <div class="edit-modal">\r
        \r
        <div class="modal-header">\r
            <h2>Edit Listing</h2>\r
            <button
                class="close-btn"
                type="button"
                aria-label="Close"
            >&times;</button>\r
        </div>\r
        \r
        <form class="edit-form">\r
            <div class="form-grid">\r
               \r
                <div class="media-section">\r
                    <h3 class="section-title">Photos & Videos</h3>\r
                    <div class="current-media">\r
                        <img
                            class="current-thumbnail"
                            src=""
                            alt="Current listing image"
                        >\r
                        <div class="media-actions">\r
                            <label for="media-update" class="change-media-btn">\r
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >\r
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>\r
                                    <circle
                                        cx="12"
                                        cy="13"
                                        r="4"
                                    ></circle>\r
                                </svg>\r
                                Change Photo\r
                            </label>\r
                            <input
                                type="file"
                                id="media-update"
                                accept="image/*,video/*"
                                hidden
                            >\r
                        </div>\r
                    </div>\r
                    <div class="preview-new-media"></div>\r
                </div>\r
\r
               \r
                <div class="form-section">\r
                    <h3 class="section-title">Item Details</h3>\r
                    \r
                    <div class="form-group">\r
                        <label for="edit-title">Title</label>\r
                        <input
                            type="text"
                            id="edit-title"
                            name="title"
                            required
                        >\r
                    </div>\r
\r
                    <div class="form-row">\r
                        <div class="form-group">\r
                            <label for="edit-price">Price</label>\r
                            <div class="price-input-wrapper">\r
                                <span class="price-symbol">$</span>\r
                                <input
                                    type="text"
                                    id="edit-price"
                                    name="price"
                                    required
                                >\r
                            </div>\r
                        </div>\r
\r
                        <div class="form-group">\r
                            <label for="edit-condition">Condition</label>\r
                            <select
                                id="edit-condition"
                                name="condition"
                                required
                            >\r
                                <option value="New">New</option>\r
                                <option value="Like New">Like New</option>\r
                                <option value="Lightly Used">Lightly Used</option>\r
                                <option value="Used">Used</option>\r
                            </select>\r
                        </div>\r
                    </div>\r
\r
                    <div class="form-group">\r
                        <label for="edit-category">Category</label>\r
                        <select
                            id="edit-category"
                            name="category"
                            required
                        >\r
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
                        <label for="edit-description">Description</label>\r
                        <textarea
                            id="edit-description"
                            name="description"
                            rows="5"
                        ></textarea>\r
                        <div class="word-count">0/250</div>\r
                    </div>\r
\r
                    <div class="form-actions">\r
                        <button type="button" class="btn-cancel">Cancel</button>\r
                        <button type="submit" class="btn-save">\r
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >\r
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>\r
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>\r
                                <polyline points="7 3 7 8 15 8"></polyline>\r
                            </svg>\r
                            Save Changes\r
                        </button>\r
                    </div>\r
                </div>\r
            </div>\r
        </form>\r
    </div>\r
</div>`,f=`\r
:host {\r
    --ucsd-blue: #04133B;\r
    --ucsd-gold: #F3C114;\r
    --ucsd-white: #FFFFFF;\r
    --ucsd-gold-dark: #D4A90F;\r
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\r
}\r
\r
\r
.overlay {\r
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
.overlay.visible {\r
    display: flex;\r
}\r
\r
.edit-modal {\r
    background: var(--ucsd-white);\r
    width: 100%;\r
    max-width: 900px;\r
    max-height: 90vh;\r
    border-radius: 12px;\r
    overflow: hidden;\r
    display: flex;\r
    flex-direction: column;\r
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);\r
}\r
\r
.modal-header {\r
    background: var(--ucsd-blue);\r
    color: var(--ucsd-white);\r
    padding: 1.5rem 2rem;\r
    display: flex;\r
    justify-content: space-between;\r
    align-items: center;\r
}\r
\r
.modal-header h2 {\r
    margin: 0;\r
    font-size: 1.5rem;\r
    font-weight: 600;\r
}\r
\r
.close-btn {\r
    background: transparent;\r
    border: none;\r
    color: var(--ucsd-white);\r
    font-size: 2rem;\r
    cursor: pointer;\r
    padding: 0;\r
    width: 40px;\r
    height: 40px;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    border-radius: 50%;\r
    transition: all 0.2s ease;\r
}\r
\r
.close-btn:hover {\r
    background: rgba(255, 255, 255, 0.1);\r
    color: var(--ucsd-gold);\r
}\r
\r
.edit-form {\r
    overflow-y: auto;\r
    flex: 1;\r
    padding: 3rem;\r
}\r
\r
.form-grid {\r
    display: grid;\r
    grid-template-columns: 1fr 1fr;\r
    gap: 3rem;\r
}\r
\r
.section-title {\r
    color: var(--ucsd-blue);\r
    font-size: 1.25rem;\r
    font-weight: 600;\r
    margin: 0 0 1.5rem 0;\r
}\r
\r
/* Media Section */\r
.media-section {\r
    display: flex;\r
    flex-direction: column;\r
}\r
\r
.current-media {\r
    background: #f8f9fa;\r
    border-radius: 12px;\r
    padding: 1.5rem;\r
    display: flex;\r
    flex-direction: column;\r
    align-items: center;\r
    gap: 1rem;\r
}\r
\r
.current-thumbnail {\r
    width: 100%;\r
    max-width: 300px;\r
    height: 300px;\r
    object-fit: cover;\r
    border-radius: 8px;\r
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\r
}\r
\r
.media-actions {\r
    display: flex;\r
    gap: 1rem;\r
}\r
\r
.change-media-btn {\r
    display: inline-flex;\r
    align-items: center;\r
    gap: 0.5rem;\r
    background: var(--ucsd-gold);\r
    color: var(--ucsd-blue);\r
    padding: 0.75rem 1.5rem;\r
    border-radius: 6px;\r
    font-weight: 500;\r
    cursor: pointer;\r
    transition: all 0.2s ease;\r
}\r
\r
.change-media-btn:hover {\r
    background: var(--ucsd-gold-dark);\r
    transform: translateY(-1px);\r
    box-shadow: 0 4px 12px rgba(243, 193, 20, 0.3);\r
}\r
\r
.preview-new-media {\r
    margin-top: 1rem;\r
}\r
\r
.preview-new-media img {\r
    width: 100%;\r
    max-width: 300px;\r
    height: 200px;\r
    object-fit: cover;\r
    border-radius: 8px;\r
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\r
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
    color: var(--ucsd-blue);\r
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
    color: var(--ucsd-blue);\r
}\r
\r
input[type="text"]:focus,\r
select:focus,\r
textarea:focus {\r
    outline: none;\r
    border-color: var(--ucsd-gold);\r
    box-shadow: 0 0 0 3px rgba(243, 193, 20, 0.1);\r
}\r
\r
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
select {\r
    appearance: none;\r
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");\r
    background-repeat: no-repeat;\r
    background-position: right 1rem center;\r
    padding-right: 2.5rem;\r
}\r
\r
textarea {\r
    resize: vertical;\r
    min-height: 100px;\r
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
/* Form Actions */\r
.form-actions {\r
    display: flex;\r
    gap: 1rem;\r
    margin-top: 2rem;\r
    justify-content: flex-end;\r
}\r
\r
.btn-cancel,\r
.btn-save {\r
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
}\r
\r
.btn-cancel {\r
    background: white;\r
    color: var(--ucsd-blue);\r
    border: 2px solid var(--ucsd-blue);\r
}\r
\r
.btn-cancel:hover {\r
    background: var(--ucsd-blue);\r
    color: white;\r
}\r
\r
.btn-save {\r
    background: var(--ucsd-gold);\r
    color: var(--ucsd-blue);\r
}\r
\r
.btn-save:hover {\r
    background: var(--ucsd-gold-dark);\r
    transform: translateY(-1px);\r
    box-shadow: 0 4px 12px rgba(243, 193, 20, 0.3);\r
}\r
\r
/* Loading State */\r
.loading-overlay {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    right: 0;\r
    bottom: 0;\r
    background: rgba(255, 255, 255, 0.9);\r
    display: none;\r
    align-items: center;\r
    justify-content: center;\r
    border-radius: 12px;\r
    z-index: 10;\r
}\r
\r
.loading-overlay.visible {\r
    display: flex;\r
}\r
\r
.spinner {\r
    width: 40px;\r
    height: 40px;\r
    border: 3px solid #f3f3f3;\r
    border-top: 3px solid var(--ucsd-gold);\r
    border-radius: 50%;\r
    animation: spin 1s linear infinite;\r
}\r
\r
@keyframes spin {\r
    0% { transform: rotate(0deg); }\r
    100% { transform: rotate(360deg); }\r
}\r
\r

/* Responsive */\r
@media (max-width: 768px) {\r
    .form-grid {\r
        grid-template-columns: 1fr;\r
        gap: 2rem;\r
    }\r
    \r
    .form-row {\r
        grid-template-columns: 1fr;\r
        gap: 1rem;\r
    }\r
    \r
    .edit-modal {\r
        max-height: 100vh;\r
        border-radius: 0;\r
    }\r
    \r
    .form-actions {\r
        flex-direction: column-reverse;\r
    }\r
    \r
    .btn-cancel,\r
    .btn-save {\r
        width: 100%;\r
        justify-content: center;\r
    }\r

}`;class v extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});const r=document.createElement("template");r.innerHTML=`<style>${f}</style>${m}`,this.shadowRoot.appendChild(r.content.cloneNode(!0)),this.currentListing=null,this.newImageFile=null,this._isVisible=!1}connectedCallback(){this.setupElements(),this.setupEventListeners()}setupElements(){this.overlay=this.shadowRoot.querySelector(".overlay"),this.form=this.shadowRoot.querySelector(".edit-form"),this.titleInput=this.shadowRoot.querySelector("#edit-title"),this.priceInput=this.shadowRoot.querySelector("#edit-price"),this.conditionSelect=this.shadowRoot.querySelector("#edit-condition"),this.categorySelect=this.shadowRoot.querySelector("#edit-category"),this.descriptionTextarea=this.shadowRoot.querySelector("#edit-description"),this.currentThumbnail=this.shadowRoot.querySelector(".current-thumbnail"),this.mediaInput=this.shadowRoot.querySelector("#media-update"),this.previewContainer=this.shadowRoot.querySelector(".preview-new-media"),this.wordCounter=this.shadowRoot.querySelector(".word-count"),this.loadingOverlay=this.shadowRoot.querySelector(".loading-overlay")}setupEventListeners(){var r,n,e,t,o,s,i;(r=this.shadowRoot.querySelector(".close-btn"))==null||r.addEventListener("click",()=>{this.hide()}),(n=this.shadowRoot.querySelector(".btn-cancel"))==null||n.addEventListener("click",()=>{this.hide()}),(e=this.form)==null||e.addEventListener("submit",this.handleSubmit.bind(this)),(t=this.mediaInput)==null||t.addEventListener("change",this.handleMediaChange.bind(this)),(o=this.descriptionTextarea)==null||o.addEventListener("input",this.updateWordCount.bind(this)),(s=this.priceInput)==null||s.addEventListener("input",this.formatPrice.bind(this)),document.addEventListener("keydown",d=>{d.key==="Escape"&&this._isVisible&&this.hide()}),(i=this.overlay)==null||i.addEventListener("click",d=>{d.target===this.overlay&&this.hide()})}show(r){if(!r){console.error("No listing data provided");return}this.currentListing=r,this.populateForm(r),this.overlay.classList.add("visible"),this._isVisible=!0,this.lockBodyScroll()}hide(){this.overlay.classList.remove("visible"),this._isVisible=!1,this.unlockBodyScroll(),this.resetForm()}lockBodyScroll(){document.body.style.overflow="hidden";const r=window.innerWidth-document.documentElement.clientWidth;document.body.style.paddingRight=`${r}px`}unlockBodyScroll(){document.body.style.overflow="",document.body.style.paddingRight=""}populateForm(r){this.titleInput.value=r.title||"",this.priceInput.value=r.price||"",this.conditionSelect.value=r.condition||"",this.categorySelect.value=r.category||"",this.descriptionTextarea.value=r.description||"",r.thumbnail?this.currentThumbnail.src=r.thumbnail:this.currentThumbnail.src="https://via.placeholder.com/300x300?text=No+Image",this.updateWordCount()}handleMediaChange(r){const n=r.target.files[0];if(!n)return;if(!n.type.startsWith("image/")&&!n.type.startsWith("video/")){alert("Please select a valid image or video file");return}this.newImageFile=n;const e=new FileReader;e.onload=t=>{this.previewContainer.innerHTML=`

        <img src="${t.target.result}" alt="New image preview">
      `},e.readAsDataURL(n)}updateWordCount(){const n=this.descriptionTextarea.value.trim().split(/\s+/).filter(Boolean).length;this.wordCounter.textContent=`${n}/250`,n>250?this.wordCounter.classList.add("exceeded"):this.wordCounter.classList.remove("exceeded")}formatPrice(r){let n=r.target.value.replace(/[^\d.]/g,"");const e=n.split(".");e.length>2&&(n=e[0]+"."+e.slice(1).join("")),e[1]&&e[1].length>2&&(n=e[0]+"."+e[1].substring(0,2)),r.target.value=n}async handleSubmit(r){r.preventDefault();const n=this.gatherFormData(),e=this.validateForm(n);if(e.length>0){alert(e.join(`
`));return}this.showLoading();try{const t={title:n.title,price:parseFloat(n.price),condition:n.condition,category:n.category,description:n.description};this.newImageFile&&(t.newImage=this.newImageFile),this.dispatchEvent(new CustomEvent("listing-update",{bubbles:!0,composed:!0,detail:{listingId:this.currentListing.listing_id,updates:t}})),this.hideLoading(),this.hide(),this.showSuccessMessage()}catch(t){console.error("Error updating listing:",t),this.hideLoading(),alert("Failed to update listing. Please try again.")}}gatherFormData(){return{title:this.titleInput.value.trim(),price:this.priceInput.value.trim(),condition:this.conditionSelect.value,category:this.categorySelect.value,description:this.descriptionTextarea.value.trim()}}validateForm(r){const n=[];return(!r.title||r.title.length<3)&&n.push("Title must be at least 3 characters"),(!r.price||isNaN(parseFloat(r.price))||parseFloat(r.price)<=0)&&n.push("Please enter a valid price"),r.condition||n.push("Please select a condition"),r.category||n.push("Please select a category"),r.description.split(/\s+/).filter(Boolean).length>250&&n.push("Description exceeds 250 words"),n}showLoading(){if(!this.loadingOverlay){const r=document.createElement("div");r.className="loading-overlay",r.innerHTML='<div class="spinner"></div>',this.shadowRoot.querySelector(".edit-modal").appendChild(r),this.loadingOverlay=r}this.loadingOverlay.classList.add("visible")}hideLoading(){this.loadingOverlay&&this.loadingOverlay.classList.remove("visible")}showSuccessMessage(){const r=document.createElement("div");r.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 2000;
      font-weight: 500;

    `,r.textContent="Listing updated successfully!",document.body.appendChild(r),setTimeout(()=>{r.remove()},3e3)}resetForm(){this.form.reset(),this.previewContainer.innerHTML="",this.newImageFile=null,this.currentListing=null,this.wordCounter.textContent="0/250",this.wordCounter.classList.remove("exceeded")}disconnectedCallback(){this._isVisible&&this.unlockBodyScroll()}}customElements.define("edit-listing-modal",v);class y extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.listings=[],this.user=null}connectedCallback(){const r=document.createElement("template");r.innerHTML=`<style>${u}</style>${g}`,this.shadowRoot.appendChild(r.content.cloneNode(!0)),this.setupElements(),this.loadUserListings(),this.setupEventListeners()}setupElements(){this.listingsGrid=this.shadowRoot.querySelector(".listings-grid"),this.loadingState=this.shadowRoot.querySelector(".loading-state"),this.emptyState=this.shadowRoot.querySelector(".empty-state"),this.errorState=this.shadowRoot.querySelector(".error-state")}setupEventListeners(){this.shadowRoot.addEventListener("card-click",n=>{const e=n.detail.listingId;this.handleListingClick(e)}),this.shadowRoot.querySelectorAll(".create-listing-btn").forEach(n=>{n.addEventListener("click",()=>{window.location.href="/cse110-sp25-group15/list"})})}async loadUserListings(){try{this.showLoading();const{data:{user:r},error:n}=await a.auth.getUser();if(!r||n){this.showError("Please sign in to view your listings");return}this.user=r;const{data:e,error:t}=await a.from("listings").select("*").eq("user_id",r.id).order("date_posted",{ascending:!1});if(t){console.error("Error fetching listings:",t),this.showError("Failed to load your listings");return}this.listings=e||[],this.listings.length===0?this.showEmptyState():this.renderListings()}catch(r){console.error("Error loading listings:",r),this.showError("An unexpected error occurred")}}renderListings(){this.hideAllStates(),this.listingsGrid.style.display="grid",this.listingsGrid.innerHTML="",this.listings.forEach(r=>{const n=this.createListingCard(r);this.listingsGrid.appendChild(n)})}createListingCard(r){const n=document.createElement("div");n.className="listing-card-wrapper";const e=document.createElement("product-card");e.setAttribute("listing-id",r.listing_id||""),e.setAttribute("title",r.title||""),e.setAttribute("price",r.price||""),e.setAttribute("image-url",r.thumbnail||""),e.setAttribute("date",r.date_posted||"");const t=document.createElement("div");t.className="card-actions";const o=document.createElement("button");o.className="edit-btn",o.innerHTML=`

      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      Edit

    `,o.onclick=i=>{i.stopPropagation(),this.editListing(r.listing_id)};const s=document.createElement("button");return s.className="delete-btn",s.innerHTML=`

      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
      Delete

    `,s.onclick=i=>{i.stopPropagation(),this.confirmDelete(r.listing_id)},t.appendChild(o),t.appendChild(s),n.appendChild(e),n.appendChild(t),n}handleListingClick(r){console.log("Listing clicked:",r)}editListing(r){try{const n=this.listings.find(t=>t.listing_id===r);if(!n){console.error("Listing not found");return}let e=this.shadowRoot.querySelector("edit-listing-modal");e||(e=document.createElement("edit-listing-modal"),this.shadowRoot.appendChild(e)),e.show(n),e.addEventListener("listing-update",async t=>{const{listingId:o,updates:s}=t.detail;try{const{error:i}=await a.from("listings").update(s).eq("listing_id",o).eq("user_id",this.user.id);if(i)throw i;await this.loadUserListings()}catch(i){console.error("Error updating listing:",i),alert("Failed to update listing. Please try again.")}},{once:!0})}catch(n){console.error("Error editing listing:",n),alert("Failed to load listing for editing.")}}async confirmDelete(r){if(confirm("Are you sure you want to delete this listing?"))try{const{error:n}=await a.from("listings").delete().eq("listing_id",r).eq("user_id",this.user.id);if(n)throw n;this.listings=this.listings.filter(e=>e.listing_id!==r),this.listings.length===0?this.showEmptyState():this.renderListings(),this.dispatchEvent(new CustomEvent("listing-deleted",{bubbles:!0,composed:!0,detail:{listingId:r}}))}catch(n){console.error("Error deleting listing:",n),alert("Failed to delete listing. Please try again.")}}showLoading(){this.hideAllStates(),this.loadingState.style.display="flex"}showEmptyState(){this.hideAllStates(),this.emptyState.style.display="flex"}showError(r){this.hideAllStates(),this.errorState.style.display="flex";const n=this.shadowRoot.querySelector(".error-message");n&&(n.textContent=r)}hideAllStates(){this.loadingState.style.display="none",this.emptyState.style.display="none",this.errorState.style.display="none",this.listingsGrid.style.display="none"}}customElements.define("my-listings",y);document.addEventListener("DOMContentLoaded",async()=>{const{data:{user:l}}=await a.auth.getUser();if(!l){window.location.href="/cse110-sp25-group15/";return}const r=document.querySelector(".logo");r&&r.addEventListener("click",()=>{window.location.href="/cse110-sp25-group15/"}),document.addEventListener("listing-deleted",()=>{const e=document.querySelector("profile-info");e&&typeof e.loadUserProfile=="function"&&e.loadUserProfile()});const n=document.querySelector("search-box");n&&n.addEventListener("search-submit",async e=>{const t=e.detail.query;t&&(window.location.href=`/cse110-sp25-group15/?search=${encodeURIComponent(t)}`)})});

