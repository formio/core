import { NestedComponent } from './NestedComponent';
import { Components } from '../index';
import { assert } from 'chai';
import { comp1, comp2 } from './fixtures';

describe('Nested', () => {
    it('Should render a nested component', () => {
        const nested = new NestedComponent(comp1);
        const renderedComp1 = (new Components.components.html(comp1.components[0])).render();
        const renderedComp2 = (new Components.components.html(comp1.components[1])).render();
        assert.equal(nested.render(), `<div>${renderedComp1}${renderedComp2}</div>`);
    });

    it ('Should not set or get data', () => {
        const data = {};
        const nested = new NestedComponent(comp2, {}, data);
        nested.dataValue = {
            firstName: 'Joe',
            lastName: 'Smith'
        };
        assert.deepEqual(data, {
            firstName: 'Joe',
            lastName: 'Smith'
        });
        assert.deepEqual(nested.dataValue, {
            firstName: 'Joe',
            lastName: 'Smith'
        });
        assert.equal(nested.components[0].dataValue, 'Joe');
        assert.equal(nested.components[1].dataValue, 'Smith');
    });
});