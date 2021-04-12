import { assert } from 'chai';
import { DataComponent as DataComponentBase } from './DataComponent';
import { comp1 } from './fixtures';
const DataComponent = DataComponentBase()()

describe('DataComponent', () => {
    it ('Should create a new Data Component', () => {
        const data = {};
        new DataComponent(comp1, {}, data);
        assert.deepEqual(data, {employee: {}});
    });

    it ('Should initialize the data component with data', () => {
        const data = {
            employee: {
                firstName: 'Joe',
                lastName: 'Smith'
            }
        };
        const dataComp = new DataComponent(comp1, {}, data);
        assert.deepEqual(dataComp.dataValue, {
            firstName: 'Joe',
            lastName: 'Smith'
        });
        assert.equal(dataComp.components[0].dataValue, 'Joe');
        assert.equal(dataComp.components[1].dataValue, 'Smith');
    });

    it ('Should set the value of the sub components', () => {
        const data = {};
        const dataComp = new DataComponent(comp1, {}, data);
        dataComp.dataValue = {
            firstName: 'Joe',
            lastName: 'Smith'
        };
        assert.deepEqual(data, {employee: {
            firstName: 'Joe',
            lastName: 'Smith'
        }});
        assert.deepEqual(dataComp.dataValue, {
            firstName: 'Joe',
            lastName: 'Smith'
        });
        assert.equal(dataComp.components[0].dataValue, 'Joe');
        assert.equal(dataComp.components[1].dataValue, 'Smith');
    });
});