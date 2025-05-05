class CheckboxGroup extends HTMLElement {
    constructor() {
      super();
      const template = document.createElement('template');
      template.innerHTML = `
        <div class="checkbox-group">
          <!-- Checkboxes will be dynamically rendered here -->
        </div>
      `;
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.appendChild(template.content.cloneNode(true));
  
      // Dynamically add the external CSS file
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './checkbox-selector/checkbox-group.css'; 
      shadow.appendChild(link);
    }
  
    connectedCallback() {
      const options = JSON.parse(this.getAttribute('options') || '[]');
      const checkboxGroup = this.shadowRoot.querySelector('.checkbox-group');
  
      // Dynamically create checkboxes based on the options attribute
      options.forEach(option => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        const span = document.createElement('span');
  
        checkbox.type = 'checkbox';
        checkbox.value = option;
        span.textContent = option;
  
        label.appendChild(checkbox);
        label.appendChild(span);
        checkboxGroup.appendChild(label);
      });
  
      // Listen for changes and dispatch a custom event
      this.shadowRoot.addEventListener('change', () => {
        const selectedValues = Array.from(
          this.shadowRoot.querySelectorAll('input[type="checkbox"]:checked')
        ).map(checkbox => checkbox.value);
  
        this.dispatchEvent(new CustomEvent('change', { detail: { selectedValues } }));
      });
    }
  }
  
  customElements.define('checkbox-group', CheckboxGroup);