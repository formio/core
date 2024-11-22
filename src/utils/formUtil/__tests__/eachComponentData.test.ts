import { expect } from 'chai';

import { eachComponentData } from '../eachComponentData';
import { Component } from 'types';

describe('eachComponentData', function () {
  const components = [
    {
      key: 'form',
      type: 'form',
      order: 1,
      input: true,
      components: [
        {
          type: 'textfield',
          key: 'textField1',
          order: 2,
        },
        {
          type: 'textfield',
          key: 'textField2',
          order: 3,
        },
      ],
    },
    {
      key: 'textField',
      type: 'textfield',
      order: 4,
      input: true,
    },
  ];

  const data = {
    form: {
      data: {
        textField1: 'textField1Value',
        textField2: 'textField2Value',
      },
      metadata: {},
    },
    textField: 'textFieldValue',
    submit: true,
  };

  it('Should iterate through nested form components in the right order', function () {
    let n = 1;

    eachComponentData(components, data, (component: Component) => {
      expect((component as any).order).to.equal(n);
      n += 1;
    });
  });
});
