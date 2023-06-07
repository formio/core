import { expect } from 'chai';
import { FieldError } from '../../../error/FieldError';
import { simpleSelectBoxes, simpleTextField } from './fixtures/components';
import { validateMaximumSelectedCount } from '../validateMaximumSelectedCount';

it('Validting a non-select boxes component will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMaximumSelectedCount(component, data, {});
    expect(result).to.equal(null);;
});

it('Validating a select boxes component without maxSelectedCount will return null', async () => {
    const component = simpleSelectBoxes;
    const data = {
        component: {
            foo: true,
            bar: true,
            baz: false,
            biz: false,
        },
    };
    const result = await validateMaximumSelectedCount(component, data, {});
    expect(result).to.equal(null);;
});

it('Validating a select boxes component where the number of selected fields is greater than maxSelectedCount will return a FieldError', async () => {
    const component = { ...simpleSelectBoxes, validate: { maxSelectedCount: 1 } };
    const data = {
        component: {
            foo: true,
            bar: true,
            baz: false,
            biz: false,
        },
    };
    const result = await validateMaximumSelectedCount(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.message).to.contain('cannot have more than 1 selected fields');
});

it('Validating a select boxes component where the number of selected fields is equal to maxSelectedCount will return null', async () => {
    const component = { ...simpleSelectBoxes, validate: { maxSelectedCount: 1 } };
    const data = {
        component: {
            foo: true,
            bar: false,
            baz: false,
            biz: false,
        },
    };
    const result = await validateMaximumSelectedCount(component, data, {});
    expect(result).to.equal(null);;
});

it('Validating a select boxes component where the number of selected fields is less than maxSelectedCount will return null', async () => {
    const component = { ...simpleSelectBoxes, validate: { maxSelectedCount: 2 } };
    const data = {
        component: {
            foo: true,
            bar: false,
            baz: false,
            biz: false,
        },
    };
    const result = await validateMaximumSelectedCount(component, data, {});
    expect(result).to.equal(null);;
});
