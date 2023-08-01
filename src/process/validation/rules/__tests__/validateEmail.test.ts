import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleEmailField } from './fixtures/components';
import { generateProcessContext } from './fixtures/util';
import { validateEmail } from '../validateEmail';

it('Validating a valid email will return null', async () => {
    const component = simpleEmailField;
    const data = {
        component: 'sales@form.io',
    };
    const context = generateProcessContext(component, data);
    const result = await validateEmail(context);
    expect(result).to.equal(null);
});

it('Validating an invalid email will return a FieldError', async () => {
    const component = simpleEmailField;
    const data = {
        component: 'salesatform.io',
    };
    const context = generateProcessContext(component, data);
    const result = await validateEmail(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('invalid_email');
});
