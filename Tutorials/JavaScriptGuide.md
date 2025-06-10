
# Web Component JavaScript Guide


## 1. Overview

* This guide does not cover all aspects of writing a Web Component; it only covers the most common patterns you might see. If you have questions or need functionality that conflicts with this guide, please contact me and I’ll adjust accordingly.
* Component-level state should be handled as you see fit. It can be a class variable like `this.myState` defined in the constructor, or simply an attribute with a corresponding `attributeChangedCallback()` if the state needs to be exposed externally.
* If a topic is unclear or not covered, contact me directly rather than guessing.
* Use common sense. If a function is 5 lines long and used once, ask yourself whether you really need it or if you can just write the code directly. Likewise, if a function is over 100 lines, consider breaking it up for readability and maintainability.
* **❌ Absolutely no inline HTML or inline styles in JavaScript.** 

---

## 2. File Anatomy (Recommended Order)

| Order | Section                      | Notes                               |
| ----- | ---------------------------- | ----------------------------------- |
| 1     | `constructor()`              | Shadow DOM creation only            |
| 2     | `connectedCallback()`        | Bind listeners, first paint         |
| 3     | `disconnectedCallback()`     | Unbind listeners & observers        |
| 4     | `attributeChangedCallback()` | Delegate to render helpers          |
| 5     | **DOM-update helpers**       | Purely mutate the shadow DOM        |
| 6     | **Event-handler methods**    | Bound once in `connectedCallback()` |
| 7     | **Utility helpers**          | Pure functions / formatting         |

> **Why this order?**
> *High-level first → helpers last* simplifies code reviews and reduces scroll distance when scanning APIs.

---

## 3. The `constructor()` Rules

| ✅ Do                                                                                              | ❌ Don’t                                  |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Create and attach **Shadow DOM** via `this.attachShadow({mode: 'open'})`.                         | Attach **event listeners** (bind later). |
| Clone a `<template>` into the shadow root using `.appendChild(template.content.cloneNode(true))`. | Read or write **attributes**.            |

> ✅ Recommended pattern:

```js
constructor() {
  super();
  this.attachShadow({ mode: 'open' });

  const template = document.createElement('template');
  template.innerHTML = `<style>${css}</style>${html}`;
  this.shadowRoot.appendChild(template.content.cloneNode(true));
}
```

---

## 4. The Lifecycle `callback` Rules

### 4.1 `connectedCallback()`

* Bind all DOM elements you'll use later in your code.
* Bind all DOM event listeners **once**, here only.

```js
connectedCallback() {
  this.form = this.shadowRoot.querySelector('.listing-form');
  this.wordCounter = this.shadowRoot.querySelector('#word-count');
  this.descriptionField = this.shadowRoot.querySelector('#description');
  this.mediaInput = this.shadowRoot.querySelector('#media-upload');
  this.previewModal = this.shadowRoot.querySelector('#preview-modal');
  this.closePreviewButton = this.shadowRoot.querySelector('.close-preview');
  this.previewContainer = this.shadowRoot.querySelector('.preview-media');
  this.previewButton = this.shadowRoot.querySelector('#preview-button');

  this._handleSubmit = this._handleSubmit.bind(this);
  this._updateWordCount = this._updateWordCount.bind(this);
  this._previewMedia = this._previewMedia.bind(this);
  this._showPreview = this._showPreview.bind(this);
  this._hidePreview = this._hidePreview.bind(this);

  this.form.addEventListener('submit', this._handleSubmit);
  this.descriptionField.addEventListener('input', this._updateWordCount);
  this.mediaInput.addEventListener('change', this._previewMedia);
  this.previewButton.addEventListener('click', this._showPreview);
  this.closePreviewButton.addEventListener('click', this._hidePreview);
}
```

### 4.2 `disconnectedCallback()`

* Unbind anything bound in `connectedCallback()` to avoid memory leaks.

```js
disconnectedCallback() {
  this.form.removeEventListener('submit', this._handleSubmit);
  this.descriptionField.removeEventListener('input', this._updateWordCount);
  this.mediaInput.removeEventListener('change', this._previewMedia);
  this.previewButton.removeEventListener('click', this._showPreview);
  this.closePreviewButton.removeEventListener('click', this._hidePreview);
}
```

### 4.3 `attributeChangedCallback()`

* Validate changed values and bail early if unchanged.
* Delegate to a single DOM-update helper to maintain clarity.

```js
attributeChangedCallback(name, oldVal, newVal) {
  if (oldVal === newVal) return;
  if (name === 'disabled') this._renderDisabled();
}
```

* Remember: this callback only fires for attributes listed in `static get observedAttributes()`.

---

## 5. Function Categories

1. **DOM-Update helpers**

   * Modify the shadow DOM exactly *once*.
   * Do **not** call one DOM-update helper from another.

```js
_updateWordCount() {
  const wordCount = this.descriptionField.value.trim().split(/\s+/).filter(Boolean).length;
  this.wordCounter.textContent = `${wordCount}/250`;
}
```

2. **Event Handlers**

   * Only bind in `connectedCallback()`.
   * May call DOM-update helpers or emit events to parents.

```js
_handleSubmit(event) {
  event.preventDefault();
  const data = this._gatherFormData();
  const errors = this._validateForm(data);
  if (errors.length === 0) {
    this.dispatchEvent(
      new CustomEvent('listing-submit', {
        bubbles: true,
        composed: true,
        detail: data,
      })
    );
  } else {
    alert(errors.join('\n'));
  }
}
```

3. **Utility Helpers**

   * Pure functions for data formatting, validation, etc.
   * Should never modify the DOM.
   * Live at the bottom of the file.

```js
_validateForm(data) {
  const errors = [];
  if (!data.title || data.title.length < 3) errors.push('Title must be at least 3 characters.');
  if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(data.price)) errors.push('Price must be a valid number.');
  if (data.description.split(/\s+/).filter(Boolean).length > 250)
    errors.push('Description exceeds 250 words.');
  return errors;
}
```

---

## 6. Review Checklist (PRs)

1. Constructor creates shadow DOM and *nothing else*.
2. Shadow DOM is populated via `<template>` cloning — not `innerHTML`.
3. All listeners are added in `connectedCallback()` and removed in `disconnectedCallback()`.
4. `attributeChangedCallback()` delegates to a DOM-rendering helper.
5. DOM-update helpers are idempotent and flat.
6. Component exposes theming hooks via CSS variables and relevant attributes.
7. ❌ No inline styles or HTML in JavaScript — use `<template>` and `<style>`.

Please check for all listed items above MANUALLY before your submit, I'm not here to be a GPT proof-reader. 