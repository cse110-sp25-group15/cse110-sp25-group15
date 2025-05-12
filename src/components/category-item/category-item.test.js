import { describe, it, expect } from 'vitest';
import './category-item.js';  // Ensure the component is defined

describe('<category-item>', () => {
  it('renders shadow DOM with slots and styling', () => {
    const element = document.createElement('category-item');

    // Provide slot content
    const icon = document.createElement('span');
    icon.slot = 'icon';
    icon.textContent = '🔔';

    const label = document.createElement('span');
    label.slot = 'label';
    label.textContent = 'Notifications';

    element.append(icon, label);
    document.body.appendChild(element);

    const shadowRoot = element.shadowRoot;

    expect(shadowRoot.innerHTML).toContain('<style>');
    expect(shadowRoot.querySelector('.icon')).not.toBeNull();
    expect(shadowRoot.querySelector('.label')).not.toBeNull();

    document.body.removeChild(element);
  });
});
