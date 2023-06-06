import { FieldError } from '../../../error/FieldError';
import { simpleTextField } from 'test/fixtures/components';
import { validateMaximumLength } from '../validateMaximumLength';

test('Validating a component without a maxLength property will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMaximumLength(component, data, {});
    expect(result).toBeNull();
});

test('Validating a component with a maxLength property and a length greater than maxLength will return a FieldError', async () => {
    const component = { ...simpleTextField, validate: { maxLength: 4 } };
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMaximumLength(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('must have no more than 4 characters');
});

test('Validating a component with a maxLength property and a length less than maxLength will return null', async () => {
    const component = { ...simpleTextField, validate: { maxLength: 4 } };
    const data = {
        component: 'foo',
    };
    const result = await validateMaximumLength(component, data, {});
    expect(result).toBeNull();
});
