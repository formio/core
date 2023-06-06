import { FieldError } from '../../../error/FieldError';
import { simpleTextField } from 'test/fixtures/components';
import { jsonEvalValidatorConfig } from 'test/fixtures/validatorConfig';
import { validateJson } from '../validateJson';

test('A simple component without JSON logic validation will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateJson(component, data, {});
    expect(result).toBeNull();
});

test('A simple component with JSON logic evaluation will return a FieldError if the JSON logic returns invalid', async () => {
    const component = {
        ...simpleTextField,
        validate: {
            json: {
                if: [
                    {
                        '===': [
                            {
                                var: 'input',
                            },
                            'foo',
                        ],
                    },
                    true,
                    "Input must be 'foo'",
                ],
            },
        },
    };
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateJson(component, data, jsonEvalValidatorConfig);
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('fails JSON logic validation');
});

test('A simple component with JSON logic evaluation will return null if the JSON logic returns valid', async () => {
    const component = {
        ...simpleTextField,
        validate: {
            json: {
                if: [
                    {
                        '===': [
                            {
                                var: 'input',
                            },
                            'foo',
                        ],
                    },
                    true,
                    "Input must be 'foo'",
                ],
            },
        },
    };
    const data = {
        component: 'foo',
    };
    const result = await validateJson(component, data, jsonEvalValidatorConfig);
    expect(result).toBeNull();
});
