import { expect } from 'chai';
import { FieldError } from '../../../error/FieldError';
import { simpleEmailField } from './fixtures/components';
import { validateEmail } from '../validateEmail';

it('Validating a valid email will return null', async () => {
    const component = simpleEmailField;
    const data = {
        component: 'sales@form.io',
    };
    const result = await validateEmail(component, data, {});
    expect(result).to.equal(null);
});

it('Validating an invalid email will return a FieldError', async () => {
    const component = simpleEmailField;
    const data = {
        component: 'salesatform.io',
    };
    const result = await validateEmail(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.message).to.contain('must be a valid email');
});
