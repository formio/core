import { assert } from 'chai';
import { Displays } from '@formio/js';
import { FormProxy, InstanceProxy } from '../index';

describe('FormProxy', () => {
    it('FormProxy should proxy a form instance.', () => {
        const formJSON = {
            components: [
                {
                    type: 'textfield',
                    label: 'First Name',
                    key: 'firstName',
                    input: true
                },
                {
                    type: 'textfield',
                    label: 'Last Name',
                    key: 'lastName',
                    input: true
                }
            ]
        };
        const webform = new Displays.displays.webform({
            badFunction: () => {
                throw new Error('This function should not be called!!!');
            }
        });
        webform.setForm(formJSON).then(() => {
            const proxy = new FormProxy(webform);
            assert(!(proxy as any)['#instance'], 'Should not have access to the private instance variable "#instance"');
            proxy.setSubmission({
                data: {
                    firstName: 'Joe',
                    lastName: 'Smith'
                }
            }).then(() => {
                const firstName = proxy.getComponent('firstName');
                assert(firstName instanceof InstanceProxy, 'Should return an InstanceProxy for the component.');
                assert.equal(firstName.dataValue, 'Joe', 'Should have access to the public dataValue variable');
                const lastName = proxy.getComponent('lastName');
                assert(lastName instanceof InstanceProxy, 'Should return an InstanceProxy for the component.');
                assert.equal(lastName.dataValue, 'Smith', 'Should have access to the public dataValue variable');
            });
        });
    });
});