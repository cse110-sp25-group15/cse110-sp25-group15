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

  it('should set image URL correctly', () => {
    const testImageUrl = 'https://example.com/test.jpg';
    element.setAttribute('image-url', testImageUrl);
    
    const imageElement = element.shadowRoot.querySelector('.card-image');
    expect(imageElement.src).toBe(testImageUrl);
  });

  it('should handle multiple attribute changes', () => {
    // Set attributes one by one
    element.setAttribute('listing-id', 'test-123');
    element.setAttribute('title', 'Test Product');
    element.setAttribute('price', '99.99');
    element.setAttribute('image-url', 'https://example.com/test.jpg');
    
    // Check DOM elements for correct values
    const titleElement = element.shadowRoot.querySelector('.card-title');
    const priceElement = element.shadowRoot.querySelector('.card-price');
    const imageElement = element.shadowRoot.querySelector('.card-image');
    
    expect(titleElement.textContent).toBe('Test Product');
    expect(priceElement.textContent).toBe('$99.99');
    expect(imageElement.src).toBe('https://example.com/test.jpg');
  });

  it('should default to placeholder image when no image-url is provided', () => {
    // Set attributes without image-url
    element.setAttribute('listing-id', 'test-123');
    element.setAttribute('title', 'Test Product');
    element.setAttribute('price', '99.99');
    
    const imageElement = element.shadowRoot.querySelector('.card-image');
    expect(imageElement.src).toContain('placeholder');
  });

  it('should emit card-click event when clicked', () => {
    // Set up event listener
    let eventFired = false;
    let receivedDetail = null;
    
    element.setAttribute('listing-id', 'test-123');
    
    element.addEventListener('card-click', (event) => {
      eventFired = true;
      receivedDetail = event.detail;
    });
    
    // Trigger click
    const cardContainer = element.shadowRoot.querySelector('.card-container');
    cardContainer.click();
    
    // Verify event
    expect(eventFired).toBe(true);
    expect(receivedDetail).toHaveProperty('listingId', 'test-123');
  });

  it('should handle attribute update from null to value', () => {
    // Initially null/unset
    expect(element.shadowRoot.querySelector('.card-title').textContent).toBe('');
    
    // Set attribute
    element.setAttribute('title', 'New Title');
    
    // Check updated value
    expect(element.shadowRoot.querySelector('.card-title').textContent).toBe('New Title');
  });

  it('should handle attribute update from value to different value', () => {
    // Initial value
    element.setAttribute('price', '10.00');
    expect(element.shadowRoot.querySelector('.card-price').textContent).toBe('$10.00');
    
    // Update value
    element.setAttribute('price', '20.00');
    
    // Check updated value
    expect(element.shadowRoot.querySelector('.card-price').textContent).toBe('$20.00');
  });

  it('should handle attribute removal', () => {
    // Set initial value
    element.setAttribute('price', '10.00');
    expect(element.shadowRoot.querySelector('.card-price').textContent).toBe('$10.00');
    
    // Remove attribute
    element.removeAttribute('price');
    
    // Check updated value
    expect(element.shadowRoot.querySelector('.card-price').textContent).toBe('');
  });

  it('should use title as image alt text when available', () => {
    element.setAttribute('title', 'Test Product');
    element.setAttribute('image-url', 'https://example.com/test.jpg');
    
    const imageElement = element.shadowRoot.querySelector('.card-image');
    expect(imageElement.alt).toBe('Test Product');
  });

  it('should use default alt text when no title is available', () => {
    element.setAttribute('image-url', 'https://example.com/test.jpg');
    
    const imageElement = element.shadowRoot.querySelector('.card-image');
    expect(imageElement.alt).toBe('Product image');
  });
});