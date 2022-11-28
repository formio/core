import { assert } from 'chai';
import { DataValueComponent } from '../test';

describe('DataValue', () => {
  it ('Should create a DataValue component', () => {
    const dataValue = new DataValueComponent({
      type: 'datavalue',
      key: 'firstName',
      label: 'First Name'
    }, {}, {
      firstName: 'Joe'
    });
    assert.equal((dataValue as any).render(), '<span ref="val">Joe</span>');
  });
});