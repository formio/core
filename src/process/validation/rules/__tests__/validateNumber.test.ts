import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleNumberField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateNumber } from '../validateNumber';

it('Validating a valid number will return null', async () => {
    const component = simpleNumberField;
    const data = {
        component: 45,
    };
    const context = generateProcessorContext(component, data);
    const result = await validateNumber(context);
    expect(result).to.equal(null);
});

it('Validating an invalid number will return a FieldError', async () => {
    const component = simpleNumberField;
    const data = {
        component: 'text',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateNumber(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('number');
});
