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

  /**
   * Fetches listings filtered by category
   * @param {string} category - Category to filter by
   * @returns {Promise<Array>} Array of filtered listing objects
   */
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
   * Fetches listings sorted by date
   * @param {boolean} ascending - true for oldest to newest, false for newest to oldest
   * @returns {Promise<Array>} Sorted array of listing objects
   */
  async fetchAllListingsSortByDate(ascending = false) {
    try {
      const { data: listings, error } = await supabase
        .from('listings')
        .select()
        .order('date_posted', { ascending });

      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }

      return listings;
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      throw err;
    }
  }

  /**
   * Fetches listings sorted by price 
   * @param {boolean} ascending - true for lowest to highest, false for highest to lowest
   * @returns {Promise<Array<Object>>} Sorted array of listing objects
   */
  async fetchAllListingsSortByPrice(ascending) {
    try {
      const { data: listings, error } = await supabase
        .from('listings')
        .select()
        .order('price', { ascending });

      if (error) {
        console.error('Error fetching listings by price:', error);
        throw error;
      }

      return listings;
    } catch (err) {
      console.error('Failed to fetch listings by price:', err);
      throw err;
    }
  } 

  /**
   * Gets a listing by ID
   * @param {number} listingId - The ID of the listing to retrieve
   * @returns {Promise<Object|null>} The listing object or null if not found
   */
  async getListingById(listingId) {
    // Try to find in local cache first
    const cachedListing = this.listings.find((listing) => listing.listing_id === listingId);
    if (cachedListing) {
      return cachedListing;
    }
    
    // If not in cache, fetch from database
    try {
      const { data, error } = await supabase
        .from('listings')
        .select()
        .eq('listing_id', listingId)
        .single();
        
      if (error) {
        console.error(`Error fetching listing ${listingId}:`, error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error(`Failed to fetch listing ${listingId}:`, err);
      return null;
    }
  }

  /**
   * Formats a listing object for presentation
   * 
   * formatted listing is an object with the following properties:
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
      date_posted: listing.date_posted,
    };
  }
}