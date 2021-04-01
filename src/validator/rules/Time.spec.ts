import { TimeRule } from './Time';
import { Component } from '../../core/component/Component';
import { assert } from 'chai';
describe('TimeRule', () => {
    const component = new Component({key: 'data'});
    const rule = new TimeRule(component);
    it ('Default value should be valid.', async () => {
        assert.equal(await rule.check(), true);
    });
});