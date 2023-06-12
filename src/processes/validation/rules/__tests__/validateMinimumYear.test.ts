import { expect } from 'chai';

import { DayComponent } from 'types';
import { FieldError } from 'error';
import { simpleDayField, simpleTextField } from './fixtures/components';
import { validateMinimumYear } from '../validateMinimumYear';

it('Validating a component without the minYear parameter will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMinimumYear(component, data, {});
    expect(result).to.equal(null);
});

it('Validating a day component without the minYear parameter will return null', async () => {
    const component = simpleDayField;
    const data = {
        component: '01/22/2023',
    };
    const result = await validateMinimumYear(component, data, {});
    expect(result).to.equal(null);
});

it('Validating a day component with the minYear parameter will return a FieldError if the year is less than the minimum', async () => {
    const component: DayComponent = {
        ...simpleDayField,
        fields: {
            ...simpleDayField.fields,
            year: { ...simpleDayField.fields.year, minYear: '2023'},
        },
        minYear: '2023',
    };
    const data = {
        component: '01/22/2022',
    };
    const result = await validateMinimumYear(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('minYear');
});

it('Validating a day component with the minYear parameter will return null if the year is equal to the minimum', async () => {
    const component: DayComponent = {
        ...simpleDayField,
        fields: {
            ...simpleDayField.fields,
            year: { ...simpleDayField.fields.year, minYear: '2022' },
        },
        minYear: '2022',
    };
    const data = {
        component: '01/22/2022',
    };
    const result = await validateMinimumYear(component, data, {});
    expect(result).to.equal(null);
});

it('Validating a day component with the minYear parameter will return null if the year is greater than the minimum', async () => {
    const component: DayComponent = {
        ...simpleDayField,
        fields: {
            ...simpleDayField.fields,
            year: { ...simpleDayField.fields.year, minYear: '2022' },
        },
        minYear: '2022',
    };
    const data = {
        component: '01/22/2023',
    };
    const result = await validateMinimumYear(component, data, {});
    expect(result).to.equal(null);
});
