import { assert } from 'chai';
import { DataValueComponent } from './datavalue';

describe('DataValue', () => {
    it ('Should create a DataValue component', () => {
        const dataValue = new DataValueComponent({
            type: 'datavalue',
            key: 'firstName',
            label: 'First Name'
        }, {}, {
            firstName: 'Joe'
        });
        assert.equal(dataValue.render(), '<span ref="val">Joe</span>');
    });
});