import { expect } from 'chai';
import { set } from 'lodash';
import { FieldError } from 'error';
import { SelectBoxesComponent } from 'types';
import { simpleRadioField, simpleSelectBoxes } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateValueProperty } from '../validateValueProperty';

describe('validateValueProperty', function () {
  it('Validating a component with support for different types will return null', async function () {
    const component = simpleRadioField;
    const data = {
      component: 'test',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateValueProperty(context);
    expect(result).to.equal(null);
  });

  it('Validating a select boxes component with values data source will return null', async function () {
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
    const result = await validateValueProperty(context);
    expect(result).to.equal(null);
  });

  it('Validating a select boxes component with url data source without options building will return null', async function () {
    const component: SelectBoxesComponent = {
      ...simpleSelectBoxes,
      dataSrc: 'url',
      values: [],
      data: {
        url: 'http://localhost:8080/numbers',
        headers: [],
      },
    };
    const data = { component: { true: true } };

    const context = generateProcessorContext(component, data);
    const result = await validateValueProperty(context);
    expect(result).to.equal(null);
  });

  it('Validating a select boxes component with url data source without options building will return error', async function () {
    const component: SelectBoxesComponent = {
      ...simpleSelectBoxes,
      dataSrc: 'url',
      values: [],
      data: {
        url: 'http://localhost:8080/numbers',
        headers: [],
      },
    };
    const data = { component: { true: true } };

    const context = generateProcessorContext(component, data);
    set(context, 'instance.options.building', true);
    const result = await validateValueProperty(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidValueProperty');
  });
});
