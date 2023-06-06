import { FieldError } from '../../../error/FieldError';
import { simpleTextField } from 'test/fixtures/components';
import { validateMask } from '../validateMask';

test('Validating a mask component should return a FieldError if the value does not match the mask', async () => {
    const component = { ...simpleTextField, inputMask: '999-999-9999' };
    const data = {
        component: '1234',
    };
    const result = await validateMask(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('does not match the mask');
});

test('Validating a mask component should return null if the value matches the mask', async () => {
    const component = { ...simpleTextField, inputMask: '999-999-9999' };
    const data = {
        component: '123-456-7890',
    };
    const result = await validateMask(component, data, {});
    expect(result).toBe(null);
});

test('Validating a multi-mask component should return a FieldError if the value does not match the masks', async () => {
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
    let result = await validateMask(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('does not match the mask');

    data = {
        component: { maskName: 'maskTwo', value: '1234567' },
    };
    result = await validateMask(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('does not match the mask');
});

test('Validating a mutil-mask component should return null if the value matches the masks', async () => {
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
    let result = await validateMask(component, data, {});
    expect(result).toBe(null);

    data = {
        component: { maskName: 'maskTwo', value: '123-456-7890' },
    };
    result = await validateMask(component, data, {});
    expect(result).toBe(null);
});
