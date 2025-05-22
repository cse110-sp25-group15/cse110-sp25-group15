import html from './page-switcher.html?raw';
import css from './page-switcher.css?raw';

/**
 * Page Switcher Component - Visual interactions only
 * Functional arrow navigation without backend
 */
class PageSwitcher extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.currentPage = 2; // Start on page 2 as shown
    this.totalPages = 12;
  }

  connectedCallback() {
    this.setupEventListeners();
    this.updateButtonStates();
  }

  setupEventListeners() {
    // Previous button
    const prevBtn = this.shadowRoot.getElementById('prev-btn');
    prevBtn?.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updateActiveButton();
        this.updateButtonStates();
      }
    });

    // Next button
    const nextBtn = this.shadowRoot.getElementById('next-btn');
    nextBtn?.addEventListener('click', () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updateActiveButton();
        this.updateButtonStates();
      }
    });

    // Page number buttons
    const pageButtons = this.shadowRoot.querySelectorAll('.page-btn[data-page]');
    pageButtons.forEach(button => {
      button.addEventListener('click', () => {
        const page = parseInt(button.getAttribute('data-page'));
        this.currentPage = page;
        this.updateActiveButton();
        this.updateButtonStates();
      });
    });
  }

  updateActiveButton() {
    // Remove active class from all page buttons
    const pageButtons = this.shadowRoot.querySelectorAll('.page-btn[data-page]');
    pageButtons.forEach(button => {
      button.classList.remove('active');
    });

    // Add active class to current page button (if visible)
    const currentButton = this.shadowRoot.querySelector(`[data-page="${this.currentPage}"]`);
    if (currentButton) {
      currentButton.classList.add('active');
    }

    console.log(`Switched to page ${this.currentPage} (visual only)`);
  }

  updateButtonStates() {
    const prevBtn = this.shadowRoot.getElementById('prev-btn');
    const nextBtn = this.shadowRoot.getElementById('next-btn');
    
    // Disable/enable prev button
    if (prevBtn) {
      prevBtn.disabled = this.currentPage <= 1;
    }
    
    // Disable/enable next button
    if (nextBtn) {
      nextBtn.disabled = this.currentPage >= this.totalPages;
    }
  }
}

customElements.define('page-switcher', PageSwitcher);
export default PageSwitcher;