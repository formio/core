## Form.io Core Data Processing Engine

This library is the core data processing engine behind the Form.io platform. It is a set of isomorphic APIs that allow for complex orchestration (e.g. calculated values, conditionally hidden components, complex logic, etc.) of JSON form and submission definitions.

> [!IMPORTANT]
> As of 2 September 2025, the `master` branch will be renamed `master_old` and the default branch will be called `main`. `main` will be based on the `5.2.x` branch, which is the latest stable release. See [here](https://github.com/formio/core/issues/290) for more details about this change.

### Usage

@formio/core is available as an npm package. You can install it using the package manager of your choice:

```bash
# npm
npm install --save @formio/core

# yarn
yarn add @formio/core
```

### Development

Processing form and submission data efficiently has two distinct requirements:

1. A form- and data-aware traversal of the form JSON; and
2. A set of processing functions to derive (and occasionally mutate) form state.

The first requirement is accomplished via the `eachComponentData` and `eachComponentDataAsync` functions, which traverse each form component JSON and provide a callback parameter by which to interact with the component and it's corresponding submission data parameter(s).

The second requirement is accomplished via "processors" (e.g. `calculate`, `validate`, or `hideChildren`) which are functions that, given an evaluation `context`, operate on, derive state from, and occasionally mutate the form state and submission values depending on the internal form logic, resulting in a `scope` object that contains the results of each processor keyed by component path.

To run a suite of processor functions on a form and a submission, the `process` family of functions take a form JSON definition, a submission JSON definition, and an array of processor function as an arguments (encapsulated as a `context` object which is passed through to each callback processor function).

```js
import { processSync } from '@formio/core';

const form = {
  display: 'form',
  components: [
    {
      type: 'textfield',
      key: 'firstName',
      label: 'First Name',
      input: true,
    },
    {
      type: 'textfield',
      key: 'lastName',
      label: 'Last Name',
      input: true,
    },
    {
      type: 'button',
      key: 'submit',
      action: 'submit',
      label: 'Submit',
    },
  ],
};

const submission = {
  data: {
    firstName: 'John',
    lastName: 'Doe',
  },
};

const addExclamationSync = (context) => {
  const { component, data, scope, path, value } = context;

  if (!scope.addExclamation) scope.addExclamation = {};
  let newValue = `${value}!`;

  // The scope is a rolling "results" object that tracks which components have been operated on by which processor functions
  scope.addExclamation[path] = true;
  _.set(data, path, newValue);
  return;
};

// The context object is mutated depending on which component is being processed; after `processSync` it will contain the processed components and data
const context = {
  components: form.components,
  data: submission.data,
  processors: [{ processSync: addExclamationSync }],
  scope: {},
};

// The `process` family of functions returns the scope object
const resultScope = processSync(context);

console.assert(resultScope['addExclamation']?.firstName === true);
console.assert(resultScope['addExclamation']?.lastName === true);
console.assert(submission.data.firstName === 'John!');
console.assert(submission.data.lastName === 'Doe!');
```

### Debugging

Debugging the Form.io Enterprise Server can be challenging because of the added complexity of the @formio/vm library (which sandboxes the @formio/core processors for safe execution of untrusted JavaScript on the server). [Instructions on how to debug can be found here.](https://formio.atlassian.net/wiki/spaces/SD/pages/184025089/Debugging+formio+core)

### Experimental

This library contains experimental code (found in the `src/experimental` directory or via an import, e.g. `import { Components } from @formio/core/experimental`) that was designed to update and replace the core rendering engine behind the Form.io platform. It is a tiny (12k gzipped) rendering framework that allows for the rendering of complex components as well as managing the data models controlled by each component.

#### Usage

To use this experimental framework, you will first need to install the parent library into your application.

```bash
# npm
npm install --save @formio/core
# yarn
yarn add @formio/core
```

Next, you can create a new component as follows.

```js
import { Components } from '@formio/core/experimental';
Components.addComponent({
  type: 'h3',
  template: (ctx) => `<h3>${ctx.component.header}</h3>`,
});
```

And now this component will render using the following.

```js
const header = Components.createComponent({
  type: 'h3',
  header: 'This is a test',
});
console.log(header.render()); // Outputs <h3>This is a test</h3>
```

You can also use this library by including it in your webpage scripts by including the following.

```
<script src="https://cdn.jsdelivr.net/npm/@formio/base@latest/dist/formio.core.min.js"></script>
```

After you do this, you can then do the following to create a Data Table in your website.

```js
FormioCore.render(
  document.getElementById('data-table'),
  {
    type: 'datatable',
    key: 'customers',
    components: [
      {
        type: 'datavalue',
        key: 'firstName',
        label: 'First Name',
      },
      {
        type: 'datavalue',
        key: 'lastName',
        label: 'First Name',
      },
    ],
  },
  {},
  {
    customers: [
      { firstName: 'Joe', lastName: 'Smith' },
      { firstName: 'Sally', lastName: 'Thompson' },
      { firstName: 'Mary', lastName: 'Bono' },
    ],
  },
);
```
