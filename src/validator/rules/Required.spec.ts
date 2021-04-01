import { RequiredRule } from './Required';
import { Component } from '../../core/component/Component';
import { assert } from 'chai';
describe('RequiredRule', () => {
    const component = new Component({key: 'data'});
    const required = new RequiredRule(component, {
        required: true
    });
    it ('Should fail if no value is provided.', async () => {
        assert.equal(await required.check(), false);
    });
    it ('Should pass if a value is provided.', async () => {
        component.dataValue = 'one';
        assert.equal(await required.check(), true);
    });
    it ('Should pass if value has been redacted', async () => {
        component.component.protected = true;
        component.dataValue = '';
        assert.equal(await required.check(), true);
    });
    it ('Should pass if the value is not persistent', async () => {
        component.component.protected = false;
        component.component.persistent = false;
        component.dataValue = '';
        assert.equal(await required.check(), true);
    });
    it ('Should fail if the value is persistent', async () => {
        component.component.protected = false;
        component.component.persistent = true;
        component.dataValue = '';
        assert.equal(await required.check(), false);
    });
    it ('Should pass if the persistence is "client-only"', async () => {
        component.component.protected = false;
        component.component.persistent = 'client-only';
        component.dataValue = '';
        assert.equal(await required.check(), true);
    });
});