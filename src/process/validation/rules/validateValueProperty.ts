import { FieldError } from 'error';
import { ListComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableListComponent = (comp: any): comp is ListComponent => {
  return comp && comp.type && comp.type === 'selectboxes';
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, instance } = context;
  if (!isValidatableListComponent(component)) {
    return false;
  }
  if (component.dataSrc !== 'url') {
    return false;
  }
  if ((instance as any)?.options?.building) {
    return true;
  }
  return false;
};

export const validateValueProperty: RuleFn = async (context: ValidationContext) => {
  return validateValuePropertySync(context);
};

export const validateValuePropertySync: RuleFnSync = (context: ValidationContext) => {
  const { value, instance } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  const error = new FieldError('invalidValueProperty', context);

  if (
    Object.entries(value as any).some(
      ([key, value]) => value && (key === '[object Object]' || key === 'true' || key === 'false'),
    ) ||
    (instance && instance.loadedOptions?.some((option) => option.invalid))
  ) {
    return error;
  }

  return null;
};

export const validateValuePropertyInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateValueProperty',
  process: validateValueProperty,
  processSync: validateValuePropertySync,
  shouldProcess: shouldValidate,
};
