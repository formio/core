import { expect } from 'chai';

import { clearHiddenProcessSync } from '../index';

describe('clearHidden', function () {
  it('Shoud not clear conditionally hidden component data when clearOnHide is false', function () {
    // Test case data
    const context = {
      component: {
        type: 'textfield',
        key: 'foo',
        clearOnHide: false,
        input: true,
      },
      data: {
        foo: 'bar',
      },
      value: 'foo',
      row: {},
      scope: {
        clearHidden: {},
        conditionals: [
          {
            path: 'foo',
            conditionallyHidden: true,
          },
        ],
      },
      path: 'foo',
    };
    clearHiddenProcessSync(context);
    expect(context.data).to.deep.equal({ foo: 'bar' });
  });

  it('Should clear conditionally hidden component data when clearOnHide is true', function () {
    // Test case data
    const context = {
      component: {
        type: 'textfield',
        key: 'foo',
        clearOnHide: true,
        input: true,
      },
      data: {
        foo: 'bar',
      },
      value: 'foo',
      row: {},
      scope: {
        clearHidden: {},
        conditionals: [
          {
            path: 'foo',
            conditionallyHidden: true,
          },
        ],
      },
      path: 'foo',
    };
    clearHiddenProcessSync(context);
    expect(context.data).to.deep.equal({});
  });

  it('Should not clear component data when the component is intentionally hidden', function () {
    // Test case data
    const context = {
      component: {
        type: 'textfield',
        key: 'foo',
        clearOnHide: true,
        input: true,
        hidden: true,
      },
      data: {
        foo: 'bar',
      },
      value: 'foo',
      row: {},
      scope: {
        clearHidden: {},
      },
      path: 'foo',
    };
    clearHiddenProcessSync(context);
    expect(context.data).to.deep.equal({ foo: 'bar' });
  });
});
