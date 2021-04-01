import { EmailRule } from './Email';
import { Component } from '../../core/component/Component';
import { assert } from 'chai';
describe('EmailRule', () => {
    const component = new Component({
        key: 'data'
    });
    const email = new EmailRule(component);
    it ('Should validate a bunch of different emails', async () => {
        assert.equal(await email.check('test'), false);
        assert.equal(await email.check('test@a'), false);
        assert.equal(await email.check('test@example.com'), true);
        assert.equal(await email.check('test@a.com'), true);
        assert.equal(await email.check('test@a.co'), true);
    });
});