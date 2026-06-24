import { get, set, isString, toString, isNil, isObject, isNull } from 'lodash';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  AddressComponent,
  DayComponent,
  EmailComponent,
  ProcessorFnSync,
  ProcessorFn,
  RadioComponent,
  SelectComponent,
  SelectBoxesComponent,
  TagsComponent,
  TextFieldComponent,
  DefaultValueScope,
  ProcessorInfo,
  ProcessorContext,
  TimeComponent,
  NumberComponent,
} from 'types';

export type NormalizeScope = DefaultValueScope & {
  normalize?: {
    [path: string]: any;
  };
};

dayjs.extend(customParseFormat);

const isAddressComponent = (component: any): component is AddressComponent =>
  component.type === 'address';
const isDayComponent = (component: any): component is DayComponent => component.type === 'day';
const isEmailComponent = (component: any): component is EmailComponent =>
  component.type === 'email';
const isRadioComponent = (component: any): component is RadioComponent =>
  component.type === 'radio';
const isSelectComponent = (component: any): component is SelectComponent =>
  component.type === 'select';
const isSelectBoxesComponent = (component: any): component is SelectBoxesComponent =>
  component.type === 'selectboxes';
const isTagsComponent = (component: any): component is TagsComponent => component.type === 'tags';
const isTextFieldComponent = (component: any): component is TextFieldComponent =>
  component.type === 'textfield';
const isTimeComponent = (component: any): component is TimeComponent => component.type === 'time';
const isNumberComponent = (component: any): component is NumberComponent =>
  component.type === 'number';

const normalizeAddressComponentValue = (component: AddressComponent, value: any) => {
  if (!component.multiple && Boolean(component.enableManualMode) && value && !value.mode) {
    return {
      mode: 'autocomplete',
      address: value,
    };
  }
  return value;
};

const getLocaleDateFormatInfo = (locale: string = 'en') => {
  const formatInfo: { dayFirst?: boolean } = {};

  const day = 21;
  const exampleDate = new Date(2017, 11, day);
  const localDateString = exampleDate.toLocaleDateString(locale);

  formatInfo.dayFirst = localDateString.slice(0, 2) === day.toString();

  return formatInfo;
};

const getLocaleDayFirst = (component: DayComponent, form: any) => {
  if (component.useLocaleSettings) {
    return getLocaleDateFormatInfo(form.options?.language).dayFirst;
  }
  return component.dayFirst;
};

const normalizeDayComponentValue = (component: DayComponent, form: any, value: any) => {
  // TODO: this is a quick and dirty port of the Day component's normalizeValue method, may need some updates
  const valueMask = /^\d{2}\/\d{2}\/\d{4}$/;

  const isDayFirst = getLocaleDayFirst(component, form);
  const showDay = !get(component, 'fields.day.hide', false);
  const showMonth = !get(component, 'fields.month.hide', false);
  const showYear = !get(component, 'fields.year.hide', false);

  if (!value || valueMask.test(value)) {
    return value;
  }
  const dateParts: string[] = [];
  const valueParts = value.split('/');
  const [DAY, MONTH, YEAR] = component.dayFirst ? [0, 1, 2] : [1, 0, 2];
  const defaultValue = component.defaultValue ? component.defaultValue.split('/') : '';

  let defaultDay = '';
  let defaultMonth = '';
  let defaultYear = '';

  const getDayWithHiddenFields = (parts: Array<string>) => {
    let DAY, MONTH, YEAR;
    [DAY, MONTH, YEAR] = component.dayFirst ? [0, 1, 2] : [1, 0, 2];
    if (!showDay) {
      MONTH = MONTH === 0 ? 0 : MONTH - 1;
      YEAR = YEAR - 1;
      DAY = null;
    }
    if (!showMonth) {
      if (!isNull(DAY)) {
        DAY = DAY === 0 ? 0 : DAY - 1;
      }
      YEAR = YEAR - 1;
      MONTH = null;
    }
    if (!showYear) {
      YEAR = null;
    }

    return {
      month: isNull(MONTH) ? '' : parts[MONTH],
      day: isNull(DAY) ? '' : parts[DAY],
      year: isNull(YEAR) ? '' : parts[YEAR],
    };
  };

  const getNextPart = (shouldTake: boolean, defaultValue: string) => {
    // Only push the part if it's not an empty string
    const part: string = shouldTake ? valueParts.shift() : defaultValue;
    if (part !== '') {
      dateParts.push(part);
    }
  };

  if (defaultValue) {
    const hasHiddenFields = defaultValue.length !== 3;
    defaultDay = hasHiddenFields ? getDayWithHiddenFields(defaultValue).day : defaultValue[DAY];
    defaultMonth = hasHiddenFields
      ? getDayWithHiddenFields(defaultValue).month
      : defaultValue[MONTH];
    defaultYear = hasHiddenFields ? getDayWithHiddenFields(defaultValue).year : defaultValue[YEAR];
  }

  if (isDayFirst) {
    getNextPart(showDay, defaultDay);
  }

  getNextPart(showMonth, defaultMonth);

  if (!isDayFirst) {
    getNextPart(showDay, defaultDay);
  }

  getNextPart(showYear, defaultYear);

  return dateParts.join('/');
};

