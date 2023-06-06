import { FieldError } from '../../../error/FieldError';
import { simpleTextField } from 'test/fixtures/components';
import { validateMaximumWords } from '../validateMaximumWords';

test('Validating a component without the maxWords property will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMaximumWords(component, data, {});
    expect(result).toBeNull();
});

test('Validating a component with the maxWords property will return a FieldError if the number of words is greater than the maximum', async () => {
    const component = { ...simpleTextField, validate: { maxWords: 3 } };
    const data = {
        component: "Hello, world, it's me!",
    };
    const result = await validateMaximumWords(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('must have no more than 3 words');
});

test('Validating a component with the maxWords property will return null if the number of words is equal to the maximum', async () => {
    const component = { ...simpleTextField, validate: { maxWords: 3 } };
    const data = {
        component: 'Hello, world, again!',
    };
    const result = await validateMaximumWords(component, data, {});
    expect(result).toBeNull();
});

test('Validating a component with the maxWords property will return null if the number of words is less than the maximum', async () => {
    const component = { ...simpleTextField, validate: { maxWords: 3 } };
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMaximumWords(component, data, {});
    expect(result).toBeNull();
});
