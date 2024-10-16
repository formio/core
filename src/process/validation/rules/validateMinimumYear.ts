import { FieldError, ProcessorError } from 'error';
import { DayComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableDayComponent = (component: any): component is DayComponent => {
  return (
    component &&
    component?.type === 'day' &&
    (component.hasOwnProperty('minYear') || component.year?.hasOwnProperty('minYear'))
  );
};

export const shouldValidate = (context: ValidationContext) => {
  const { component } = context;
  if (!isValidatableDayComponent(component)) {
    return false;
  }
  if (!component.minYear && !component.fields?.year?.minYear) {
    return false;
  }
  return true;
};

export const validateMinimumYear: RuleFn = async (context: ValidationContext) => {
  return validateMinimumYearSync(context);
};

export const validateMinimumYearSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new ProcessorError(
      `Cannot validate minimum year for value ${value}`,
      context,
      'validate:validateMinimumYear',
    );
  }
  const testValue = typeof value === 'string' ? value : String(value);
  const testArr = /\d{4}$/.exec(testValue);
  const year = testArr ? testArr[0] : null;
  if (
    (component as DayComponent).minYear &&
    (component as DayComponent).fields?.year?.minYear &&
    (component as DayComponent).minYear !== (component as DayComponent).fields.year.minYear
  ) {
    throw new ProcessorError(
      'Cannot validate minimum year, component.minYear and component.fields.year.minYear are not equal',
      context,
      'validate:validateMinimumYear',
    );
  }
  const minYear = (component as DayComponent).minYear;

  if (!minYear || !year) {
    return null;
  }

  return +year >= +minYear
    ? null
    : new FieldError('minYear', { ...context, minYear: String(minYear), setting: String(minYear) });
};

export const validateMinimumYearInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateMinimumYear',
  process: validateMinimumYear,
  processSync: validateMinimumYearSync,
  shouldProcess: shouldValidate,
};