const normalizeRadioComponentValue = (value: any, dataType?: string) => {
  switch (dataType) {
    case 'number':
      return +value;
    case 'string':
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    case 'boolean':
      return !(!value || value.toString() === 'false');
  }
  const isEquivalent = toString(value) === Number(value).toString();
  if (!isNaN(parseFloat(value)) && isFinite(value) && isEquivalent) {
    return +value;
  }

  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }

  return value;
};

const normalizeSingleSelectComponentValue = (component: SelectComponent, value: any) => {
  if (isNil(value)) {
    return;
  }
  const valueIsObject = isObject(value);
  //check if value equals to default emptyValue
  if (valueIsObject && Object.keys(value).length === 0) {
    return value;
  }

  const dataType = component.dataType || 'auto';
  const normalize = {
    value,
    number() {
      const numberValue = Number(this.value);
      const isEquivalent = value.toString() === numberValue.toString();

      if (
        !Number.isNaN(numberValue) &&
        Number.isFinite(numberValue) &&
        value !== '' &&
        isEquivalent
      ) {
        this.value = numberValue;
      }

      return this;
    },

    boolean() {
      if (
        isString(this.value) &&
        (this.value.toLowerCase() === 'true' || this.value.toLowerCase() === 'false')
      ) {
        this.value = this.value.toLowerCase() === 'true';
      }
      return this;
    },

    string() {
      this.value = String(this.value);
      return this;
    },

    object() {
      return this;
    },

    auto() {
      if (isObject(this.value)) {
        this.value = this.object().value;
      } else {
        this.value = this.string().number().boolean().value;
      }
      return this;
    },
  };

  try {
    return normalize[dataType]().value;
  } catch (err) {
    console.warn('Failed to normalize value', err);
    return value;
  }
};

const normalizeSelectComponentValue = (component: SelectComponent, value: any) => {
  if (component.multiple && Array.isArray(value)) {
    return value.map((singleValue) => normalizeSingleSelectComponentValue(component, singleValue));
  }

  return normalizeSingleSelectComponentValue(component, value);
};

const normalizeSelectBoxesComponentValue = (value: any) => {
  if (!value) {
    value = {};
  }
  if (typeof value !== 'object') {
    if (typeof value === 'string') {
      return {
        [value]: true,
      };
    } else {
      return {};
    }
  }
  if (Array.isArray(value)) {
    return value.reduce((acc, curr) => {
      return { ...acc, [curr]: true };
    }, {});
  }

  return value;
};

const normalizeTagsComponentValue = (component: TagsComponent, value: any) => {
  const delimiter = component.delimeter || ',';
  if (
    (!component.hasOwnProperty('storeas') || component.storeas === 'string') &&
    Array.isArray(value)
  ) {
    return value.join(delimiter);
  } else if (component.storeas === 'array' && typeof value === 'string') {
    return value.split(delimiter).filter((result) => result);
  }
  return value;
};

const normalizeMaskValue = (
  component: TextFieldComponent,
  defaultValues: DefaultValueScope['defaultValues'],
  value: any,
  path: string,
) => {
  if (component.inputMasks && component.inputMasks.length > 0) {
    if (!value || typeof value !== 'object') {
      return {
        value: value,
        maskName: component.inputMasks[0].label,
      };
    }
    if (!value.value) {
      const defaultValue = defaultValues?.find((defaultValue) => defaultValue.path === path);
      value.value =
        Array.isArray(defaultValue) && defaultValue.length > 0 ? defaultValue[0] : defaultValue;
    }
  }
  return value;
};

