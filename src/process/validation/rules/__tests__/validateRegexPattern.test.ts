import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleTextField } from './fixtures/components';
import { generateProcessContext } from './fixtures/util';
import { validateRegexPattern } from '../validateRegexPattern';

it('Validating a component without a pattern parameter will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessContext(component, data);
    const result = await validateRegexPattern(context);
    expect(result).to.equal(null);
});

it('Validating a component with a pattern parameter will return a FieldError if the value does not match the pattern', async () => {
    const component = { ...simpleTextField, validate: { pattern: '\\d*' } };
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessContext(component, data);
    const result = await validateRegexPattern(context);    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('regex');
});

it('Validating a component with a pattern parameter will return null if the value matches the pattern', async () => {
    const component = { ...simpleTextField, validate: { pattern: '\\d*' } };
    const data = {
        component: '12345',
    };
    const context = generateProcessContext(component, data);
    const result = await validateRegexPattern(context);    expect(result).to.equal(null);
});
