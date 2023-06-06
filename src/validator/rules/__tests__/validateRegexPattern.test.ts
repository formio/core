import { FieldError } from '../../../error/FieldError';
import { simpleTextField } from 'test/fixtures/components';
import { validateRegexPattern } from '../validateRegexPattern';

test('Validating a component without a pattern parameter will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateRegexPattern(component, data, {});
    expect(result).toBeNull();
});

test('Validating a component with a pattern parameter will return a FieldError if the value does not match the pattern', async () => {
    const component = { ...simpleTextField, validate: { pattern: '\\d*' } };
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateRegexPattern(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('does not match the regular expression pattern');
});

test('Validating a component with a pattern parameter will return null if the value matches the pattern', async () => {
    const component = { ...simpleTextField, validate: { pattern: '\\d*' } };
    const data = {
        component: '12345',
    };
    const result = await validateRegexPattern(component, data, {});
    expect(result).toBeNull();
});
