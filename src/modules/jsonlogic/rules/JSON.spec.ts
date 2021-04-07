import '../index';
import { Formio } from '../../../form';
import { Component as ComponentBase } from '../../../core/component/Component';
const Component = ComponentBase()();
const JSONRule = (Formio as any).Validator.rules.json;
import { assert } from 'chai';
describe('JSONRule', () => {
    const json = new JSONRule(new Component(), {
        json: {or: [{ '_isEqual': [{ var: 'data.test' }, ['1', '2', '3']] }, 'Should be false.']}
    });
    it('Should validate a bunch of different json rules', async () => {
        assert.equal(await json.check(null, { test: ['1', '2', '3'] }), true);
        assert.equal(await json.check(null, { test: ['1', '2', '4'] }), 'Should be false.');
    });
});