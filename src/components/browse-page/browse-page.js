import html from './browse-page.html?raw';
import css from './browse-page.css?raw';
import supabase from '../../supabase.js';
import '../product-card/product-card.js';
import '../../styles/flexbox.css';

class BrowsePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `
          <style>${css}</style>
          ${html}
      `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
        
    // load product listings
    this.loadListings();
  }

  async loadListings() {
    const productsContainer = this.shadowRoot.querySelector('.products-container');
    productsContainer.innerHTML = '';

    try {
      // Fetch listings - no need to query images separately
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select();
            
      if (listingsError) {
        console.error('Error fetching listings:', listingsError);
        return;
      }
        
      // For each listing, create a card component
      listings.forEach((listing) => {
        // Create product-card element
        const card = document.createElement('product-card');
                
        // Set data via the listing property
        card.listing = {
          listing_id: listing.listing_id,
          title: listing.title,
          price: listing.price,
          // Use the thumbnail URL directly from the listing
          image_url: listing.thumbnail || 'https://via.placeholder.com/300x400',
        };
                
        // Add class for flexbox layout
        card.classList.add('card');
                
        // Append to container
        productsContainer.appendChild(card);
      });
            
      console.log('Loaded listings:', listings);
    } catch (err) {
      console.error('Failed to load listings:', err);    
    }
  }
    
}

customElements.define('browse-page', BrowsePage);