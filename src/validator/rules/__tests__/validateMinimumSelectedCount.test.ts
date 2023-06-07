import { expect } from 'chai';
import { FieldError } from '../../../error/FieldError';
import { simpleSelectBoxes, simpleTextField } from './fixtures/components';
import { validateMinimumSelectedCount } from '../validateMinimumSelectedCount';

it('Validting a non-select boxes component will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMinimumSelectedCount(component, data, {});
    expect(result).to.equal(null);;
});

it('Validating a select boxes component without minSelectedCount will return null', async () => {
    const component = simpleSelectBoxes;
    const data = {
        component: {
            foo: true,
            bar: true,
            baz: false,
            biz: false,
        },
    };
    const result = await validateMinimumSelectedCount(component, data, {});
    expect(result).to.equal(null);;
});

it('Validating a select boxes component where the number of selected fields is less than minSelectedCount will return a FieldError', async () => {
    const component = { ...simpleSelectBoxes, validate: { minSelectedCount: 2 } };
    const data = {
        component: {
            foo: true,
            bar: false,
            baz: false,
            biz: false,
        },
    };
    const result = await validateMinimumSelectedCount(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.message).to.contain('must have at least 2 selected fields');
});

it('Validating a select boxes component where the number of selected fields is equal to minSelectedCount will return null', async () => {
    const component = { ...simpleSelectBoxes, validate: { minSelectedCount: 2 } };
    const data = {
        component: {
            foo: true,
            bar: true,
            baz: false,
            biz: false,
        },
    };
    const result = await validateMinimumSelectedCount(component, data, {});
    expect(result).to.equal(null);;
});

it('Validating a select boxes component where the number of selected fields is greater than minSelectedCount will return null', async () => {
    const component = { ...simpleSelectBoxes, validate: { minSelectedCount: 2 } };
    const data = {
        component: {
            foo: true,
            bar: true,
            baz: true,
            biz: false,
        },
    };
    const result = await validateMinimumSelectedCount(component, data, {});
    expect(result).to.equal(null);;
});
