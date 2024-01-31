import { expect } from 'chai';

import { FieldError } from 'error';
import { validateRequired } from '../validateRequired';
import { simpleTextField } from './fixtures/components';
import { generateProcessContext } from './fixtures/util';

it('Validating a simple component that is required and not present in the data will return a field error', async () => {
    const component = { ...simpleTextField, validate: { required: true } };
    const data = {};
    const context = generateProcessContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result && result.errorKeyOrMessage).to.equal('required');
});

it('Validating a simple component that is required and present in the data will return null', async () => {
    const component = { ...simpleTextField, validate: { required: true } };
    const data = { component: 'a simple value' };
    const context = generateProcessContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.equal(null);
});

it('Validating a simple component that is required and present in the data with value=0 will return null', async () => {
    const component = { ...simpleTextField, validate: { required: true } };
    const data = { component: 0 };
    const context = generateProcessContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.equal(null);
});

it('Validating a simple component that is required and present in the data with value=false will return null', async () => {
    const component = { ...simpleTextField, validate: { required: true } };
    const data = { component: false };
    const context = generateProcessContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.equal(null);
});

it('Validating a simple component that is not required and present in the data will return null', async () => {
    const component = simpleTextField;
    const data = { component: 'a simple value' };
    const context = generateProcessContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.equal(null);
});

it('Validating a simple component that is not required and not present in the data will return null', async () => {
    const component = simpleTextField;
    const data = {};
    const context = generateProcessContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.equal(null);
});
