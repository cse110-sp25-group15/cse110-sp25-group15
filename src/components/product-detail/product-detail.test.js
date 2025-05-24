import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './product-detail.js';

describe('<product-detail>', () => {
  let el;

  const sampleAttrs = {
    name: 'Macbook Air',
    price: '999',
    condition: 'Like new',
    date: '2025-05-01',
    description: 'A sleek laptop for school or work.',
    images: 'https://example.com/image1.jpg,https://example.com/image2.jpg',
  };

  beforeEach(() => {
    el = document.createElement('product-detail');
    Object.entries(sampleAttrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('renders product name and price from attributes', () => {
    const name = el.shadowRoot.querySelector('.product-name');
    const price = el.shadowRoot.querySelector('.price');
    expect(name.textContent).toBe('Macbook Air');
    expect(price.textContent).toBe('$999');
  });

  it('renders first image as main image by default', () => {
    const mainImage = el.shadowRoot.querySelector('.main-image');
    expect(mainImage.src).toContain('image1.jpg');
  });

  it('renders all thumbnails in the thumb strip', () => {
    const thumbnails = el.shadowRoot.querySelectorAll('.thumb-strip img');
    expect(thumbnails.length).toBe(2);
    expect(thumbnails[0].src).toContain('image1.jpg');
    expect(thumbnails[1].src).toContain('image2.jpg');
  });

  it('sets condition, date, and description correctly', () => {
    const cond = el.shadowRoot.querySelector('.condition');
    const date = el.shadowRoot.querySelector('.date');
    const desc = el.shadowRoot.querySelector('.description-block');
    expect(cond.textContent).toBe('Like new');
    expect(date.textContent).toBe('2025-05-01');
    expect(desc.textContent).toBe('A sleek laptop for school or work.');
  });

  it('emits "contact-seller" event when contact button is clicked', () => {
    const listener = vi.fn();
    el.addEventListener('contact-seller', listener);
    const contactBtn = el.shadowRoot.querySelector('.send-btn');
    contactBtn?.click();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('updates main image when thumbnail is clicked', () => {
    const thumbnails = el.shadowRoot.querySelectorAll('.thumb-strip img');
    thumbnails[1]?.click();
    const mainImage = el.shadowRoot.querySelector('.main-image');
    expect(mainImage.src).toContain('image2.jpg');
  });
});
