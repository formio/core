import { FieldError } from 'error';
import {
  AddressComponentDataObject,
  RuleFn,
  RuleFnSync,
  ValidationContext,
  AddressComponent,
  DayComponent,
} from 'types';
import { isEmptyObject, doesArrayDataHaveValue } from '../util';
import { isComponentNestedDataType } from 'utils/formUtil';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isAddressComponent = (component: any): component is AddressComponent => {
  return component.type === 'address';
};

const isDayComponent = (component: any): component is DayComponent => {
  return component.type === 'day';
};

const isAddressComponentDataObject = (value: any): value is AddressComponentDataObject => {
  return (
    value !== null &&
    typeof value === 'object' &&
    value.mode &&
    value.address &&
    typeof value.address === 'object'
  );
};

// Checkboxes and selectboxes consider false to be falsy, whereas other components with
// settable values (e.g. radio, select, datamap, container, etc.) consider it truthy
const isComponentThatCannotHaveFalseValue = (component: any): boolean => {
  return component.type === 'checkbox' || component.type === 'selectboxes';
};

const valueIsPresent = (
  value: any,
  considerFalseTruthy: boolean,
  isNestedDatatype?: boolean,
): boolean => {
  // Evaluate for 3 out of 6 falsy values ("", null, undefined), don't check for 0
  // and only check for false under certain conditions
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    (!considerFalseTruthy && value === false)
  ) {
    return false;
  }
  // Evaluate for empty object
  else if (isEmptyObject(value)) {
    return false;
  }
  // Evaluate for empty array
  else if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  // Recursively evaluate
  else if (typeof value === 'object' && !isNestedDatatype) {
    return Object.values(value).some((val) =>
      valueIsPresent(val, considerFalseTruthy, isNestedDatatype),
    );
  }
  // If value is an array, check it's children have value
  else if (Array.isArray(value) && value.length) {
    return doesArrayDataHaveValue(value);
  }
  return true;
};

export const shouldValidate = (context: ValidationContext): boolean => {
  const { component } = context;
  return !!component.validate?.required;
};

export const validateRequired: RuleFn = async (context: ValidationContext) => {
  return validateRequiredSync(context);
};

export const validateRequiredSync: RuleFnSync = (context: ValidationContext) => {
  const error = new FieldError('required', { ...context, setting: true });
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  if (isAddressComponent(component) && isAddressComponentDataObject(value)) {
    return isEmptyObject(value.address)
      ? error
      : Object.entries(value.address)
            .filter(([key]) => !['address2'].includes(key))
            .every(([, val]) => !!val)
        ? null
        : error;
  } else if (isDayComponent(component) && value === '00/00/0000') {
    return error;
  } else if (isComponentThatCannotHaveFalseValue(component)) {
    return !valueIsPresent(value, false, isComponentNestedDataType(component)) ? error : null;
  }
  return !valueIsPresent(value, true, isComponentNestedDataType(component)) ? error : null;
};

export const validateRequiredInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateRequired',
  process: validateRequired,
  processSync: validateRequiredSync,
  shouldProcess: shouldValidate,
};
