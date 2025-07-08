import { get } from 'lodash';
import { expect } from 'chai';
import { validateProcess } from '../index';
import { rules } from '../rules';
import { simpleForm } from './fixtures/forms';
import { ProcessorType, ValidationScope } from 'types';

describe('Validator', function () {
  it('Validator will throw the correct errors given a flat components array', async function () {
    let errors: string[] = [];
    const data = {
      requiredField: '',
      maximumWords:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      minimumWords: 'Hello',
      email: 'brendanb',
      url: 'htpigoogle',
      inputMask: 'hello, world',
      time: ['12:00:00', '11:00'], // one of the values is provided in incorrect format (format instead dataFormat)
      submit: false,
    };
    for (const component of simpleForm.components) {
      const path = component.key;
      const scope: ValidationScope = { errors: [] };
      await validateProcess({
        component,
        scope,
        data,
        row: data,
        path,
        value: get(data, component.key),
        processor: ProcessorType.Validate,
        rules,
      });
      if (scope.errors) {
        errors = [...errors, ...scope.errors.map((error) => error.errorKeyOrMessage)];
      }
    }
    expect(errors).to.have.length(7);
  });

  it('Validator should show 2 errors for invalid datetime value', async function () {
    const data = {
      dateTime: [],
      submit: false,
    };
    const component = {
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
        minDate: null,
        disableWeekends: false,
        disableWeekdays: false,
        maxDate: null,
      },
    };

    const path = component.key;
    const scope: ValidationScope = { errors: [] };
    await validateProcess({
      component,
      scope,
      data,
      row: data,
      path,
      value: get(data, component.key),
      processor: ProcessorType.Validate,
      rules,
    });

    expect(scope.errors).to.have.length(2);
    expect(scope.errors[0].errorKeyOrMessage).to.equal('invalidDate');
    expect(scope.errors[1].errorKeyOrMessage).to.equal('nonarray');
  });

   it('Validator should show error for survey if array is submitted', async function () {
    const data = {
      survey: [],
      submit: true,
    };
    const component = {
      label: 'Survey',
      tableView: false,
      questions: [
        {
          label: 'q 1',
          value: 'q1',
          tooltip: '',
        },
        {
          label: 'q 2',
          value: 'q2',
          tooltip: '',
        },
      ],
      values: [
        {
          label: 'ans 1',
          value: 'ans1',
          tooltip: '',
        },
        {
          label: 'ans 2',
          value: 'ans2',
          tooltip: '',
        },
      ],
      validateWhenHidden: false,
      key: 'survey',
      type: 'survey',
      input: true,
    };

    const path = component.key;
    const scope: ValidationScope = { errors: [] };
    await validateProcess({
      component,
      scope,
      data,
      row: data,
      path,
      value: get(data, component.key),
      processor: ProcessorType.Validate,
      rules,
    });

    expect(scope.errors).to.have.length(1);
    expect(scope.errors[0].errorKeyOrMessage).to.equal('nonarray');
  });
});
