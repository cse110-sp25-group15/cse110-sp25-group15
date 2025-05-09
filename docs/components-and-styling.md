# Component Guidelines
## Purpose
Below are the design patterns and information about how to build components

### What's a component in this context? 
A component is a self-contained bundle of HTML, CSS, Javascript that is modular, resuable and independent from the rest of the codebase.

### Shadow DOM
- Shadow DOM gives your component it's own sealed-off space in the browser. It's HTML, CSS, and Javascript stay hidden from the rest of the page.
- No CSS leaks in or out of the Shadow DOM so global styles won't interfere with your component.
### Locality
- We keep related code physically close - ideally within a single directory. 
- We also keep inner functioning inside the component. It should not interact with any elements outside it.

#### Creating Files/Folders
```
    parent-directory  (folder)
        |_ component-name  (component folder)
                |-> component-name.html
                |-> component-name.css
                |-> component-name.js
```


## Notes
- All styling should be in the components .css file.
- All logic should be handled within the .js file

## How to use `<slot>` in your component.html?
- The `<slot>` element in Web Components is a placeholder for user-provided content. It allows components to accept content from the outside:
```
    <!-- custom-button.html -->
    <div class="custom-button">
        <slot></slot>
    </div>
```
- Used like this:
```
    <custom-button> 
        Click Me!
    </custom-button>
```
- In this case the "Click Me!" string will be inserted into the `<slot></slot>`. So the shadow DOM will be rendered like below:
``` 
    <div class="custom-button">
        Click Me!
    </div>
```

## Template
- The bulk of the logic lies in the `component.js` file, so we will focus on that.
```
1    class Component extends HTMLElement {
2       constructor() {
3           super();
4           this.attachShadow({ mode: 'open' });
5       }
6
7       async connectedCallback() {
8           // Load HTML & CSS templates
9           const [html, css] = await Promise.all([
10          fetch('./component/component.html').then(r => r.text()),
11          fetch('./component/component.css').then(r => r.text())
12          ]);
13
14          const template = document.createElement('template');
15          template.innerHTML = `
16          <style>${css}</style>
17          ${html}
18          `;
19          this.shadowRoot.appendChild(template.content.cloneNode(true));
20      }
21   }
22
23   customElements.define('component', Component);
```

#### Line 1
- In line 1 we define the class `Component` which extends `HTMLElement`. This means we are creating a _**custom**_ HTML element. 
  
#### Lines 2-5
- We create a constructor and call `super()` which points to the class `HTMLElement`. This is so we can call methods defined in `HTMLElement` here in our `Component` class.
  
#### Lines 7-12
- We create an asynchronous function `connectedCallback()` that will be automatically called by the browser when this custom element is added to the main(light) DOM
- Starting at line 9 we create 2 const variables `html` and `css` and fetch the data from our .html and .css files we created.
  
#### Lines 14-18
- Then at line 14 we create a template where we add in our styling from the `css` variable and the html from the `html` variable. 
- A template is a special HTML element for defining reusable chunks for HTML that can be added to the DOM. Inside our template above we add in the css using the `<style>` tag.

#### Line 19
- We call the shadow DOM and from our component and insert (`appendChild`) our content from a template we created using our external .html and .css files. The `cloneNode(true)` means we create a deep copy of the entire template content - including all elements and styles - and insert it into the component's Shadow DOM. 

## Moving Further
Now that we understand the basic structure of components, we can move onto making them interactive. This interactivity is handled through the use of attributes. By adding or removing specific attributes, we can control both its styling and behavior. This lets components react to state just by checking for the presence of certain attributes — keeping the logic self-contained and easy to follow.
  
### Managing state through attributes
- We use a built in function `attributeChangedCallback()` that is automatically called whenever one of the attributes we specify from our custom element is changed. We can tell this function exactly which attributes to observe.
```
1   static get observedAttributes() {
2       return ['disabled', 'active'];
3   }
4   
5   attributeChangedCallback(name, oldValue, newValue) {
6   // called automatically when 'disabled' or 'active' changes
7
8   }
9
```
- The attributes *disabled* and *active* are just examples as these potentially can be used for a custom-button component.
- Inside the `attributeChangedCallback` function, we can run logic that enables/disables elements, toggles classes, or re-renders parts of the UI based on changes to specific attributes.
  - We can optionally include default attributes for the component inside the .js file. Based on interactions (*via event listeners*) we can dynamically change these attributes. 
- To apply styles based on the component’s state, we can:
  - Add a class name inside JavaScript that reflects the attribute's presence.
  - Write CSS inside the component’s .css file that targets that class and applies specific styling.
- We can dynamically update the component's attributes:
  - `this.setAttribute('name', 'value')  // Add an attribute`
  - `this.removeAttribute('name')   // Remove it`
  - `this.toggleAtribute('name')    // Toggle on/off`
  - When these methods above are used inside the component, the `attributeChangedCallback()` will automatically run, reacting to those changes.

### Bubbling up custom events
- Now that we understand how to handle attributes inside our component, how can the parent DOM (associated with index.html) know when the component's state changes?
- We can achieve this with **bubbling** and **custom events**. Since the shadow DOM hides internal details we need to dispatch an event to notify it. 
```
1   this.dispatchEvent(new CustomEvent('active', {
2       bubbles: true, 
3       composed: true, 
4   }));
5      
```
We can also set it equal to a variable:
```
1   const activeEvent = new CustomEvent('active', {
2       bubbles: true, 
3       composed: true, 
4   });
5   
6   this.dispatchEvent(activeEvent);
```
By doing this the parent DOM can listen for events by using `addEventListener`.
```
1   //inside our main index.html
2   document.querySelector('custom-button')
3       .addEventListener('active', () => {
4            console.log('Component is active!')';
5   }); 
```
