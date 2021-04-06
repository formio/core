import { DayRule } from './Day';
import { Component as ComponentBase } from '../../core/component/Component';
class Component extends ComponentBase() {}
import { assert } from 'chai';
describe('DayRule', () => {
    const day = new DayRule(new Component());
    it ('Should validate a bunch of different days', async () => {
        assert.equal(await day.check('01/05/12'), true);
        assert.equal(await day.check('January 5, 2012'), false);
        assert.equal(await day.check('2019-12-04T16:33:10.626Z'), false);
        assert.equal(await day.check(new Date()), false);
        assert.equal(await day.check('a'), false);
        assert.equal(await day.check('invalid date'), false);
        assert.equal(await day.check('Invalid Date'), false);
        assert.equal(await day.check(undefined), false);
        assert.equal(await day.check(null), true);
        assert.equal(await day.check(''), true);
    });
});