import { describe, it, expect, beforeEach, vi } from 'vitest';
import SiteHeader from './site-header';

describe('<site-header>', () => {
  let header;

  beforeEach(() => {
    document.body.innerHTML = ''; // Clean DOM
    header = new SiteHeader();
    document.body.appendChild(header);
  });

  it('should mount successfully and contain shadow DOM', () => {
    expect(header).toBeTruthy();
    expect(header.shadowRoot).toBeTruthy();
  });

  it('should display the logo and marketplace name', () => {
    const logo = header.shadowRoot.querySelector('.logo');
    expect(logo).toBeTruthy();
    expect(logo.querySelector('img')).toBeTruthy();
    expect(logo.querySelector('span').textContent).toBe('MARKETPLACE');
  });

  it('should display navigation links', () => {
    const navLinks = header.shadowRoot.querySelectorAll('.main-nav a');
    expect(navLinks.length).toBeGreaterThanOrEqual(2);
    expect(navLinks[0].getAttribute('href')).toBe('/browse');
    expect(navLinks[0].textContent).toBe('BROWSE');
    expect(navLinks[1].getAttribute('href')).toBe('/list');
    expect(navLinks[1].textContent).toBe('LIST AN ITEM');
  });

  it('should show the login button by default', () => {
    const loginBtn = header.shadowRoot.querySelector('#loginButton');
    expect(loginBtn).toBeTruthy();
    expect(loginBtn.textContent.trim()).toContain('Login');
  });

  it('should toggle the search bar when search icon is clicked', () => {
    const searchContainer = header.shadowRoot.querySelector('.search-container');
    const searchIcon = header.shadowRoot.querySelector('.search-icon');
    expect(searchContainer.classList.contains('active')).toBe(false);
    searchIcon.click();
    expect(searchContainer.classList.contains('active')).toBe(true);
  });

  it('should dispatch "search-submit" event on search form submit', () => {
    const listener = vi.fn();
    header.addEventListener('search-submit', listener);

    const searchIcon = header.shadowRoot.querySelector('.search-icon');
    const searchInput = header.shadowRoot.querySelector('.search-input');
    const searchForm = header.shadowRoot.querySelector('.search-form');

    // Open search bar
    searchIcon.click();
    searchInput.value = 'test query';

    // Submit form
    searchForm.dispatchEvent(new Event('submit', { bubbles: true }));

    expect(listener).toHaveBeenCalled();
    expect(listener.mock.calls[0][0].detail.query).toBe('test query');
  });

  it('should respond to username attribute change', () => {
    header.setAttribute('username', 'Alice Bob');
    const userName = header.shadowRoot.querySelector('.user-name');
    expect(userName.textContent).toBe('Alice Bob');
  });
});
