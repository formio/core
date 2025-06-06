import { RuleFn, RuleFnSync, ProcessorInfo, ValidationContext } from 'types';
import { FieldError, ProcessorError } from 'error';
import { evaluate } from 'utils';

export const validateCustom: RuleFn = async (context: ValidationContext) => {
  return validateCustomSync(context);
};

export const shouldValidate = (context: ValidationContext) => {
  const { component } = context;
  const customValidation = component.validate?.custom;
  if (!customValidation) {
    return false;
  }
  return true;
};

export const validateCustomSync: RuleFnSync = (context: ValidationContext) => {
  const { component, index, instance, value, data, row } = context;
  const customValidation = component.validate?.custom;
  try {
    if (!shouldValidate(context) || !customValidation) {
      return null;
    }

    const validationContext: any = instance?.evalContext ? instance.evalContext() : context;

    // We have to augment some of the evalContext values here if the evalContext comes from the instance
    const isValid = evaluate(customValidation, validationContext, 'valid', true, (context) => {
      context.component = component;
      context.data = data;
      context.row = row;
      context.rowIndex = typeof index === 'number' ? index : validationContext.rowIndex;
      context.instance = instance;
      context.valid = true;
      context.input = value;
    });

    if (isValid === null || isValid === true) {
      return null;
    }

    return new FieldError(
      typeof isValid === 'string' ? isValid : 'custom',
      {
        ...context,
        hasLabel: false,
        setting: customValidation,
      },
      'custom',
    );
  } catch (err: any) {
    throw new ProcessorError(err.message || err, context, 'validate:validateCustom');
  }
};

export const validateCustomInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateCustom',
  process: validateCustom,
  processSync: validateCustomSync,
  shouldProcess: shouldValidate,
};
