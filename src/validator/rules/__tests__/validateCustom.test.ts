import { FieldError } from '../../../error/FieldError';
import { validateCustom } from '../validateCustom';
import { normalEvalValidatorConfig as config } from 'test/fixtures/validatorConfig';
import { TextFieldComponent } from '../../../types/Component';
import { simpleTextField } from 'test/fixtures/components';

test('A simple custom validation will correctly be interpolated', async () => {
    const component: TextFieldComponent = {
        ...simpleTextField,
        validate: {
            custom: 'valid = "Invalid entry"',
        },
    };
    const result = await validateCustom(
        component,
        {
            simpleComponent: 'any thing',
        },
        config
    );
    expect(result).toBeInstanceOf(FieldError);
    expect(result && result.message).toBe('Invalid entry');
});

test('A custom validation that includes data will correctly be interpolated', async () => {
    const component: TextFieldComponent = {
        ...simpleTextField,
        validate: {
            custom: 'valid = data.simpleComponent === "any thing" ? true : "Invalid entry"',
        },
    };
    const result = await validateCustom(
        component,
        {
            simpleComponent: 'any thing',
        },
        config
    );
    expect(result).toBe(null);
});
