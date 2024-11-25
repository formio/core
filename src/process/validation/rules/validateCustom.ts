import { RuleFn, RuleFnSync, ProcessorInfo, ValidationContext } from 'types';
import { FieldError, ProcessorError } from 'error';
import { Evaluator } from 'utils';

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
  const { component, data, row, value, index, instance, evalContext } = context;
  const customValidation = component.validate?.custom;
  try {
    if (!shouldValidate(context)) {
      return null;
    }

    const ctx = instance?.evalContext
      ? instance.evalContext()
      : evalContext
        ? evalContext(context)
        : context;
    const evalContextValue = {
      ...ctx,
      component,
      data,
      row,
      rowIndex: typeof index === 'number' ? index : ctx.rowIndex,
      instance,
      valid: true,
      input: value,
    };

    const isValid = Evaluator.evaluate(customValidation, evalContextValue, 'valid', true, {}, {});

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
