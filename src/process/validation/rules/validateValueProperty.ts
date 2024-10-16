import { isEmpty, isUndefined, isObject } from 'lodash';
import { FieldError } from 'error';
import { ListComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableListComponent = (comp: any): comp is ListComponent => {
  return (
    comp &&
    comp.type &&
    (comp.type === 'radio' || comp.type === 'selectboxes' || comp.type === 'select')
  );
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isValidatableListComponent(component)) {
    return false;
  }
  if (component.dataSrc !== 'url') {
    return false;
  }
  if (!value || (typeof value === 'object' && isEmpty(value))) {
    return false;
  }
  const valueProperty = component.valueProperty;
  if (!valueProperty) {
    return false;
  }
  return true;
};

export const validateValueProperty: RuleFn = async (context: ValidationContext) => {
  return validateValuePropertySync(context);
};

export const validateValuePropertySync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  const error = new FieldError('invalidValueProperty', context);
  // TODO: at some point in the radio component's change pipeline, object values are coerced into strings; testing for
  // '[object Object]' is an ugly way to determine whether or not the ValueProperty is invalid, but it'll have to do
  // for now
  if (
    component.inputType === 'radio' &&
    (isUndefined(value) || isObject(value) || value === '[object Object]')
  ) {
    return error;
  }
  // TODO: a cousin to the above issue, but sometimes ValueProperty will resolve to a boolean value so the keys in
  // e.g. SelectBoxes components will strings coerced from booleans; again, not pretty, but good enough for now
  else if (component.inputType !== 'radio') {
    if (
      Object.entries(value as any).some(
        ([key, value]) => value && (key === '[object Object]' || key === 'true' || key === 'false'),
      )
    ) {
      return error;
    }
  }
  return null;
};

export const validateValuePropertyInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateValueProperty',
  process: validateValueProperty,
  processSync: validateValuePropertySync,
  shouldProcess: shouldValidate,
};
