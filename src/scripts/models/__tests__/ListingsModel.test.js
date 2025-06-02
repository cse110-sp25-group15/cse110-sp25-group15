import { describe, it, expect } from 'vitest';
import ListingsModel from '../ListingsModel';

describe('ListingsModel', () => {
  it('should accept valid listing data', () => {
    const validListing = { title: 'Sample Listing', price: 100, description: 'A nice place' };
    const result = ListingsModel.validate(validListing);
    expect(result).toBe(true);
  });

  it('should reject invalid listing data - missing title', () => {
    const invalidListing = { price: 100, description: 'A nice place' };
    const result = ListingsModel.validate(invalidListing);
    expect(result).toBe(false);
  });

  it('should reject invalid listing data - empty title', () => {
    const invalidListing = { title: '', price: 100, description: 'A nice place' };
    const result = ListingsModel.validate(invalidListing);
    expect(result).toBe(false);
  });

  it('should reject invalid listing data - null price', () => {
    const invalidListing = { title: 'Sample Listing', price: null, description: 'A nice place' };
    const result = ListingsModel.validate(invalidListing);
    expect(result).toBe(false);
  });

  it('should reject invalid listing data - invalid type for price', () => {
    const invalidListing = { title: 'Sample Listing', price: 'one hundred', description: 'A nice place' };
    const result = ListingsModel.validate(invalidListing);
    expect(result).toBe(false);
  });

  it('should reject invalid listing data - missing fields', () => {
    const invalidListing = {};
    const result = ListingsModel.validate(invalidListing);
    expect(result).toBe(false);
  });
});