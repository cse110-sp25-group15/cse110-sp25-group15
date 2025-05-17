import supabase from '../utils/supabase.js';
import { CategoryEnum } from '../constants/CategoryEnum.js';

export class ListingModel {
  constructor() {
    this.listings = [];
  }
  
  /**
   * Fetches all listings from the database
   * @returns {Promise<Array>} Array of listing objects
   */
  async fetchAllListings() {
    try {
      const { data: listings, error } = await supabase
        .from('listings')
        .select();
      
      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }
      
      this.listings = listings;
      return this.listings;
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      throw err;
    }
  }
  
  async fetchListingsByCategory(category) {
    if (!Object.values(CategoryEnum).includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }

    try {
      const { data: listings, error } = await supabase
        .from('listings')
        .select()
        .eq('category', category);

      if (error) {
        console.error(`Error fetching ${category} listings:`, error);
        throw error;
      }

      return listings;
    } catch (err) {
      console.error(`Failed to fetch ${category} listings:`, err);
      throw err;
    }
  }
  
  /**
   * Gets a listing by ID
   * @param {number} listingId - The ID of the listing to retrieve
   * @returns {Object|null} The listing object or null if not found
   */
  getListingById(listingId) {
    return this.listings.find((listing) => listing.listing_id === listingId) || null;
  }
  
  /**
   * Formats a listing object for presentation
   * 
   * fomatted listing is an object with the following properties:
   * - listing_id: The ID of the listing
   * - title: The title of the listing
   * - price: The price of the listing
   * - image_url: The URL of the listing's thumbnail image
   * 
   * @param {Object} listing - The raw listing data
   * @returns {Object} Formatted listing for the view
   * 
   */
  formatListingForView(listing) {
    return {
      listing_id: listing.listing_id,
      title: listing.title,
      price: listing.price,
      image_url: listing.thumbnail || 'https://via.placeholder.com/300x400',
    };
  }
}