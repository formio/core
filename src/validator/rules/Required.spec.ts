import { RequiredRule } from './Required';
import { Component as ComponentBase } from '@formio/base';
const Component = ComponentBase()();
import { assert } from 'chai';
describe('RequiredRule', () => {
    const component = new Component({key: 'data'});
    const required = new RequiredRule(component, true);
    it ('Should fail if no value is provided.', async () => {
        assert.equal(await required.check(), false);
    });
    it ('Should pass if a value is provided.', async () => {
        component.dataValue = 'one';
        assert.equal(await required.check(), true);
    });
});