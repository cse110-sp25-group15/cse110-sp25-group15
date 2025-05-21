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

  it('closes when ESC key is pressed', async () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    console.log(document.body.innerHTML);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.body.contains(element)).toBe(false);
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

  it('displays correct chat title and message on convo click', () => {
    const convoData = element._conversations[0]; // safely reference the first convo from internal data

    const convo = element.shadowRoot.querySelectorAll('.convo')[0];
    convo.click();

    const title = element.shadowRoot.querySelector('.chat-title').textContent;
    const msg = element.shadowRoot.querySelector('.messages .message').textContent;

    expect(title).toBe(convoData.name);
    expect(msg).toBe(convoData.preview);
  });

  it('shows convo list when back button is clicked', async () => {
    const convo = element.shadowRoot.querySelector('.convo');
    convo.click(); // open chat
    const backButton = element.shadowRoot.querySelector('.back-button');
    backButton.click(); // simulate back
    const chatScreen = element.shadowRoot.querySelector('.chat-screen');
    const convoList = element.shadowRoot.querySelector('.convo-list');
    expect(chatScreen.classList.contains('hidden')).toBe(true);
    expect(convoList.style.display).toBe('block');
  });
});