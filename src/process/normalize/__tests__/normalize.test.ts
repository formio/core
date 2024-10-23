import { expect } from 'chai';

import {
  TimeComponent,
  SelectBoxesComponent,
  ProcessorContext,
  ProcessorScope,
  DayComponent,
} from 'types';
import { normalizeProcessSync } from '../';
import { generateProcessorContext } from '../../__tests__/fixtures/util';

describe('Normalize processor', function () {
  it('Should normalize a time component with a valid time value that doees not match dataFormat', async function () {
    const timeComp: TimeComponent = {
      type: 'time',
      key: 'time',
      label: 'Time',
      input: true,
      dataFormat: 'HH:mm:ss',
    };
    const data = { time: '12:00' };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(timeComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ time: '12:00:00' });
  });

  it('Should normalize a select boxes component with an incorrect data model', function () {
    const selectBoxesComp: SelectBoxesComponent = {
      type: 'selectboxes',
      key: 'selectBoxes',
      label: 'Select Boxes',
      input: true,
      values: [
        { label: 'One', value: 'one' },
        { label: 'Two', value: 'two' },
        { label: 'Three', value: 'three' },
      ],
    };
    const data = {
      selectBoxes: '',
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(
      selectBoxesComp,
      data,
    );
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ selectBoxes: {} });
  });

  it('Should normalize an email component value', function () {
    const emailComp = {
      type: 'email',
      key: 'email',
      input: true,
      label: 'Email',
    };
    const data = {
      email: 'BrendanBond@Gmail.com',
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(emailComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ email: 'brendanbond@gmail.com' });
  });

  it('Should normalize a radio component with a string value', function () {
    const radioComp = {
      type: 'radio',
      key: 'radio',
      input: true,
      label: 'Radio',
      values: [
        {
          label: 'Yes',
          value: 'true',
        },
        {
          label: 'No',
          value: 'false',
        },
      ],
    };
    const data = {
      radio: 'true',
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(radioComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ radio: true });
  });

  it('Should normalize a radio component with a string value of false', function () {
    const radioComp = {
      type: 'radio',
      key: 'radio',
      input: true,
      label: 'Radio',
      values: [
        {
          label: 'Yes',
          value: 'true',
        },
        {
          label: 'No',
          value: 'false',
        },
      ],
    };
    const data = {
      radio: 'false',
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(radioComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ radio: false });
  });

  it('Should normalize a radio component value with a number', function () {
    const radioComp = {
      type: 'radio',
      key: 'radio',
      input: true,
      label: 'Radio',
      values: [
        {
          label: 'Yes',
          value: '1',
        },
        {
          label: 'No',
          value: '0',
        },
      ],
    };
    const data = {
      radio: '0',
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(radioComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ radio: 0 });
  });

  it('Should normalize a radio component value with a string if storage type is set to string', function () {
    const radioComp = {
      type: 'radio',
      key: 'radio',
      input: true,
      label: 'Radio',
      dataType: 'string',
      values: [
        {
          label: '1',
          value: 1,
        },
        {
          label: '0',
          value: 0,
        },
      ],
    };
    const data = {
      radio: 0,
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(radioComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ radio: '0' });
  });

  it('Should normalize a radio component value with a number if storage type is set to number', function () {
    const radioComp = {
      type: 'radio',
      key: 'radio',
      input: true,
      label: 'Radio',
      dataType: 'number',
      values: [
        {
          label: '1',
          value: 1,
        },
        {
          label: '0',
          value: 2,
        },
      ],
    };
    const data = {
      radio: 1,
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(radioComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ radio: 1 });
  });

  it('Should normalize a radio component value with a boolean if storage type is set to boolean', function () {
    const radioComp = {
      type: 'radio',
      key: 'radio',
      input: true,
      label: 'Radio',
      dataType: 'boolean',
      values: [
        {
          label: '1',
          value: 'true',
        },
        {
          label: '0',
          value: 'false',
        },
      ],
    };
    const data = {
      radio: true,
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(radioComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ radio: true });
  });

  it('Should normalize a radio component value with a false boolean if storage type is set to boolean and has value of "false"', function () {
    const radioComp = {
      type: 'radio',
      key: 'radio',
      input: true,
      label: 'Radio',
      dataType: 'boolean',
      values: [
        {
          label: '1',
          value: 'true',
        },
        {
          label: '0',
          value: 'false',
        },
      ],
    };
    const data = {
      radio: 'false',
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(radioComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ radio: false });
  });

  it('Should normalize a radio component value with an object  if storage type is set to string and value is an object', function () {
    const radioComp = {
      type: 'radio',
      key: 'radio',
      input: true,
      label: 'Radio',
      dataType: 'string',
      values: [
        {
          label: '1',
          value: 'true',
        },
        {
          label: '0',
          value: 'false',
        },
      ],
    };
    const data = {
      radio: { test: 'test' },
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(radioComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({
      radio: JSON.stringify({ test: 'test' }),
    });
  });

  it('Should normalize a number component value with a string value', function () {
    const numberComp = {
      type: 'number',
      key: 'number',
      input: true,
      label: 'Number',
    };
    const data = {
      number: '000123',
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(numberComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ number: 123 });
  });

  it('Should normalize a number component value with a multiple values allowed', function () {
    const numberComp = {
      type: 'number',
      key: 'number',
      input: true,
      label: 'Number',
      multiple: true,
    };
    const data = {
      number: ['000.0123', '123'],
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(numberComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ number: [0.0123, 123] });
  });

  it('Should normalize a day component with disabled components ', async function () {
    const dayComp: DayComponent = {
      type: 'day',
      key: 'day',
      label: 'Day',
      input: true,
      defaultValue: '',
      fields: {
        day: { hide: true },
        month: { hide: false },
        year: { hide: false },
      },
    };
    const data = { day: '01/2025' };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(dayComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({ day: '01/2025' });
  });

  it('Should normalize a day component with disabled components and defaultValue', async function () {
    const dayComp: DayComponent = {
      type: 'day',
      key: 'day',
      label: 'Day',
      input: true,
      defaultValue: '01/2025',
      fields: {
        day: { hide: true },
        month: { hide: false },
        year: { hide: false },
      },
    };
    const data = { day: '01/2025' };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(dayComp, data);
    normalizeProcessSync(context);
    expect({ day: '01/2025' }).to.deep.equal({ day: '01/2025' });
  });
});
