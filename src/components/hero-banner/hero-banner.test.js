import { describe, it, expect, beforeEach } from 'vitest';
import HeroBanner from './hero-banner';

describe('HeroBanner', () => {
  let heroBanner;

  beforeEach(() => {
    heroBanner = new HeroBanner();
    document.body.appendChild(heroBanner);
  });

  it('should mount successfully', () => {
    expect(heroBanner).toBeTruthy();
    expect(heroBanner.shadowRoot).toBeTruthy();
  });

  it('should display the main headline', () => {
    const headline = heroBanner.shadowRoot.querySelector('h1');
    expect(headline).toBeTruthy();
    expect(headline.textContent.trim()).toBe('DISCOVERBUY OR SELL.');
  });

  it('should display the tagline', () => {
    const tagline = heroBanner.shadowRoot.querySelector('.tagline');
    expect(tagline).toBeTruthy();
    expect(tagline.textContent).toBe('A TRUSTED DIGITAL MARKETPLACE FOR STUDENTS AND STAFF');
  });

  it('should have a CTA button that dispatches hero-start event', () => {
    const ctaButton = heroBanner.shadowRoot.querySelector('.btn');
    expect(ctaButton).toBeTruthy();
    expect(ctaButton.textContent).toBe('START BROWSING');

    let eventDispatched = false;
    heroBanner.addEventListener('hero-start', () => {
      eventDispatched = true;
    });

    ctaButton.click();
    expect(eventDispatched).toBe(true);
  });

  it('should have the hero image', () => {
    const heroImage = heroBanner.shadowRoot.querySelector('.hero-image img');
    expect(heroImage).toBeTruthy();
    expect(heroImage.alt).toBe('Geisel Library at sunset');
    expect(heroImage.src).toContain('/assets/geisel.png');
  });
});
