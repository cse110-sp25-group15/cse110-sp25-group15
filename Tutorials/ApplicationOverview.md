# Application Overview

The application is a streamlined CRUD (Create, Read, Update, Delete) application built using vanilla web technologies without relying on external frameworks. This approach gives us full control over the architecture while reducing bundle size and dependency overhead.

We've implemented a tailored version of the MVC (Model-View-Controller) architectural pattern that's specifically optimized for web components. 

The architecture consists of three distinct layers:

1. **Custom Web Components as Views**: Encapsulated, reusable UI elements that manage their own rendering through Shadow DOM and respond to attribute changes.

2. **Domain Models**: Pure JavaScript classes that encapsulate business logic and data structures, completely independent from presentation concerns.

3. **Controllers as Coordinators**: Mediator objects that handle the event flow between components, update models in response to user actions, and reflect model changes back to the views.

This approach allows us to achieve several key objectives:

- **Maintainability**: Clear separation between UI, business logic, and application flow
- **Testability**: Isolated components that can be tested independently
- **Reusability**: Components and models that can be repurposed across different parts of the application
- **Performance**: Minimal overhead with no framework abstractions


## The View Layer

The view is implemented through JavaScript-based custom web components that we're building. These components encapsulate their own DOM structure and styling through the Shadow DOM.

```javascript
attributeChangedCallback(name) {
    if (name === 'checked') {
      this.updateCheckedStyle();
    }
  }

  updateCheckedStyle() {
    if (!this.checkbox) { return; }
    this.checkbox.classList.toggle('checked', this.hasAttribute('checked'));
  }
```

The view's primary responsibility is to update the final appearance of each visual element based on the attributes assigned to the component. Components listen for attribute changes through the built-in `attributeChangedCallback()` lifecycle method and update their internal DOM accordingly.

We have considered using properties instead of attributes but concluded that attributes are better for several compelling reasons:

1. **Declarative HTML Support**: Attributes can be set directly in HTML markup, supporting a more declarative programming model that aligns with web standards.

2. **CSS Selector Targeting**: Attributes enable targeting different component states with CSS selectors (e.g., `checkbox-item[checked]`), providing more styling flexibility.

3. **Developer Tooling**: Attributes are visible in browser DevTools element inspection, making debugging and state visualization much easier.

4. **Progressive Enhancement**: Attributes work well with server-rendered HTML and can maintain state even when JavaScript is delayed or disabled.

5. **Serialization**: Attributes are automatically serialized to strings, creating a clear contract for data types at the component boundary.

Each component maintains its own isolated visual representation while exposing a clear attribute-based API for the controller to interact with. Internal implementation details remain encapsulated, allowing the component to evolve independently while maintaining its external interface.

For complex user interactions that don't affect the model (such as hover states, focus handling, or animations), components manage these states internally without controller involvement. However, for interactions that should affect application state, components emit events that bubble up to controller listeners.

This approach creates a clean separation where components are responsible for their own rendering and internal behavior, while the broader application flow and state management remain the controller's domain.


## The Controller Layer

The controller will reside in the `scripts/controllers` folder, maintaining proper separation from the models directory. The controller will be responsible for both updating the model and the view, which aligns with certain MVC variants like Model-View-Presenter (MVP).

We determined that the web component architecture's view layer lacks an elegant built-in mechanism to subscribe directly to model changes. While `attributeChangedCallback()` provides reactivity, it only responds to attribute changes rather than model state changes. Implementing a direct model subscription system would require either convoluted boilerplate code or dependency on external reactive libraries. Therefore, we've adopted a pragmatic approach: updating the view through attribute changes managed by the controller.

Our controller implementation will:

1. Add event listeners for events propagated from individual components
2. Update the model based on these events
3. Reflect model changes back to components by updating their attributes

This approach maintains clear separation of concerns while avoiding unnecessary complexity. Components will still independently manage their internal UI states (such as hover effects or animations), while the controller handles application state and coordination. For efficiency with multiple components, we'll implement event delegation by listening at the container level rather than attaching listeners to each component.

This pattern resembles the Model-View-Adapter variation of MVC, where the controller acts as an adapter between the model and view, translating between them while keeping them decoupled. This provides us with the core benefits of architectural separation while remaining practical for web component implementation.

## The Model Layer

The model layer resides in the `scripts/models` directory and serves as the authoritative source of application data and business logic. Unlike simple state containers, our models encapsulate complete domain knowledge, validation rules, and data manipulation methods.

The model layer's primary responsibilities include:

1. **Data & Business Logic**: Managing core data structures while implementing the rules that govern how this data can be created, modified, and validated, ensuring application data integrity.

2. **Domain Knowledge Encapsulation**: Representing the essential concepts and relationships in our application domain, independent of how they might be displayed or interacted with.

3. **State Persistence**: Handling the saving and loading of application state to/from storage mechanisms like localStorage or external APIs, maintaining continuity across sessions.

Our models intentionally know nothing about the view layer or controllers. They operate as independent entities focused solely on data and business rules. This decoupling ensures that models can be tested in isolation and potentially reused across different interfaces.

By centralizing all data manipulation in the model layer, we ensure consistent application behavior regardless of which controller or view component initiates a change. This single source of truth approach prevents data inconsistencies and simplifies debugging by providing clear audit trails of state changes.

The model never directly manipulates the DOM or responds to user events - those responsibilities belong to the view and controller layers respectively. This separation allows our model logic to remain focused on the core business problem domain rather than presentation concerns.

