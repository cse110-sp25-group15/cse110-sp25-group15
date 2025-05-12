import { describe, it, expect } from 'vitest';
import './checkbox-item.js';

describe('<checkbox-item>', () => {
  it('HTML and CSS exists in the shadow DOM', () => {
    const element = document.createElement('checkbox-item');
    document.body.appendChild(element);
    const shadowContent = element.shadowRoot.innerHTML;
    expect(shadowContent).toContain('<style>');  // CSS block exists
    expect(shadowContent).toMatch(/<.*?>/);      // Some HTML structure exists
    document.body.removeChild(element);
  });

  it('toggles "checked" attribute and CSS class when clicked', () => {
    const element = document.createElement('checkbox-item');
    document.body.appendChild(element);

    const checkbox = element.shadowRoot.querySelector('.checkbox');

    expect(checkbox).not.toBeNull();
    expect(checkbox.classList.contains('checked')).toBe(false);

    // Simulate a click to toggle checked attribute
    checkbox.click();

    // Attribute should be toggled
    expect(element.hasAttribute('checked')).toBe(true);
    expect(checkbox.classList.contains('checked')).toBe(true);

    // Simulate another click to toggle off
    checkbox.click();

    expect(element.hasAttribute('checked')).toBe(false);
    expect(checkbox.classList.contains('checked')).toBe(false);

    document.body.removeChild(element);
  });
});
