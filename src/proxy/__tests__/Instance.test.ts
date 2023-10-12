import { assert } from 'chai';
import { Components } from '@formio/js';
import { FormProxy, InstanceProxy } from '../index';

describe('InstanceProxy', () => {
    it('InstanceProxy should proxy a component.', () => {
        const TextField = new Components.components.textfield({
            type: 'textfield',
            label: 'First Name',
            key: 'firstName',
            input: true
        }, {
            badFunction: () => {
                throw new Error('This function should not be called!!!');
            }
        }, {
            firstName: 'Joe'
        });
        const proxy = new InstanceProxy(TextField);
        assert(!(proxy as any)['#instance'], 'Should not have access to the private instance variable "#instance"');
        assert.equal(proxy.dataValue, 'Joe', 'Should have access to the public dataValue variable');
        assert.deepEqual(proxy.data, { firstName: 'Joe' }, 'Should have access to the public data variable');
        assert.equal(proxy.getValue(), 'Joe', 'Should have access to the public getValue function');
        assert(proxy.root instanceof FormProxy, 'It should return a FormProxy for the root variable.');
        assert.equal(typeof proxy.options.badFunction, 'string', 'It should not be able to execute a function.');
    });
});