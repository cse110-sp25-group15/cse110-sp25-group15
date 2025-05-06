<<<<<<< HEAD
class CheckItem extends HTMLElement {
  static get observedAttributes() {
    return ['checked'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const [html, css] = await Promise.all([
      fetch('./checkbox-selector/checkbox-group.html').then(r => r.text()),
      fetch('./checkbox-selector/checkbox-group.css').then(r => r.text()),
    ]);

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Store reference to checkbox for later toggling
    this.checkbox = this.shadowRoot.querySelector('.checkbox');

    // Click toggles checked state
    this.checkbox.addEventListener('click', () => {
      this.toggleAttribute('checked');
    });

    this.updateCheckedStyle();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'checked') {
      this.updateCheckedStyle();
    }
  }

  updateCheckedStyle() {
    if (!this.checkbox) return;
    this.checkbox.classList.toggle('checked', this.hasAttribute('checked'));
  }
}

customElements.define('check-item', CheckItem);
=======
class CheckboxItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    static get observedAttributes() {
      return ["checked"];
    }
  
    async connectedCallback() {
      // Load HTML & CSS templates
      const [html, css] = await Promise.all([
        fetch('./checkbox-selector/checkbox-group.html').then(r => r.text()),
        fetch('./checkbox-selector/checkbox-group.css').then(r => r.text())
      ]);

  
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          ${css}
        </style>
        ${html}
      `;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
  
      // add event listener to button
      this.checkbox = this.shadowRoot.querySelector(".checkmark"); 
      this.checkbox.addEventListener('click', (event) => {
      this.updateCheckedState();   
      });
    }

    updateCheckedState(){
        this.checkbox = this.shadowRoot.querySelector(".checkmark");

        if(this.checkbox.classList.contains("checked")) {
            this.checkbox.classList.remove("checked");
            console.log("unchecked");
        }else {
            this.checkbox.classList.add("checked");
            console.log("checked");
        }
        
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'checked') {
        this.updateCheckedState();
      }
      console.log(name);
    
    }

}
  
  customElements.define('checkbox-item', CheckboxItem);
>>>>>>> 3fc9e7e5cb4c70dfd8229ccee6cc92a8d48b26fd
