import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './product-card.js'; // Make sure the path matches your actual file structure

describe('<product-card>', () => {
  let element;

  // Setup and teardown
  beforeEach(() => {
    element = document.createElement('product-card');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should have a shadow DOM with HTML and CSS', () => {
    const shadowContent = element.shadowRoot.innerHTML;
    expect(shadowContent).toContain('<style>'); // CSS block exists
    expect(shadowContent).toMatch(/<div class="card-container">/); // Main container exists
    expect(shadowContent).toMatch(/<div class="image-container">/); // Image container exists
    expect(shadowContent).toMatch(/<div class="card-content">/); // Content container exists
  });

  it('should set title attribute correctly', () => {
    const testTitle = 'Test Product';
    element.setAttribute('title', testTitle);
    
    const titleElement = element.shadowRoot.querySelector('.card-title');
    expect(titleElement.textContent).toBe(testTitle);
  });

  it('should format price correctly', () => {
    const testPrice = '29.99';
    element.setAttribute('price', testPrice);
    
    const priceElement = element.shadowRoot.querySelector('.card-price');
    expect(priceElement.textContent).toBe(`$${testPrice}`);
  });

  it('should update all properties when setting listing object', () => {
    const testListing = {
      listing_id: 'test-123',
      title: 'Test Product',
      price: '99.99',
      image_url: 'https://example.com/test.jpg',
    };
    
    element.listing = testListing;
    
    expect(element.getAttribute('listing-id')).toBe(testListing.listing_id);
    expect(element.getAttribute('title')).toBe(testListing.title);
    expect(element.getAttribute('price')).toBe(testListing.price);
    expect(element.getAttribute('image-url')).toBe(testListing.image_url);
    
    const titleElement = element.shadowRoot.querySelector('.card-title');
    const priceElement = element.shadowRoot.querySelector('.card-price');
    const imageElement = element.shadowRoot.querySelector('.card-image');
    
    expect(titleElement.textContent).toBe(testListing.title);
    expect(priceElement.textContent).toBe(`$${testListing.price}`);
    expect(imageElement.src).toBe(testListing.image_url);
  });

  it('should handle listing with images array instead of direct image_url', () => {
    const testListing = {
      listing_id: 'test-456',
      title: 'Test Product with Images Array',
      price: '49.99',
      images: [
        { image_url: 'https://example.com/image1.jpg' },
        { image_url: 'https://example.com/image2.jpg' },
      ],
    };
    
    element.listing = testListing;
    
    expect(element.getAttribute('listing-id')).toBe(testListing.listing_id);
    expect(element.getAttribute('title')).toBe(testListing.title);
    expect(element.getAttribute('price')).toBe(testListing.price);
    expect(element.getAttribute('image-url')).toBeFalsy(); // No direct image-url attribute
    
    const imageElement = element.shadowRoot.querySelector('.card-image');
    expect(imageElement.src).toBe(testListing.images[0].image_url);
    expect(element._images).toEqual(testListing.images);
  });

  it('should get listing data correctly', () => {
    const testListing = {
      listing_id: 'test-789',
      title: 'Test Get Listing',
      price: '19.99',
      image_url: 'https://example.com/test.jpg',
    };
    
    element.listing = testListing;
    const retrievedListing = element.listing;
    
    expect(retrievedListing.listing_id).toBe(testListing.listing_id);
    expect(retrievedListing.title).toBe(testListing.title);
    expect(retrievedListing.price).toBe(testListing.price);
    expect(retrievedListing.image_url).toBe(testListing.image_url);
  });

  it('should handle empty data gracefully', () => {
    // Set empty listing data
    element.listing = {};
    
    // Should not throw errors
    expect(element.getAttribute('listing-id')).toBe('');
    expect(element.getAttribute('title')).toBe('');
    expect(element.getAttribute('price')).toBe('');
    
    // Get should still return an object with expected structure
    const retrievedListing = element.listing;
    expect(typeof retrievedListing).toBe('object');
    expect(retrievedListing).toHaveProperty('listing_id');
    expect(retrievedListing).toHaveProperty('title');
    expect(retrievedListing).toHaveProperty('price');
    expect(retrievedListing).toHaveProperty('image_url');
    expect(retrievedListing).toHaveProperty('images');
  });
});