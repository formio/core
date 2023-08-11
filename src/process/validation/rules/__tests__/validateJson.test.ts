import { expect } from 'chai';

import { FieldError } from 'error/FieldError';
import { simpleTextField } from './fixtures/components';
import { generateProcessContext } from './fixtures/util';
import { validateJson } from '../validateJson';

it('A simple component without JSON logic validation will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessContext(component, data);
    const result = await validateJson(context);
    expect(result).to.equal(null);
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
    const context = generateProcessContext(component, data);
    const result = await validateJson(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('Input must be \'foo\'');
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
    const context = generateProcessContext(component, data);
    const result = await validateJson(context);
    expect(result).to.equal(null);
});
