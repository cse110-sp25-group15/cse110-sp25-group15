import supabase from '../utils/supabase.js';
import { ListingModel } from '../models/ListingsModel.js';
import { CategoryEnum } from '../constants/CategoryEnum.js';
import { ConditionEnum } from '../constants/ConditionEnum.js';

import heic2any from 'https://cdn.skypack.dev/heic2any';
import imageCompression from 'https://cdn.skypack.dev/browser-image-compression';

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
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async convertImageToWebP(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf', 'image/webp'];
    if(!allowedTypes.includes(file.type)){
      this.notifyError('Only PNG, JPEG, HEIC, PDF, and WebP formats are allowed');
      throw new Error('File type is not allowed');
    }
    const fileType = file.type;
    let convertedBlob;

    try {
      if (fileType === 'image/heic' || file.name.endsWith('.HEIC')) {
        // convert HEIC to WebP
        convertedBlob = await heic2any({
          blob: file,
          toType: 'image/webp',
          quality: 0.8,
        });

        // Wrap the blob in a File (so we can compress it)
        const tempWebPFile = new File([convertedBlob], file.name.replace(/\.\w+$/, '.webp'), {
          type: 'image/webp',
        });

        // Compress the WebP file
        convertedBlob = await imageCompression(tempWebPFile, {
          maxSizeMB: 0.1, // max size 100 KB
          maxWidthOrHeight: 800,
          fileType: 'image/webp',
          useWebWorker: true, // enables background processing
        });
      } else {
        // compress and convert other types (JPEG, PNG) to WebP
        convertedBlob = await imageCompression(file, {
          maxSizeMB: 0.1, // try to compress image to under  100 KB
          maxWidthOrHeight: 800, // resize image if it's larger in width/height
          fileType: 'image/webp', // convert to WebP
          useWebWorker: true, // enables background processing
        });
      }

      // convertedBlob is a WebP image 
      return convertedBlob;

    } catch (err) {
      console.error('Conversion failed:', err);
      throw err;
    }
  }

  async _uploadFile(file, userId, listingId, fileIndex = 0) {
    const fileName = `image_${fileIndex}_${Date.now()}.webp`;
    const filePath = `${userId}/${listingId}/${fileName}`;
    
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
      const allImageUrls = [];

      if (listingData.files && listingData.files.length > 0) {
        try {
          // Process all files
          for (let i = 0; i < listingData.files.length; i++) {
            const file = listingData.files[i];
            
            // Convert and compress each file
            const convertedFile = await this.convertImageToWebP(file);
            const newFileName = file.name.replace(/\.\w+$/, '.webp');
            const webpFile = new File([convertedFile], newFileName, { type: 'image/webp' });

            // Upload file
            const imageUrl = await this._uploadFile(webpFile, user.id, listingId, i);
            allImageUrls.push(imageUrl);
            
            // Use first image as thumbnail
            if (i === 0) {
              thumbnailUrl = imageUrl;
            }
          }
          
          // Remove the files field from listing data
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
        images: allImageUrls,
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
      setTimeout(() => {
        window.location.replace('https://cse110-sp25-group15.github.io/cse110-sp25-group15/');
      }, 1500);

    } catch (error) {
      console.error('Error handling listing submission:', error);
      this.notifyError('An unexpected error occurred');
    }
  }

  notifyError(message) {
    window.notify(message, 'error', 4000);
  }

  notifySuccess(message) {
    window.notify(message, 'success', 3000);
    window.celebrate(); 
  }

}