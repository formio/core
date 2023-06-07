import { expect } from 'chai';
import { FieldError } from '../../../error/FieldError';
import { simpleTextField } from './fixtures/components';
import { validateJson } from '../validateJson';

it('A simple component without JSON logic validation will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateJson(component, data, {});
    expect(result).to.equal(null);;
});

it('A simple component with JSON logic evaluation will return a FieldError if the JSON logic returns invalid', async () => {
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
    const result = await validateJson(component, data);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.message).to.contain('fails JSON logic validation');
});

it('A simple component with JSON logic evaluation will return null if the JSON logic returns valid', async () => {
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
    const result = await validateJson(component, data);
    expect(result).to.equal(null);;
});
