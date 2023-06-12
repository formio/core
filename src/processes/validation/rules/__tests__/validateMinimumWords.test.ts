import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleTextField } from './fixtures/components';
import { validateMinimumWords } from '../validateMinimumWords';

it('Validating a component without the maxWords property will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMinimumWords(component, data, {});
    expect(result).to.equal(null);
});

it('Validating a component with the minWords property will return a FieldError if the number of words is less than the minimum', async () => {
    const component = { ...simpleTextField, validate: { minWords: 3 } };
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMinimumWords(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('minWords');
});

it('Validating a component with the minWords property will return null if the number of words is equal to the minimum', async () => {
    const component = { ...simpleTextField, validate: { minWords: 3 } };
    const data = {
        component: 'Hello, world, again!',
    };
    const result = await validateMinimumWords(component, data, {});
    expect(result).to.equal(null);
});

it('Validating a component with the minWords property will return null if the number of words is greater than the minimum', async () => {
    const component = { ...simpleTextField, validate: { minWords: 3 } };
    const data = {
        component: 'Hello, world, it is I!',
    };
    const result = await validateMinimumWords(component, data, {});
    expect(result).to.equal(null);
});
