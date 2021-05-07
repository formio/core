import { MinLengthRule } from './MinLength';
import { ArrayComponent as ArrayComponentBase } from '@formio/base';
import { assert } from 'chai';
const ArrayComponent = ArrayComponentBase()();

describe('MinLengthRule', () => {
    const component = new ArrayComponent({
        key: 'data',
        components: [
            {
                type: 'datavalue',
                key: 'firstName'
            }
        ]
    });
    const minLength = new MinLengthRule(component, 5);
    it ('Should validate a default value Array Component', async () => {
        assert.equal(component.dataValue.length, 0);
        assert.equal(await minLength.check(), true);
    });
    it ('Should fail if less than the minimum length.', async () => {
        component.dataValue = [{firstName: 'Joe'}];
        assert.equal(component.dataValue.length, 1);
        assert.equal(await minLength.check(), false);
    });
    it ('Should fail if one less than the minimum length.', async () => {
        component.dataValue = [
            {firstName: 'Joe'},
            {firstName: 'Sally'},
            {firstName: 'Marshall'},
            {firstName: 'Tami'}
        ];
        assert.equal(component.dataValue.length, 4);
        assert.equal(await minLength.check(), false);
    });
    it ('Should pass if exactly the minimum length.', async () => {
        component.dataValue = [
            {firstName: 'Joe'},
            {firstName: 'Sally'},
            {firstName: 'Marshall'},
            {firstName: 'Tami'},
            {firstName: 'Jerry'}
        ];
        assert.equal(component.dataValue.length, 5);
        assert.equal(await minLength.check(), true);
    });
    it ('Should pass if more than the minimum length.', async () => {
        component.dataValue = [
            {firstName: 'Joe'},
            {firstName: 'Sally'},
            {firstName: 'Marshall'},
            {firstName: 'Tami'},
            {firstName: 'Jerry'},
            {firstName: 'Tom'}
        ];
        assert.equal(component.dataValue.length, 6);
        assert.equal(await minLength.check(), true);
    });
    it ('Should pass if value is bogus.', async () => {
        component.dataValue = [
            {firstName: 'Joe'},
            {firstName: 'Sally'},
            {firstName: 'Marshall'},
            {firstName: 'Tami'},
        ];
        assert.equal(await minLength.check(25), true);
    });
    it ('Should allow custom values.', async () => {
        component.dataValue = [
            {firstName: 'Joe'},
            {firstName: 'Sally'},
            {firstName: 'Marshall'},
            {firstName: 'Tami'},
        ];
        assert.equal(await minLength.check([
            {firstName: 'Joe'},
            {firstName: 'Sally'},
            {firstName: 'Marshall'},
            {firstName: 'Tami'},
            {firstName: 'Jerry'}
        ]), true);
    });
});