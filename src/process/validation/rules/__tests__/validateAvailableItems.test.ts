import { expect } from 'chai';

import { FieldError } from 'error';
import { RadioComponent, SelectBoxesComponent, SelectComponent } from 'types';
import {
  simpleRadioField,
  simpleSelectBoxes,
  simpleTextField,
  simpleSelectOptions,
} from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateAvailableItems, validateAvailableItemsSync } from '../validateAvailableItems';

describe('validateAvailableItems', function () {
  it('Validating a component without the available items validation parameter will return null', async function () {
    const component = simpleTextField;
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
  });

  it('Validating a simple select boxes component without the available items validation parameter will return null', async function () {
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

  it('Validating a simple radio component without the available items validation parameter will return null', async function () {
    const component = simpleRadioField;
    const data = {
      component: 'bar',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
  });

  it('Validating a simple radio component with the available items validation parameter will return null if the item is valid', async function () {
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

  it('Validating a simple static values select component without the available items validation parameter will return null', async function () {
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

  it('Validating a simple static values select component with the available items validation parameter will return null if the selected item is valid', async function () {
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

  it('Validating a simple static values select component with the available items validation parameter will return null if the selected item is valid and dataSrc is not specified', async function () {
    const component: SelectComponent = {
      ...simpleSelectOptions,
      dataSrc: undefined,
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

  it('Validating a simple static values select component with the available items validation parameter set to false will return null', async function () {
    const component: SelectComponent = {
      ...simpleSelectOptions,
      dataSrc: 'values',
      data: {
        values: [
          { label: 'foo', value: 'foo' },
          { label: 'bar', value: 'bar' },
        ],
      },
      validate: { onlyAvailableItems: false },
    };
    const data = {
      component: 'baz',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
  });

  it('Validating a simple URL select component without the available items validation parameter will return null', async function () {
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

  it('Validating a simple URL select component synchronously will return null', async function () {
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

  it('Validating a multiple URL select component synchronously will return null', async function () {
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

  it('Validating a simple JSON select component (string JSON) without the available items validation parameter will return null', async function () {
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

  it('Validating a simple JSON select component (string JSON) with the available items validation parameter will return a FieldError if the item is invalid', async function () {
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

  it('Validating a simple JSON select component (string JSON) with the available items validation parameter will return null if the item is valid', async function () {
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

  it('Validating a simple JSON select component (nested string JSON) with the available items validation parameter will return null if the item is valid', async function () {
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

  it('Validating a simple JSON select component (nested string JSON) with the available items validation parameter will return a FieldError if the item is invalid', async function () {
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

  it('Validating a simple JSON select component (nested string JSON with valueProperty) with the available items validation parameter will return a FieldError if the item is invalid', async function () {
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

  it('Validating a simple JSON select component (nested string JSON with valueProperty) with the available items validation parameter will return null if the item is valid', async function () {
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

  it('Validating a simple JSON select component (actual JSON) without the available items validation parameter will return null', async function () {
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

  it('Validating a simple JSON select component (actual JSON) with the available items validation parameter will return a FieldError if the selected item is invalid', async function () {
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

  it('Validating a simple JSON select component (actual JSON) with the available items validation parameter will return null if the selected item is valid', async function () {
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

  it('Validating a simple JSON select component (nested actual JSON) with the available items validation parameter will return a FieldError if the selected item is invalid', async function () {
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

  it('Validating a simple JSON select component (nested actual JSON) with the available items validation parameter will return null if the selected item is valid', async function () {
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

  it('Validating a simple JSON select component (nested actual JSON with valueProperty) with the available items validation parameter will return a FieldError if the selected item is invalid', async function () {
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

  it('Validating a simple JSON select component (nested actual JSON with valueProperty) with the available items validation parameter will return null if the selected item is valid', async function () {
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

  it('Validating a simple radio component with url data source with the available items validation parameter will return null if the item is valid', async function () {
    const component: RadioComponent = {
      ...simpleRadioField,
      dataSrc: 'url',
      data: {
        url: 'http://localhost:8080/numbers',
        headers: [],
      },
      validate: { onlyAvailableItems: true },
    };
    const data = {
      component: '2',
    };

    const context = generateProcessorContext(component, data);
    context.fetch = () => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
          ]),
      });
    };
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
  });

  it('Validating a simple radio component with url data source with the available items validation parameter will return FieldError if the item is invalid', async function () {
    const component: RadioComponent = {
      ...simpleRadioField,
      dataSrc: 'url',
      data: {
        url: 'http://localhost:8080/numbers',
        headers: [],
      },
      validate: { onlyAvailableItems: true },
    };
    const data = {
      component: '4',
    };

    const context = generateProcessorContext(component, data);
    context.fetch = () => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
          ]),
      });
    };
    const result = await validateAvailableItems(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidOption');
  });

  it('Validating a simple select component with url data source with the available items validation parameter will return null if the item is valid', async function () {
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
      component: { id: 'opt_1', value: 1 },
    };

    const context = generateProcessorContext(component, data);
    context.fetch = () => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 'opt_1', value: 1 },
            { id: 'opt_2', value: 2 },
          ]),
      });
    };
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
  });

  it('Validating a simple select component with url data source with the available items validation parameter will return FieldError if the item is invalid', async function () {
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
      component: { id: 'opt_3', value: 3 },
    };

    const context = generateProcessorContext(component, data);
    context.fetch = () => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 'opt_1', value: 1 },
            { id: 'opt_2', value: 2 },
          ]),
      });
    };
    const result = await validateAvailableItems(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidOption');
  });

  it('Validating a simple static values select boxes component with the available items validation parameter will return null if the selected item is valid', async function () {
    const component: SelectBoxesComponent = {
      ...simpleSelectBoxes,
      validate: { onlyAvailableItems: true },
    };
    const data = {
      component: {
        foo: true,
        bar: false,
        baz: true,
        biz: false,
      },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
  });

  it('Validating a simple static values select boxes component with the available items validation parameter will return FieldError if the selected item is invalid', async function () {
    const component: SelectBoxesComponent = {
      ...simpleSelectBoxes,
      validate: { onlyAvailableItems: true },
    };
    const data = {
      component: {
        foo: true,
        bar: false,
        baz: true,
        biz: false,
        new: true,
        test: false,
      },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateAvailableItems(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidOption');
  });

  it('Validating a select boxes component with url data source with the available items validation parameter will return null if the selected item is valid', async function () {
    const component: SelectBoxesComponent = {
      ...simpleSelectBoxes,
      dataSrc: 'url',
      data: {
        url: 'http://localhost:8080/numbers',
        headers: [],
      },
      validate: { onlyAvailableItems: true },
    };
    const data = {
      component: {
        one: true,
        two: false,
        three: true,
      },
    };
    const context = generateProcessorContext(component, data);

    context.fetch = () => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['one', 'two', 'three']),
      });
    };
    const result = await validateAvailableItems(context);
    expect(result).to.equal(null);
  });

  it('Validating a select boxes component with url data source with the available items validation parameter will return FieldError if the selected item is invalid', async function () {
    const component: SelectBoxesComponent = {
      ...simpleSelectBoxes,
      dataSrc: 'url',
      data: {
        url: 'http://localhost:8080/numbers',
        headers: [],
      },
      validate: { onlyAvailableItems: true },
    };
    const data = {
      component: {
        one: true,
        two: false,
        three: true,
        four: true,
        five: false,
      },
    };
    const context = generateProcessorContext(component, data);

    context.fetch = () => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['one', 'two', 'three']),
      });
    };
    const result = await validateAvailableItems(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidOption');
  });
});
