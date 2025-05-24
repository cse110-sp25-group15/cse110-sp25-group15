import { describe, it, expect } from 'vitest';
import './empty-state.js';  // Ensure the component is defined

describe('<empty-state>', () => {
  it('renders shadow DOM with slots and styling', () => {
    const element = document.createElement('empty-state');
    document.body.appendChild(element); 

    const shadowRoot = element.shadowRoot;

    expect(shadowRoot.innerHTML).toContain('<button>');
    expect(shadowRoot.querySelector('.empty-state-text')).not.toBeNull();

    document.body.removeChild(element);
  });
});
