export default class CircularSelector {
  constructor(root) {
    this.root = root;

    // Inject HTML
    fetch('./circular.md/circular-selector/circular-selector.html')
      .then(res => res.text())
      .then(html => {
        root.innerHTML = html;
      });

    // Inject CSS 
    if (!document.querySelector("#circular-selector-style")) {
      const link = document.createElement("link");
      link.id = "circular-selector-style";
      link.rel = "stylesheet";
      link.href = "./circular.md/circular-selector/circular-selector.css";
      document.head.appendChild(link);
    }
  }
}
