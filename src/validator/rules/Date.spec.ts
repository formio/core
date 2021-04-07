import { DateRule } from './Date';
import { Component as ComponentBase } from '../../core/component/Component';
const Component = ComponentBase()();
import { assert } from 'chai';
describe('DateRule', () => {
    const date = new DateRule(new Component());
    it ('Should validate a bunch of different dates', async () => {
        assert.equal(await date.check('01/05/12'), true);
        assert.equal(await date.check('January 5, 2012'), true);
        assert.equal(await date.check('2019-12-04T16:33:10.626Z'), true);
        assert.equal(await date.check(new Date()), true);
        assert.equal(await date.check('a'), false);
        assert.equal(await date.check('invalid date'), false);
        assert.equal(await date.check('Invalid Date'), false);
        assert.equal(await date.check(undefined), true);
        assert.equal(await date.check(null), true);
        assert.equal(await date.check(''), true);
    });
});