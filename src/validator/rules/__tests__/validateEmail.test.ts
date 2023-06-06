import { FieldError } from '../../../error/FieldError';
import { simpleEmailField } from 'test/fixtures/components';
import { validateEmail } from '../validateEmail';

test('Validating a valid email will return null', async () => {
    const component = simpleEmailField;
    const data = {
        component: 'sales@form.io',
    };
    const result = await validateEmail(component, data, {});
    expect(result).toBe(null);
});

test('Validating an invalid email will return a FieldError', async () => {
    const component = simpleEmailField;
    const data = {
        component: 'salesatform.io',
    };
    const result = await validateEmail(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('must be a valid email');
});
