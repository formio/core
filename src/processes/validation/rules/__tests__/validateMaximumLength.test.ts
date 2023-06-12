import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleTextField } from './fixtures/components';
import { validateMaximumLength } from '../validateMaximumLength';

it('Validating a component without a maxLength property will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMaximumLength(component, data, {});
    expect(result).to.equal(null);
});

it('Validating a component with a maxLength property and a length greater than maxLength will return a FieldError', async () => {
    const component = { ...simpleTextField, validate: { maxLength: 4 } };
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMaximumLength(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('maxLength');
});

it('Validating a component with a maxLength property and a length less than maxLength will return null', async () => {
    const component = { ...simpleTextField, validate: { maxLength: 4 } };
    const data = {
        component: 'foo',
    };
    const result = await validateMaximumLength(component, data, {});
    expect(result).to.equal(null);
});
