import supabase from '../utils/supabase.js';
import { ListingModel } from '../models/ListingsModel.js';
import { CategoryEnum } from '../constants/CategoryEnum.js';
import { ConditionEnum } from '../constants/ConditionEnum.js';

export class ListingSubmissionController {
  constructor() {
    this.model = new ListingModel();
  }

  init() {
    document.addEventListener('listing-submit', this.handleListingSubmit.bind(this));
  }

  /**
   * Generate a UUID v4
   * @returns {string} UUID
   */
  _generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async _uploadFile(file, userId, listingId) {
    const filePath = `${userId}/${listingId}/${file.name}`;
    const { data, error } = await supabase
      .storage
      .from('listimages')
      .upload(filePath, file, { upsert: false });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('listimages')
      .getPublicUrl(filePath);
    console.log('Public URL:', publicUrlData.publicUrl);
    if (publicUrlData.error) {
      console.error('Error getting public URL:', publicUrlData.error);
      throw publicUrlData.error;
    }
    return publicUrlData.publicUrl;
  }

  async handleListingSubmit(event) {
    console.log('Listing submit event received');
    const listingData = event.detail;
    console.log('Listing data:', listingData);

    if (!Object.values(CategoryEnum).includes(listingData.category)) {
      this.notifyError('Invalid category selected.');
      return;
    }

    if (!Object.values(ConditionEnum).includes(listingData.condition)) {
      this.notifyError('Invalid condition selected.');
      return;
    }

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user) {
        this.notifyError('You must be signed in to create a listing');
        return;
      }

      // Generate unique listing ID
      const listingId = this._generateUUID();

      // Handle file upload if files exist
      let thumbnailUrl = null;
      if (listingData.files && listingData.files.length > 0) {
        try {
          thumbnailUrl = await this._uploadFile(listingData.files[0], user.id, listingId);
          //remove the file field from the listing data
          delete listingData.files;
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          this.notifyError('File upload failed.');
          return;
        }
      }

      const fullListingData = {
        ...listingData,
        listing_id: listingId,
        user_id: user.id,
        thumbnail: thumbnailUrl,  // Add the uploaded image URL
      };

      const { data, error } = await supabase
        .from('listings')
        .insert([fullListingData])
        .select();

      if (error) {
        this.notifyError(error.message || 'Failed to create listing');
        return;
      }

      this.notifySuccess('Listing created successfully');

      if (event.target && typeof event.target.resetForm === 'function') {
        event.target.resetForm();
      }

    } catch (error) {
      console.error('Error handling listing submission:', error);
      this.notifyError('An unexpected error occurred');
    }
  }
  
  notifyError(message) {
    alert(message);
  }

  notifySuccess(message) {
    alert(message);
  }

}