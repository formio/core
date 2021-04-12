import { CustomRule } from './Custom';
import { Component as ComponentBase } from '@formio/base';
const Component = ComponentBase()();
import { assert } from 'chai';
describe('CustomRule', () => {
    const component = new Component({key: 'data'});
    const rule = new CustomRule(component, {
        custom: `valid = true;`
    });
    it ('Default value should be valid.', async () => {
        assert.equal(await rule.check(), true);
    });
    it ('Should validate if data is provided.', async () => {
        rule.settings.custom = 'valid = ((data.a + data.b) === 10);'
        assert.equal(await rule.check(null, {
            a: 5,
            b: 5
        }), true);
    });
    it ('Should fail if valid is false.', async () => {
        rule.settings.custom = 'valid = ((data.a + data.b) === 10);'
        assert.equal(await rule.check(null, {
            a: 5,
            b: 6
        }), false);
    });
    it ('Should validate if row and data is provided.', async () => {
        rule.settings.custom = 'valid = ((data.a + row.b) === 10);'
        assert.equal(await rule.check(null, {
            a: 5
        }, {
            b: 5
        }), true);
    });
    it ('Should fail if row and data is wrong.', async () => {
        rule.settings.custom = 'valid = ((data.a + row.b) === 10);'
        assert.equal(await rule.check(null, {
            a: 5
        }, {
            b: 6
        }), false);
    });
});