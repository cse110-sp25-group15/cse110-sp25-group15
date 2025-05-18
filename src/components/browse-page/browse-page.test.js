import { describe, it, expect } from 'vitest';
import './browse-page.js';  // Ensure the component is defined

describe('<browse-page>', () => {
  it('renders shadow DOM with slots and styling', () => {
    const element = document.createElement('browse-page');
    document.body.appendChild(element); 

    const shadowRoot = element.shadowRoot;

    expect(shadowRoot.innerHTML).toContain('<category-button>'); //test not needed really
    expect(shadowRoot.querySelector('.products-container')).not.toBeNull();

    document.body.removeChild(element);
  });
});
