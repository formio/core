import { MaxLengthRule } from './MaxLength';
import { ArrayComponent as ArrayComponentBase } from '@formio/base';
import { assert } from 'chai';
const ArrayComponent = ArrayComponentBase()();

describe('MaxLengthRule', () => {
    const component = new ArrayComponent({
        key: 'data',
        components: [
            {
                type: 'datavalue',
                key: 'firstName'
            }
        ]
    });
    const maxLength = new MaxLengthRule(component, {length: 5});
    it ('Should validate a default value Array Component', async () => {
        assert.equal(component.dataValue.length, 0);
        assert.equal(await maxLength.check(), true);
    });
    it ('Should pass if less than the maximum length.', async () => {
        component.dataValue = [{firstName: 'Joe'}];
        assert.equal(component.dataValue.length, 1);
        assert.equal(await maxLength.check(), true);
    });
    it ('Should pass if one less than the maximum length.', async () => {
        component.dataValue = [
            {firstName: 'Joe'},
            {firstName: 'Sally'},
            {firstName: 'Marshall'},
            {firstName: 'Tami'}
        ];
        assert.equal(component.dataValue.length, 4);
        assert.equal(await maxLength.check(), true);
    });
    it ('Should pass if exactly the maximum length.', async () => {
        component.dataValue = [
            {firstName: 'Joe'},
            {firstName: 'Sally'},
            {firstName: 'Marshall'},
            {firstName: 'Tami'},
            {firstName: 'Jerry'}
        ];
        assert.equal(component.dataValue.length, 5);
        assert.equal(await maxLength.check(), true);
    });
    it ('Should fail if more than the maximum length.', async () => {
        component.dataValue = [
            {firstName: 'Joe'},
            {firstName: 'Sally'},
            {firstName: 'Marshall'},
            {firstName: 'Tami'},
            {firstName: 'Jerry'},
            {firstName: 'Tom'}
        ];
        assert.equal(component.dataValue.length, 6);
        assert.equal(await maxLength.check(), false);
    });
    it ('Should pass if value is bogus.', async () => {
        component.dataValue = [
            {firstName: 'Joe'},
            {firstName: 'Sally'},
            {firstName: 'Marshall'},
            {firstName: 'Tami'},
        ];
        assert.equal(await maxLength.check(25), true);
    });
    it ('Should allow custom values.', async () => {
        component.dataValue = [
            {firstName: 'Joe'},
            {firstName: 'Sally'},
            {firstName: 'Marshall'},
            {firstName: 'Tami'},
            {firstName: 'Jerry'}
        ];
        assert.equal(await maxLength.check([
            {firstName: 'Joe'},
            {firstName: 'Sally'},
            {firstName: 'Marshall'},
            {firstName: 'Tami'},
        ]), true);
    });
});