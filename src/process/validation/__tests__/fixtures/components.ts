import {
  DateTimeComponent,
  DayComponent,
  NumberComponent,
  RadioComponent,
  SelectBoxesComponent,
  SelectComponentOptions,
  TextFieldComponent,
} from 'types/Component';

export const simpleTextField: TextFieldComponent = {
  type: 'textField',
  label: 'Simple Text Field',
  input: true,
  tableView: true,
  key: 'component',
};

export const simpleDateTimeField: DateTimeComponent = {
  tableView: false,
  label: 'Simple Date/Time',
  datePicker: {
    disableWeekends: false,
    disableWeekdays: false,
  },
  enableMinDateInput: false,
  enableMaxDateInput: false,
  enableDate: true,
  key: 'component',
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

export const simpleDayField: DayComponent = {
  label: 'Simple Day',
  hideInputLabels: false,
  inputsLabelPosition: 'top',
  useLocaleSettings: false,
  tableView: false,
  fields: {
    day: {
      hide: false,
    },
    month: {
      hide: false,
    },
    year: {
      hide: false,
    },
  },
  key: 'component',
  type: 'day',
  input: true,
  defaultValue: '00/00/0000',
};

export const calendarTextField: TextFieldComponent = {
  label: 'Text Field',
  widget: {
    type: 'calendar',
    altInput: true,
    allowInput: true,
    clickOpens: true,
    // enableDate: true,
    enableTime: true,
    mode: 'single',
    noCalendar: false,
    format: 'yyyy-MM-dd hh:mm a',
    dateFormat: 'yyyy-MM-ddTHH:mm:ssZ',
    useLocaleSettings: false,
    hourIncrement: 1,
    minuteIncrement: 5,
    time_24hr: false,
    saveAs: 'text',
    displayInTimezone: 'viewer',
    locale: 'en',
  },
  tableView: true,
  key: 'component',
  type: 'textfield',
  input: true,
};

export const simpleEmailField = {
  label: 'Email',
  tableView: true,
  key: 'component',
  type: 'email',
  input: true,
};

export const simpleSelectBoxes: SelectBoxesComponent = {
  label: 'Select Boxes',
  optionsLabelPosition: 'right',
  tableView: false,
  values: [
    {
      label: 'foo',
      value: 'foo',
    },
    {
      label: 'bar',
      value: 'bar',
    },
    {
      label: 'baz',
      value: 'baz',
    },
    {
      label: 'biz',
      value: 'biz',
    },
  ],
  validate: {
    maxSelectedCount: 3,
  },
  key: 'component',
  type: 'selectboxes',
  input: true,
  inputType: 'checkbox',
};

export const simpleNumberField: NumberComponent = {
  label: 'Number',
  mask: false,
  tableView: false,
  delimiter: false,
  requireDecimal: false,
  inputFormat: 'plain',
  truncateMultipleSpaces: false,
  key: 'component',
  type: 'number',
  input: true,
};

export const simpleUrlField = {
  label: 'Url',
  tableView: true,
  key: 'component',
  type: 'url',
  input: true,
};

export const simpleSelectOptions: SelectComponentOptions = {
  label: 'Select',
  widget: 'choicesjs',
  tableView: true,
  key: 'component',
  template: '<span>{{ item.label }}</span>',
  type: 'select',
  input: true,
  lazyLoad: false,
  disableLimit: false,
};

export const simpleRadioField: RadioComponent = {
  label: 'Radio',
  optionsLabelPosition: 'right',
  inline: false,
  tableView: false,
  values: [
    {
      label: 'foo',
      value: 'foo',
      shortcut: '',
    },
    {
      label: 'bar',
      value: 'bar',
      shortcut: '',
    },
    {
      label: 'baz',
      value: 'baz',
      shortcut: '',
    },
    {
      label: 'biz',
      value: 'biz',
      shortcut: '',
    },
  ],
  key: 'component',
  type: 'radio',
  input: true,
};
