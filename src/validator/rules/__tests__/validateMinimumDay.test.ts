import { FieldError } from '../../../error/FieldError';
import { simpleDayField, simpleTextField } from 'test/fixtures/components';
import { validateMinimumDay } from '../validateMinimumDay';

test('Validating a non-day component will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMinimumDay(component, data, {});
    expect(result).toBe(null);
});

test('Validating a day component with a day before the minimum day will return a FieldError', async () => {
    const component = { ...simpleDayField, minDate: '2023-04-01' };
    const data = {
        component: '03/23/2023',
    };
    const result = await validateMinimumDay(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('should not contain date before');
});

test('Validating a day component with a day after the minimum day will return null', async () => {
    const component = { ...simpleDayField, minDate: '2023-04-01' };
    const data = {
        component: '04/02/2023',
    };
    const result = await validateMinimumDay(component, data, {});
    expect(result).toBe(null);
});

test('Validating a day-first day component with a day before the minimum day will return a FieldError', async () => {
    const component = { ...simpleDayField, dayFirst: true, minDate: '2023-04-01' };
    const data = {
        component: '02/02/2023',
    };
    const result = await validateMinimumDay(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('should not contain date before');
});

test('Validating a day-first day component with a day after the minimum day will return null', async () => {
    const component = { ...simpleDayField, dayFirst: true, minDate: '2023-04-01' };
    const data = {
        component: '23/04/2023',
    };
    const result = await validateMinimumDay(component, data, {});
    expect(result).toBe(null);
});
