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