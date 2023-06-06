import { FieldError } from '../../../error/FieldError';
import { validateRequired } from '../validateRequired';
import { normalEvalValidatorConfig } from 'test/fixtures/validatorConfig';
import { simpleTextField } from 'test/fixtures/components';

test('Validating a simple component that is required and not present in the data will return a field error', async () => {
    const component = { ...simpleTextField, validate: { required: true } };
    const result = await validateRequired(component, {}, normalEvalValidatorConfig);
    expect(result).toBeInstanceOf(FieldError);
    expect(result && result.message).toContain('is required');
});

test('Validating a simple component that is required and present in the data will return null', async () => {
    const component = { ...simpleTextField, validate: { required: true } };
    const result = await validateRequired(
        component,
        { component: 'a simple value' },
        normalEvalValidatorConfig
    );
    expect(result).toBeNull();
});

test('Validating a simple component that is not required and present in the data will return null', async () => {
    const component = simpleTextField;
    const result = await validateRequired(
        component,
        { simpleComponent: 'a simple value' },
        normalEvalValidatorConfig
    );
    expect(result).toBe(null);
});

test('Validating a simple component that is not required and not present in the data will return null', async () => {
    const component = simpleTextField;
    const result = await validateRequired(component, {}, normalEvalValidatorConfig);
    expect(result).toBe(null);
});
