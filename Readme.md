## Form.io Core JavaScript Rendering Engine
This library is the core rendering engine behind the Form.io platform. It is a tiny (12k gzipped) rendering frameworks that allows for the rendering of complex components as well as managing the data models controlled by each component.

### Usage
To use this library, you will first need to install it into your own application.

    npm install --save @formio/core

Next, you can create a new component as follows.

```js
import { Components } from '@formio/core';
Components.addComponent({
    type: 'h3',
    template: `<h3>{{ component.header }}</h3>`
});
```

And now this component will render using the following.

```js
const header = Components.createComponent({
    type: 'h3',
    header: 'This is a test',
});
console.log(header.render());  // Outputs <h3>This is a test</h3>
```