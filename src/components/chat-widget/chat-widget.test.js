import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './chat-widget.js';

let element;

describe('<chat-widget>', () => {
  beforeEach(() => {
    element = document.createElement('chat-widget');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element = document.querySelector('chat-widget');
    if (element && document.body.contains(element)) {
      document.body.removeChild(element);
    }
  });

  it('renders shadow DOM with template', () => {
    expect(element.shadowRoot.querySelector('header')).toBeTruthy();
    expect(element.shadowRoot.querySelector('input[type="search"]')).toBeTruthy();
    expect(element.shadowRoot.querySelector('.convo-list')).toBeTruthy();
  });

  it('filters conversation list on input', () => {
    const input = element.shadowRoot.querySelector('input');
    input.value = 'alice';
    input.dispatchEvent(new Event('input'));
    const convos = element.shadowRoot.querySelectorAll('.convo');
    expect(convos.length).toBe(1);
    expect(convos[0].textContent.toLowerCase()).toContain('alice');
  });

  it('emits chat-open event with conversation ID on click', async () => {
    const convo = element.shadowRoot.querySelector('.convo');
    let detail = null;
    element.addEventListener('chat-open', (e) => { detail = e.detail; });
    convo.click();
    expect(detail).toBeTruthy();
    expect(typeof detail.id).toBe('number');
  });

});