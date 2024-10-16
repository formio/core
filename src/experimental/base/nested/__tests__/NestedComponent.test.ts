import { NestedComponent as NestedBase } from '../NestedComponent';
import { assert } from 'chai';
import { comp1, comp2 } from './fixtures';
const NestedComponent = NestedBase()();

describe('Nested', function () {
  it('Should render a nested component', function () {
    const nested = new NestedComponent(comp1);
    assert.equal(
      nested.render(),
      `<div ref="nested">` +
        `<strong ref="html" data-within="${nested.id}">Hello</strong>` +
        `<h2 ref="html" data-within="${nested.id}">There</h2>` +
        `</div>`,
    );
  });

  it('Should not set or get data', function () {
    const data = {};
    const nested = new NestedComponent(comp2, {}, data);
    nested.dataValue = {
      firstName: 'Joe',
      lastName: 'Smith',
    };
    assert.deepEqual(data, {
      firstName: 'Joe',
      lastName: 'Smith',
    });
    assert.deepEqual(nested.dataValue, {
      firstName: 'Joe',
      lastName: 'Smith',
    });
    assert.equal(nested.components[0].dataValue, 'Joe');
    assert.equal(nested.components[1].dataValue, 'Smith');
  });
});
