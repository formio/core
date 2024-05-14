import { expect } from 'chai';

import { FieldError } from 'error';
import { RadioComponent, SelectComponent } from 'types';
import {
    simpleRadioField,
    simpleSelectBoxes,
    simpleTextField,
    simpleSelectOptions,
} from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateAvailableItems, validateAvailableItemsSync } from '../validateAvailableItems';

it('Validating a component without the available items validation parameter will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple select boxes component without the available items validation parameter will return null', async () => {
    const component = simpleSelectBoxes;
    const data = {
        component: {
            foo: false,
            bar: false,
            baz: false,
            biz: false,
        },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple radio component without the available items validation parameter will return null', async () => {
    const component = simpleRadioField;
    const data = {
        component: 'bar',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple radio component with the available items validation parameter will return null if the item is valid', async () => {
    const component: RadioComponent = {
        ...simpleRadioField,
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidOption');
});

it('Validating a simple static values select component without the available items validation parameter will return null', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'values',
        data: {
            values: [
                { label: 'foo', value: 'foo' },
                { label: 'bar', value: 'bar' },
                { label: 'baz', value: 'baz' },
                { label: 'baz', value: 'baz' },
            ],
        },
    };
    const data = {
        component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple static values select component with the available items validation parameter will return null if the selected item is valid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'values',
        data: {
            values: [
                { label: 'foo', value: 'foo' },
                { label: 'bar', value: 'bar' },
                { label: 'baz', value: 'baz' },
                { label: 'baz', value: 'baz' },
            ],
        },
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple URL select component without the available items validation parameter will return null', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'url',
        data: {
            url: 'http://localhost:8080/numbers',
            headers: [],
        },
    };
    const data = {
        component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple URL select component synchronously will return null', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'url',
        data: {
            url: 'http://localhost:8080/numbers',
            headers: [],
        },
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = validateAvailableItemsSync(context);
    expect(result).to.equal(null);
});

it('Validating a multiple URL select component synchronously will return null', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'url',
        data: {
            url: 'http://localhost:8080/numbers',
            headers: [],
        },
        multiple: true,
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: ['foo'],
    };
    const context = generateProcessorContext(component, data);
    const result = validateAvailableItemsSync(context);
    expect(result).to.equal(null);
});

it('Validating a simple JSON select component (string JSON) without the available items validation parameter will return null', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: '["foo", "bar", "baz", "biz"]',
        },
    };
    const data = {
        component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple JSON select component (string JSON) with the available items validation parameter will return a FieldError if the item is invalid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: '["foo", "bar", "baz", "biz"]',
        },
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidOption');
});

it('Validating a simple JSON select component (string JSON) with the available items validation parameter will return null if the item is valid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: '["foo", "bar", "baz", "biz"]',
        },
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple JSON select component (nested string JSON) with the available items validation parameter will return null if the item is valid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: '[{"foo": "foo", "bar": "bar"}, {"baz": "baz", "biz": "biz"}]',
        },
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: { foo: 'foo', bar: 'bar' },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple JSON select component (nested string JSON) with the available items validation parameter will return a FieldError if the item is invalid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: '[{"foo": "foo", "bar": "bar"}, {"baz": "baz", "biz": "biz"}]',
        },
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: { foo: 'bar', bar: 'baz' },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidOption');
});

it('Validating a simple JSON select component (nested string JSON with valueProperty) with the available items validation parameter will return a FieldError if the item is invalid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: '[{"foo": "foo", "bar": "bar"}, {"baz": "baz", "biz": "biz"}]',
        },
        valueProperty: 'foo',
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidOption');
});

it('Validating a simple JSON select component (nested string JSON with valueProperty) with the available items validation parameter will return null if the item is valid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: '[{"foo": "foo", "bar": "bar"}, {"baz": "baz", "biz": "biz"}]',
        },
        valueProperty: 'foo',
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple JSON select component (actual JSON) without the available items validation parameter will return null', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: ['foo', 'bar', 'baz', 'biz'],
        },
    };
    const data = {
        component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple JSON select component (actual JSON) with the available items validation parameter will return a FieldError if the selected item is invalid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: ['foo', 'bar', 'baz', 'biz'],
        },
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidOption');
});

it('Validating a simple JSON select component (actual JSON) with the available items validation parameter will return null if the selected item is valid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: ['foo', 'bar', 'baz', 'biz'],
        },
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple JSON select component (nested actual JSON) with the available items validation parameter will return a FieldError if the selected item is invalid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: [
                { foo: 'foo', bar: 'bar' },
                { baz: 'baz', biz: 'biz' },
            ],
        },
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: { foo: 'baz', bar: 'biz' },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidOption');
});

it('Validating a simple JSON select component (nested actual JSON) with the available items validation parameter will return null if the selected item is valid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: [
                { foo: 'foo', bar: 'bar' },
                { baz: 'baz', biz: 'biz' },
            ],
        },
        validate: { onlyAvailableItems: true },
    };
    const data = {
        component: { foo: 'foo', bar: 'bar' },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});

it('Validating a simple JSON select component (nested actual JSON with valueProperty) with the available items validation parameter will return a FieldError if the selected item is invalid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: [
                { foo: 'foo', bar: 'bar' },
                { foo: 'baz', bar: 'biz' },
            ],
        },
        validate: { onlyAvailableItems: true },
        valueProperty: 'foo',
    };
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidOption');
});

it('Validating a simple JSON select component (nested actual JSON with valueProperty) with the available items validation parameter will return null if the selected item is valid', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'json',
        data: {
            json: [
                { foo: 'foo', bar: 'bar' },
                { foo: 'baz', bar: 'biz' },
            ],
        },
        validate: { onlyAvailableItems: true },
        valueProperty: 'foo',
    };
    const data = {
        component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
});
