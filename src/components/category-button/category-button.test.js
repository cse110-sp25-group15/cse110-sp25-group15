import { describe, it, expect } from 'vitest';
import './category-button.js';  // Ensure the component is defined

describe('<category-button>', () => {
  it('renders shadow DOM with slots and styling', () => {
    const element = document.createElement('category-button');

    // Provide slot content
    const label = document.createElement('span');
    label.slot = 'label';
    label.textContent = 'category';

    element.append(label);
    document.body.appendChild(element);

    const shadowRoot = element.shadowRoot;

    expect(shadowRoot.innerHTML).toContain('<style>');
    expect(shadowRoot.querySelector('.label')).not.toBeNull();

    document.body.removeChild(element);
  });
});
