import { expect } from 'chai';
import { FieldError } from 'error';
import { simpleTextField } from './fixtures/components';
import { generateProcessContext } from './fixtures/util';
import { validateMask } from '../validateMask';

it('Validating a mask component should return a FieldError if the value does not match the mask', async () => {
    const component = { ...simpleTextField, inputMask: '999-999-9999' };
    const data = {
        component: '1234',
    };
    const context = generateProcessContext(component, data);
    const result = await validateMask(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('mask');
});

it('Validating a mask component should return null if the value matches the mask', async () => {
    const component = { ...simpleTextField, inputMask: '999-999-9999' };
    const data = {
        component: '123-456-7890',
    };
    const context = generateProcessContext(component, data);
    const result = await validateMask(context);
    expect(result).to.equal(null);
});

it('Validating a multi-mask component should return a FieldError if the value does not match the masks', async () => {
    const component = {
        ...simpleTextField,
        allowMultipleMasks: true,
        inputMasks: [
            {
                label: 'maskOne',
                mask: '999-9999',
            },
            {
                label: 'maskTwo',
                mask: '999-999-9999',
            },
        ],
    };
    let data = {
        component: { maskName: 'maskOne', value: '14567890' },
    };
    let context = generateProcessContext(component, data);
    let result = await validateMask(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('mask');

    data = {
        component: { maskName: 'maskTwo', value: '1234567' },
    };
    context = generateProcessContext(component, data);
    result = await validateMask(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('mask');
});

it('Validating a mutil-mask component should return null if the value matches the masks', async () => {
    const component = {
        ...simpleTextField,
        allowMultipleMasks: true,
        inputMasks: [
            {
                label: 'maskOne',
                mask: '999-9999',
            },
            {
                label: 'maskTwo',
                mask: '999-999-9999',
            },
        ],
    };
    let data = {
        component: { maskName: 'maskOne', value: '456-7890' },
    };
    let context = generateProcessContext(component, data);
    let result = await validateMask(context);
    expect(result).to.equal(null);

    data = {
        component: { maskName: 'maskTwo', value: '123-456-7890' },
    };
    context = generateProcessContext(component, data);
    result = await validateMask(context);
    expect(result).to.equal(null);
});
