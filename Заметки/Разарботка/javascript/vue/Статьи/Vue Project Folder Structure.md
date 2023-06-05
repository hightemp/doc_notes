https://gist.github.com/plinionaves/1e619a414602cd535c6b73a035ae2f75

# Style Guide

This file describes de **_required_** Style Guide used by Basicamente to keep the Best Practices on develop new features or improve/change existents one.

## Project folder structure

**_Always_** follow the folder structure below:

```sh
src/
  core/
    components/
      BaseButton.vue
      BaseInput.vue
    models/
    store/
    services/
    views/
    ...
  modules/
    checkout/
      components/
        CheckoutCart.vue # web
        CheckoutCart.native.vue # generic native
        CheckoutCart.android.vue # android native
        CheckoutCart.ios.vue # ios native
        ...
      models/
      store/
      services/
      views/
      routes.ts
      ...
    customizer/
      models/
      store/
      services/
      views/
      routes.ts
      ...
  assets/
  scss/
  App.vue
  main.ts
  router.ts
  store.ts
```

Explanations:

- `core/`: used to place Components, Services, etc, that are common for whole application
- `modules/`: used to create new feature modules. Each has your owns Components, Models, Store, Routes, Services and so on, which do not communicate with other modules.
- `components/`: all components that belong to the module itself or the main root module
- `models/`: TypeScript interfaces/classes mapping the entities
- `store/`: root or namespaced Vuex store
- `services/`: TypeScript classes (or simple JS object exports) used to implement Business Logic. (tip: keep Components manipulating only screen presentational logic)
- `views/`: used to store routed components (pages)
- `routes.ts`: place the routes list of the module as an array (typed as `RouteConfig` from `vue-router`), and export this list as default. E.g.:

  ```ts
  // src/modules/customizer/routes.ts

  import { RouteConfig } from 'vue-router'

  const routes: RouteConfig[] = [
    {
      path: '/products/:produt/customize',
      name: 'Customizer',
      component: () => import('./views/TheCustomizer.vue'),
    },
  ]

  export default routes
  ```

## Conventions

First all, we recommend reading [Official Vue Style Guide](https://vuejs.org/v2/style-guide/), as many rules described there are used here.

### # Multi-word component names

Always try naming Components with multi-word, except for root `App` components, and built-in components provided by Vue, such as `<transition>` or `<component>`.

This prevents conflicts with existing and future HTML elements, since all HTML elements are a single word.

```sh
# Bad

components/
  Todo.vue
```

```sh
# Good

components/
  TodoItem.vue
  TodoList.vue
```

### # Single-file component filename casing

**Filenames of single-file components should be always PascalCase.**

PascalCase works best with autocompletion in code editors, as it’s consistent with how we reference components in JS(X) and templates, wherever possible.

```sh
# Bad

components/
  mycomponent.vue
  myComponent.vue
  my-component.vue
```

```sh
# Good

components/
  MyComponent.vue
```

### # Other files names

Except for `.vue` files, use suffix indicating what resource is in that file. Follow these rules:

- Services: `<Name>.service.ts`, e.g.: `Customizer.service.ts`
- Models: `<Name>.model.ts`
- Store (Vuex): `<Name>.store.ts`

### # Base component names

**Base components (a.k.a. presentational, dumb, or pure components) that apply app-specific styling and conventions should all begin with `Base` prefix.**

```sh
# Bad

components/
  MyButton.vue
  VueTable.vue
  Icon.vue
```

```sh
# Good

components/
  BaseButton.vue
  BaseTable.vue
  BaseIcon.vue
```

[> Detailed explanation in the Vue Style Guide](https://vuejs.org/v2/style-guide/#Base-component-names-strongly-recommended)

### # Single-instance component names

[> Follow Official Vue Style Guide Rule](https://vuejs.org/v2/style-guide/#Single-instance-component-names-strongly-recommended)

**Note: This rule also applies to routed components.**

### # Tightly coupled component names

[> Follow Official Vue Style Guide Rule](https://vuejs.org/v2/style-guide/#Tightly-coupled-component-names-strongly-recommended)

### # Order of words in component names

[> Follow Official Vue Style Guide Rule](https://vuejs.org/v2/style-guide/#Order-of-words-in-component-names-strongly-recommended)

### # Component name casing in templates

**Component names should always be PascalCase in single-file components**

```sh
# Bad

<mycomponent />
<myComponent />
```

```sh
# Good

<Mycomponent />
```

[> Detailed explanation in the Vue Style Guide](https://vuejs.org/v2/style-guide/#Component-name-casing-in-templates-strongly-recommended)

### # Self-closing components

**Components with no content should be self-closing in single-file components, string templates, and JSX - but never in DOM templates.**

```sh
# Bad

<MyComponent></MyComponent>
```

```sh
# Good

<MyComponent />
```

### # Full-word component names

[> Follow Official Vue Style Guide Rule](https://vuejs.org/v2/style-guide/#Full-word-component-names-strongly-recommended)

### # Avoid `v-for` with `v-if`

**Never use `v-if` on the same element as `v-for`.**

There are two common cases where this can be tempting:

- To filter items in a list (e.g. `v-for="user in users" v-if="user.isActive"`). In these cases, replace users with a new computed property that returns your filtered list (e.g. activeUsers).

- To avoid rendering a list if it should be hidden (e.g. `v-for="user in users" v-if="shouldShowUsers"`). In these cases, move the `v-if` to a container element (e.g. ul, ol).

[> Detailed explanation in the Vue Style Guide](https://vuejs.org/v2/style-guide/#Avoid-v-if-with-v-for-essential)