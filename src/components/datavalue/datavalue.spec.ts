import { assert } from 'chai';
import { Components } from '../../core';
const DataValueComponent = Components.components.datavalue;

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