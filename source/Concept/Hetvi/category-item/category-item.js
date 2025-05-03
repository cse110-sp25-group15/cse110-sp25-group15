// category-item.js
class CategoryItem extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"});
        const template = document.getElementById("category-item-template");
        const templateContent = template.content.cloneNode(true);
        shadow.appendChild(templateContent);
    }
}
customElements.define("category-item", CategoryItem);