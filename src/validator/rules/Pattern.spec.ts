import { PatternRule } from './Pattern';
import { Component as ComponentBase } from '@formio/base';
const Component = ComponentBase()();
import { assert } from 'chai';
describe('PatternRule', () => {
    const component = new Component({key: 'data'});
    const numeric = new PatternRule(component, {
        pattern: '[0-9]+'
    });
    const alphanumeric = new PatternRule(component, {
        pattern: '[0-9a-zA-Z]+'
    });
    it ('Should only allow numeric values.', async () => {
        assert.equal(await numeric.check(1234), true);
        assert.equal(await numeric.check('1234'), true);
    });
    it ('Should fail if non-numeric values are added.', async () => {
        assert.equal(await numeric.check('1234abc'), false);
    });
    it ('Should only allow alpha-numeric values.', async () => {
        assert.equal(await alphanumeric.check(1234), true);
        assert.equal(await alphanumeric.check('1234'), true);
        assert.equal(await alphanumeric.check('1234abcd'), true);
        assert.equal(await alphanumeric.check('ABC1234abcd'), true);
    });
    it ('Should fail if non-alpha-numeric values are added.', async () => {
        assert.equal(await alphanumeric.check('1234!'), false);
        assert.equal(await alphanumeric.check('1234 abcd'), false);
        assert.equal(await alphanumeric.check('ABC1234abcd!'), false);
    });
    it ('Should work with component values.', async () => {
        component.dataValue = 'ABCabc123';
        assert.equal(await alphanumeric.check(), true);
    });
});