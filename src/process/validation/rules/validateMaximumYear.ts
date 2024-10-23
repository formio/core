import { ProcessorError, FieldError } from 'error';
import { DayComponent } from 'types/Component';
import { RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableDayComponent = (component: any): component is DayComponent => {
  return (
    component &&
    component.type === 'day' &&
    (component.hasOwnProperty('maxYear') || component.fields?.year?.hasOwnProperty('maxYear'))
  );
};

export const shouldValidate = (context: ValidationContext) => {
  const { component } = context;
  if (!isValidatableDayComponent(component)) {
    return false;
  }
  if (!(component as DayComponent).maxYear && !(component as DayComponent).fields.year.maxYear) {
    return false;
  }
  return true;
};

export const validateMaximumYear: RuleFn = async (context: ValidationContext) => {
  return validateMaximumYearSync(context);
};

export const validateMaximumYearSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new ProcessorError(
      `Cannot validate maximum year for value ${value}`,
      context,
      'validate:validateMaximumYear',
    );
  }
  const testValue = typeof value === 'string' ? value : String(value);
  const testArr = /\d{4}$/.exec(testValue);
  const year = testArr ? testArr[0] : null;
  if (
    (component as DayComponent).maxYear &&
    (component as DayComponent).fields?.year?.maxYear &&
    (component as DayComponent).maxYear !== (component as DayComponent).fields.year.maxYear
  ) {
    throw new ProcessorError(
      'Cannot validate maximum year, component.maxYear and component.fields.year.maxYear are not equal',
      context,
      'validate:validateMaximumYear',
    );
  }
  const maxYear =
    (component as DayComponent).maxYear || (component as DayComponent).fields.year.maxYear;
  if (!maxYear || !year) {
    return null;
  }

  return +year <= +maxYear
    ? null
    : new FieldError('maxYear', { ...context, maxYear: String(maxYear), setting: String(maxYear) });
};

export const validateMaximumYearInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateMaximumYear',
  process: validateMaximumYear,
  processSync: validateMaximumYearSync,
  shouldProcess: shouldValidate,
};
