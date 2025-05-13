
---

# Component Guidelines

## Purpose

Below are the design patterns and information about how to build components.

### What's a component in this context?

A component is a self-contained bundle of **HTML**, **CSS**, and **JavaScript** that is modular, reusable, and independent from the rest of the codebase.

### Shadow DOM

* Shadow DOM gives your component its own sealed-off space in the browser. Its HTML, CSS, and JavaScript stay hidden from the rest of the page.
* No CSS leaks in or out of the Shadow DOM, so global styles won't interfere with your component.

### Locality

* We keep related code physically close—ideally within a single directory.
* We also keep inner functioning inside the component. It should not interact with any elements outside it.

#### Creating Files/Folders

```bash
parent-directory/       # folder
└── component-name/     # component folder
    ├── component-name.html
    ├── component-name.css
    └── component-name.js
````

## Notes

* All styling should be in the component’s `.css` file.
* All logic should be handled within the `.js` file.

## How to use `<slot>` in your component.html?

The `<slot>` element in Web Components is a placeholder for user-provided content. It allows components to accept content from the outside:

```html
<!-- custom-button.html -->
<div class="custom-button">
    <slot></slot>
</div>
```

Used like this:

```html
<custom-button> 
    Click Me!
</custom-button>
```

In this case, the "Click Me!" string will be inserted into the `<slot></slot>`. The shadow DOM will render as:

```html
<div class="custom-button">
    Click Me!
</div>
```

## Template Example

The bulk of the logic lies in the `component.js` file, so we will focus on that.

Since we are using Vite, we now import assets directly rather than fetching them at runtime. Example:

```js
import html from './component.html?raw';
import css from './component.css?raw';

class Component extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const template = document.createElement('template');
        template.innerHTML = `
            <style>${css}</style>
            ${html}
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('component', Component);
```

### Line Explanations

#### Line 1

* Defines the class `Component` which extends `HTMLElement`, creating a **custom** HTML element.

#### Lines 2-5

* Creates a constructor and calls `super()`, enabling usage of `HTMLElement` methods inside `Component`.

#### Lines 7-12

* Defines `connectedCallback()`, which is called when the element is added to the DOM. It uses static imports to load the template and styles.

#### Lines 14-18

* Creates a template, injects styles and HTML into it, and prepares it for rendering.

#### Line 19

* Appends a **deep copy** of the template content to the shadow DOM, making the component self-contained.

---

## Moving Further

After setting up structure, we can make components **interactive** using **attributes**.

### Managing state through attributes

You can observe and react to attribute changes using `attributeChangedCallback()`:

```js
static get observedAttributes() {
    return ['disabled', 'active'];
}

attributeChangedCallback(name, oldValue, newValue) {
    // Runs when 'disabled' or 'active' changes
}
```

#### Example Usage in JavaScript:

```js
this.setAttribute('name', 'value');   // Add or update an attribute
this.removeAttribute('name');        // Remove the attribute
this.toggleAttribute('name');        // Toggle attribute on or off
```

#### Example Conditional Styling:

In your `.css` file:

```css
:host([active]) {
    background-color: green;
}
```

### Bubbling up custom events

Dispatch custom events to communicate state changes to the outside DOM:

```js
this.dispatchEvent(new CustomEvent('active', {
    bubbles: true,
    composed: true,
}));
```

Or assign to a variable:

```js
const activeEvent = new CustomEvent('active', {
    bubbles: true,
    composed: true,
});

this.dispatchEvent(activeEvent);
```

#### Listening for the event in `index.html`:

```html
<script>
    document.querySelector('custom-button')
        .addEventListener('active', () => {
            console.log('Component is active!');
        });
</script>
```

---

