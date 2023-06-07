import { expect } from 'chai';
import { FieldError } from '../../../error/FieldError';
import { validateRequired } from '../validateRequired';
import { simpleTextField } from './fixtures/components';

it('Validating a simple component that is required and not present in the data will return a field error', async () => {
    const component = { ...simpleTextField, validate: { required: true } };
    const result = await validateRequired(component, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result && result.message).to.contain('is required');
});

it('Validating a simple component that is required and present in the data will return null', async () => {
    const component = { ...simpleTextField, validate: { required: true } };
    const result = await validateRequired(
        component,
        { component: 'a simple value' },
    );
    expect(result).to.equal(null);;
});

it('Validating a simple component that is not required and present in the data will return null', async () => {
    const component = simpleTextField;
    const result = await validateRequired(
        component,
        { simpleComponent: 'a simple value' },
    );
    expect(result).to.equal(null);
});

it('Validating a simple component that is not required and not present in the data will return null', async () => {
    const component = simpleTextField;
    const result = await validateRequired(component, {});
    expect(result).to.equal(null);
});
