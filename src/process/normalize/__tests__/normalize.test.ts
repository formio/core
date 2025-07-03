import { expect } from 'chai';

import {
  TimeComponent,
  SelectBoxesComponent,
  ProcessorContext,
  ProcessorScope,
  DayComponent,
  TagsComponent,
  SurveyComponent,
  DateTimeComponent,
} from 'types';
import { normalizeProcessSync, NormalizeScope } from '../';
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

  it('Should remove the tag component from the submission object if data is set to null', async function () {
    const tagsComponent: TagsComponent = {
      input: true,
      delimeter: '',
      maxTags: 1,
      storeas: '',
      type: 'tags',
      key: 'tags',
    };
    const data = {
      tags: null,
    };
    const context: ProcessorContext<NormalizeScope> = generateProcessorContext(tagsComponent, data);
    normalizeProcessSync(context);
    expect(context.scope?.filter?.tags).to.equal(false);
  });

  it('Should remove the survey component from the submission object if data is set falsy values', async function () {
    const surveyComponent: SurveyComponent = {
      label: 'Survey',
      tableView: false,
      questions: [
        {
          label: 'Agree',
          value: 'agree',
          tooltip: '',
        },
      ],
      values: [
        {
          label: 'Yes',
          value: 'yes',
          tooltip: '',
        },
        {
          label: 'No',
          value: 'no',
          tooltip: '',
        },
      ],
      validateWhenHidden: false,
      key: 'survey',
      type: 'survey',
      input: true,
    };
    const context1: ProcessorContext<NormalizeScope> = generateProcessorContext(surveyComponent, {
      survey: null,
    });
    normalizeProcessSync(context1);
    expect(context1.scope?.filter?.survey).to.equal(false);
    const context2: ProcessorContext<NormalizeScope> = generateProcessorContext(surveyComponent, {
      survey: 0,
    });
    normalizeProcessSync(context2);
    expect(context2.scope?.filter?.survey).to.equal(undefined);
    const context3: ProcessorContext<NormalizeScope> = generateProcessorContext(surveyComponent, {
      survey: '',
    });
    normalizeProcessSync(context3);
    expect(context3.scope?.filter?.survey).to.equal(undefined);
  });

  it('Should remove the datetime component from the submission object if data is set to null', async function () {
    const dateTimeComponent: DateTimeComponent = {
      label: 'Date / Time',
      tableView: false,
      datePicker: {
        disableWeekends: false,
        disableWeekdays: false,
      },
      enableMinDateInput: false,
      enableMaxDateInput: false,
      validateWhenHidden: false,
      key: 'dateTime',
      type: 'datetime',
      input: true,
      widget: {
        type: 'calendar',
        displayInTimezone: 'viewer',
        locale: 'en',
        useLocaleSettings: false,
        allowInput: true,
        mode: 'single',
        enableTime: true,
        noCalendar: false,
        format: 'yyyy-MM-dd hh:mm a',
        hourIncrement: 1,
        minuteIncrement: 1,
        time_24hr: false,
        disableWeekends: false,
        disableWeekdays: false,
      },
    };
    const data = {
      dateTime: null,
    };
    const context: ProcessorContext<NormalizeScope> = generateProcessorContext(
      dateTimeComponent,
      data,
    );
    normalizeProcessSync(context);
    expect(context.scope?.filter?.dateTime).to.deep.equal(false);
  });
});
