import { FieldError } from '../../../error/FieldError';
import { simpleDayField, simpleTextField } from 'test/fixtures/components';
import { DayComponent } from '../../../types/Component';
import { validateMaximumYear } from '../validateMaximumYear';

test('Validating a component without the maxYear parameter will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMaximumYear(component, data, {});
    expect(result).toBeNull();
});

test('Validating a day component without the maxYear parameter will return null', async () => {
    const component = simpleDayField;
    const data = {
        component: '01/22/2023',
    };
    const result = await validateMaximumYear(component, data, {});
    expect(result).toBeNull();
});

test('Validating a day component with the maxYear parameter will return a FieldError if the year is greater than the maximum', async () => {
    const component: DayComponent = {
        ...simpleDayField,
        fields: {
            ...simpleDayField.fields,
            year: { ...simpleDayField.fields.year, maxYear: '2022' },
        },
        maxYear: '2022',
    };
    const data = {
        component: '01/22/2023',
    };
    const result = await validateMaximumYear(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('should not contain a year greater than');
});

test('Validating a day component with the maxYear parameter will return null if the year is equal to the maximum', async () => {
    const component: DayComponent = {
        ...simpleDayField,
        fields: {
            ...simpleDayField.fields,
            year: { ...simpleDayField.fields.year, maxYear: '2022' },
        },
        maxYear: '2022',
    };
    const data = {
        component: '01/22/2022',
    };
    const result = await validateMaximumYear(component, data, {});
    expect(result).toBeNull();
});

test('Validating a day component with the maxYear parameter will return null if the year is less than the maximum', async () => {
    const component: DayComponent = {
        ...simpleDayField,
        fields: {
            ...simpleDayField.fields,
            year: { ...simpleDayField.fields.year, maxYear: '2022' },
        },
        maxYear: '2022',
    };
    const data = {
        component: '01/22/2021',
    };
    const result = await validateMaximumYear(component, data, {});
    expect(result).toBeNull();
});
