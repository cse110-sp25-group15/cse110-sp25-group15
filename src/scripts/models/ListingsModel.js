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
      const { data: listings, error, status } = await supabase
        .from('listings')
        .select();

      if (error) {
        if (status === 401 || status === 403) {
          throw new Error('AuthError: Unauthorized or forbidden');
        } else if (status >= 500) {
          throw new Error('ServerError: Internal server error');
        } else {
          throw new Error(`APIError: ${error.message}`);
        }
      }

      this.listings = listings;
      return this.listings;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error('NetworkError: Check your internet connection.');
      }
      console.error('Failed to fetch listings: ', err);
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
      const { data: listings, error, status } = await supabase
        .from('listings')
        .select()
        .eq('category', category);

      if (error) {
        if (status === 401 || status === 403) {
          throw new Error('AuthError: Unauthorized or forbidden');
        } else if (status >= 500) {
          throw new Error('ServerError: Internal server error');
        } else {
          throw new Error(`APIError: ${error.message}`);
        }
      }

      return listings;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error('NetworkError: Check your internet connection.');
      }
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
      const { data: listings, error, status } = await supabase
        .from('listings')
        .select()
        .order('date_posted', { ascending });

      if (error) {
        if (status === 401 || status === 403) {
          throw new Error('AuthError: Unauthorized or forbidden');
        } else if (status >= 500) {
          throw new Error('ServerError: Internal server error');
        } else {
          throw new Error(`APIError: ${error.message}`);
        }
      }

      return listings;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error('NetworkError: Check your internet connection.');
      }
      console.error('Failed to fetch listings by data: ', err);
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
      const { data: listings, error, status } = await supabase
        .from('listings')
        .select()
        .order('price', { ascending });

      if (error) {
        if (status === 401 || status === 403) {
          throw new Error('AuthError: Unauthorized or forbidden');
        } else if (status >= 500) {
          throw new Error('ServerError: Internal server error');
        } else {
          throw new Error(`APIError: ${error.message}`);
        }
      }

      return listings;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error('NetworkError: Check your internet connection.');
      }
      console.error('Failed to fetch listings by price: ', err);
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
      const { data, error, status } = await supabase
        .from('listings')
        .select()
        .eq('listing_id', listingId)
        .single();

      if (error) {
        if (status === 401 || status === 403) {
          throw new Error('AuthError: Unauthorized or forbidden');
        } else if (status >= 500) {
          throw new Error('ServerError: Internal server error');
        } else {
          throw new Error(`APIError: ${error.message}`);
        }
      }

      return data;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error('NetworkError: Check your internet connection.');
      }
      console.error(`Failed to fetch listing ${listingId}:`, err);
      throw err;
    }
  }

  /**
 * Fetches listings created by a specific user
 * @param {string} userId - UUID of the user
 * @returns {Promise<Array>} Array of user's listing objects
 */
  async fetchListingsByUser(userId) {
    try {
      const { data: listings, error, status } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        if (status === 401 || status === 403) {
          throw new Error('AuthError: Unauthorized or forbidden');
        } else if (status >= 500) {
          throw new Error('ServerError: Internal server error');
        } else {
          throw new Error(`APIError: ${error.message}`);
        }
      }

      return listings;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error('NetworkError: Check your internet connection.');
      }
      console.error('Failed to fetch user listings: ', err);
      throw err;
    }
  }

  /**
 * Deletes a listing by its ID
 * @param {string} listingId - UUID of the listing to delete
 * @returns {Promise<void>}
 */
  async deleteListingById(listingId) {
    try {
      const { error: imageError } = await supabase
        .from('images')
        .delete()
        .eq('listing_id', listingId);

      if (imageError) {
        console.warn('Warning: failed to delete images for listing:', imageError);
      }

      const { error, status } = await supabase
        .from('listings')
        .delete()
        .eq('listing_id', listingId);

      if (error) {
        if (status === 401 || status === 403) {
          throw new Error('AuthError: Unauthorized or forbidden');
        } else if (status >= 500) {
          throw new Error('ServerError: Internal server error');
        } else {
          throw new Error(`APIError: ${error.message}`);
        }
      }

      console.log(`Listing ${listingId} deleted successfully.`);
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error('NetworkError: Check your internet connection.');
      }
      console.error('Failed to delete listing:', err);
      throw err;
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

  /**
   * Searches listings by a query string in title or description (case-insensitive)
   * @param {string} query - The search string
   * @returns {Promise<Array>} Array of matching listing objects
   */
  async searchListings(query) {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string');
    }
    try {
      // Use ilike for case-insensitive partial match on title or description
      const { data: listings, error, status } = await supabase
        .from('listings')
        .select()
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

      if (error) {
        if (status == 401 || status === 403) {
          throw new Error('AuthError: Unauthorized or forbidden');
        } else if (status >= 500) {
          throw new Error('ServerError: Internal server error');
        } else {
          throw new Error(`APIError: ${error.message}`);
        }
      }

      return listings;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error('NetworkError: Check your internet connection.');
      }
      console.error('Failed to search listings: ', err);
      throw err;
    }
  }
}