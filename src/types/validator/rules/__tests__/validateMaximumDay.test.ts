import { FieldError } from '../../../error/FieldError';
import { simpleDayField, simpleTextField } from 'test/fixtures/components';
import { validateMaximumDay } from '../validateMaximumDay';

test('Validating a non-day component will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMaximumDay(component, data, {});
    expect(result).toBe(null);
});

test('Validating a day component with a day after the maximum day will return a FieldError', async () => {
    const component = { ...simpleDayField, maxDate: '2023-04-01' };
    const data = {
        component: '04/02/2023',
    };
    const result = await validateMaximumDay(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('should not contain date after');
});

test('Validating a day component with a day before the maximum day will return null', async () => {
    const component = { ...simpleDayField, maxDate: '2023-04-01' };
    const data = {
        component: '03/23/2023',
    };
    const result = await validateMaximumDay(component, data, {});
    expect(result).toBe(null);
});

test('Validating a day component with a day after the maximum day will return a FieldError', async () => {
    const component = { ...simpleDayField, maxDate: '2023-04-01' };
    const data = {
        component: '04/02/2023',
    };
    const result = await validateMaximumDay(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('should not contain date after');
});

test('Validating a day-first day component with a day after the maximum day will return a FieldError', async () => {
    const component = { ...simpleDayField, dayFirst: true, maxDate: '2023-04-01' };
    const data = {
        component: '02/04/2023',
    };
    const result = await validateMaximumDay(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('should not contain date after');
});

test('Validating a day-first day component with a day before the maximum day will return null', async () => {
    const component = { ...simpleDayField, dayFirst: true, maxDate: '2023-04-01' };
    const data = {
        component: '23/03/2023',
    };
    const result = await validateMaximumDay(component, data, {});
    expect(result).toBe(null);
});
