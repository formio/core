import { assert } from 'chai';
import { DataValueComponent } from '../test';

describe('DataValue', function () {
  it('Should create a DataValue component', function () {
    const dataValue = new DataValueComponent(
      {
        type: 'datavalue',
        key: 'firstName',
        label: 'First Name',
      },
      {},
      {
        firstName: 'Joe',
      },
    );
    assert.equal((dataValue as any).render(), '<span ref="val">Joe</span>');
  });
});
