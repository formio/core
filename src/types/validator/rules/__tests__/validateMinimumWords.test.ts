import { FieldError } from '../../../error/FieldError';
import { simpleTextField } from 'test/fixtures/components';
import { validateMinimumWords } from '../validateMinimumWords';

test('Validating a component without the maxWords property will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMinimumWords(component, data, {});
    expect(result).toBeNull();
});

test('Validating a component with the minWords property will return a FieldError if the number of words is less than the minimum', async () => {
    const component = { ...simpleTextField, validate: { minWords: 3 } };
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMinimumWords(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('must have at least 3 words');
});

test('Validating a component with the minWords property will return null if the number of words is equal to the minimum', async () => {
    const component = { ...simpleTextField, validate: { minWords: 3 } };
    const data = {
        component: 'Hello, world, again!',
    };
    const result = await validateMinimumWords(component, data, {});
    expect(result).toBeNull();
});

test('Validating a component with the minWords property will return null if the number of words is greater than the minimum', async () => {
    const component = { ...simpleTextField, validate: { minWords: 3 } };
    const data = {
        component: 'Hello, world, it is I!',
    };
    const result = await validateMinimumWords(component, data, {});
    expect(result).toBeNull();
});