const normalizeTextFieldComponentValue = (
  component: TextFieldComponent,
  defaultValues: DefaultValueScope['defaultValues'],
  value: any,
  path: string,
) => {
  // If the component has truncate multiple spaces enabled, then normalize the value to remove extra spaces.
  if (component.truncateMultipleSpaces && typeof value === 'string') {
    value = value.trim().replace(/\s{2,}/g, ' ');
  }
  if (component.allowMultipleMasks && component.inputMasks && component.inputMasks.length > 0) {
    if (Array.isArray(value)) {
      return value.map((val) => normalizeMaskValue(component, defaultValues, val, path));
    } else {
      return normalizeMaskValue(component, defaultValues, value, path);
    }
  }
  return value;
};

// Allow submissions of time components in their visual "format" property by coercing them to the "dataFormat" property
// i.e. "HH:mm" -> "HH:mm:ss"
const normalizeTimeComponentValue = (component: TimeComponent, value: string) => {
  const defaultDataFormat = 'HH:mm:ss';
  const defaultFormat = 'HH:mm';
  if (dayjs(value, component.format || defaultFormat, true).isValid()) {
    return dayjs(value, component.format || defaultFormat, true).format(
      component.dataFormat || defaultDataFormat,
    );
  }
  return value;
};

const normalizeSingleNumberComponentValue = (component: NumberComponent, value: any) => {
  if (!isNaN(parseFloat(value)) && isFinite(value)) {
    return +value;
  }

  return value;
};

const normalizeNumberComponentValue = (component: NumberComponent, value: any) => {
  if (component.multiple && Array.isArray(value)) {
    return value.map((singleValue) => normalizeSingleNumberComponentValue(component, singleValue));
  }

  return normalizeSingleNumberComponentValue(component, value);
};

export const normalizeProcess: ProcessorFn<NormalizeScope> = async (context) => {
  return normalizeProcessSync(context);
};

export const normalizeProcessSync: ProcessorFnSync<NormalizeScope> = (context) => {
  const { component, form, scope, path, data, value } = context;
  if (!scope.normalize) {
    scope.normalize = {};
  }
  const { defaultValues } = scope;
  scope.normalize[path] = {
    type: component.type,
    normalized: false,
  };
  let newValue = value;
  if (isAddressComponent(component)) {
    newValue = normalizeAddressComponentValue(component, value);
  } else if (isDayComponent(component)) {
    newValue = normalizeDayComponentValue(component, form, value);
  } else if (isEmailComponent(component)) {
    newValue = value && isString(value) ? value.trim().toLowerCase() : value;
  } else if (isRadioComponent(component)) {
    newValue = normalizeRadioComponentValue(value, component.dataType);
  } else if (isSelectComponent(component)) {
    newValue = normalizeSelectComponentValue(component, value);
  } else if (isSelectBoxesComponent(component)) {
    newValue = normalizeSelectBoxesComponentValue(value);
  } else if (isTagsComponent(component)) {
    newValue = normalizeTagsComponentValue(component, value);
  } else if (isTextFieldComponent(component)) {
    newValue = normalizeTextFieldComponentValue(component, defaultValues, value, path);
  } else if (isTimeComponent(component)) {
    newValue = normalizeTimeComponentValue(component, value);
  } else if (isNumberComponent(component)) {
    newValue = normalizeNumberComponentValue(component, value);
  }

  if (component.multiple && !component.validate?.required && !Array.isArray(value)) {
    newValue = value ? [value] : [];
  }

  if (newValue === undefined || newValue === null) {
    scope.filter = scope.filter || {};
    scope.filter[path] = false;
  } else if (value !== newValue && !(scope as any).clearHidden?.hasOwnProperty(path)) {
    set(data, path, newValue);
    scope.normalize[path].normalized = true;
    scope.filter = scope.filter || {};
    scope.filter[path] = true;
  }
};

export const normalizeProcessInfo: ProcessorInfo<ProcessorContext<NormalizeScope>, void> = {
  name: 'normalize',
  shouldProcess: () => true,
  process: normalizeProcess,
  processSync: normalizeProcessSync,
};
