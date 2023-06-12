import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleDayField, simpleTextField } from './fixtures/components';
import { validateMaximumDay } from '../validateMaximumDay';

it('Validating a non-day component will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMaximumDay(component, data, {});
    expect(result).to.equal(null);
});

it('Validating a day component with a day after the maximum day will return a FieldError', async () => {
    const component = { ...simpleDayField, maxDate: '2023-04-01' };
    const data = {
        component: '04/02/2023',
    };
    const result = await validateMaximumDay(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('maxDay');
});

it('Validating a day component with a day before the maximum day will return null', async () => {
    const component = { ...simpleDayField, maxDate: '2023-04-01' };
    const data = {
        component: '03/23/2023',
    };
    const result = await validateMaximumDay(component, data, {});
    expect(result).to.equal(null);
});

it('Validating a day component with a day after the maximum day will return a FieldError', async () => {
    const component = { ...simpleDayField, maxDate: '2023-04-01' };
    const data = {
        component: '04/02/2023',
    };
    const result = await validateMaximumDay(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('maxDay');
});

it('Validating a day-first day component with a day after the maximum day will return a FieldError', async () => {
    const component = { ...simpleDayField, dayFirst: true, maxDate: '2023-04-01' };
    const data = {
        component: '02/04/2023',
    };
    const result = await validateMaximumDay(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('maxDay');
});

it('Validating a day-first day component with a day before the maximum day will return null', async () => {
    const component = { ...simpleDayField, dayFirst: true, maxDate: '2023-04-01' };
    const data = {
        component: '23/03/2023',
    };
    const result = await validateMaximumDay(component, data, {});
    expect(result).to.equal(null);
});
