import { CustomRule } from './Custom';
import { Component as ComponentBase } from '@formio/base';
const Component = ComponentBase()();
import { assert } from 'chai';
describe('CustomRule', () => {
    const component = new Component({key: 'data'});
    const rule = new CustomRule(component, `valid = true;`);
    it ('Default value should be valid.', async () => {
        assert.equal(await rule.check(), true);
    });
    it ('Should validate if data is provided.', async () => {
        rule.settings = 'valid = ((data.data.a + data.data.b) === 10);';
        component.dataValue = {
            a: 5,
            b: 5
        };
        assert.equal(await rule.check(), true);
    });
    it ('Should fail if valid is false.', async () => {
        rule.settings = 'valid = ((data.data.a + data.data.b) === 10);';
        component.dataValue = {
            a: 5,
            b: 6
        };
        assert.equal(await rule.check(), false);
    });
    it ('Should validate if row and data is provided.', async () => {
        rule.settings= 'valid = ((data.data.a + row.data.b) === 10);';
        component.dataValue = {
            a: 5,
            b: 5
        };
        assert.equal(await rule.check(), true);
    });
    it ('Should fail if row and data is wrong.', async () => {
        rule.settings = 'valid = ((data.data.a + row.data.b) === 10);';
        component.dataValue = {
            a: 5,
            b: 6
        };
        assert.equal(await rule.check(), false);
    });

    it('Should allow for a custom error message', async () => {
        rule.settings = 'valid = ((data.data.a + row.data.b) === 10) ? true : "The sum of the numbers must equal 10!"';
        component.dataValue = {
            a: 5,
            b: 6
        };
        assert.equal(await rule.check(), "The sum of the numbers must equal 10!");
    });
});