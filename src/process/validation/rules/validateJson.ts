import { JSONLogicEvaluator } from 'modules/jsonlogic';
import { FieldError } from 'error';
import { RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';
import { isObject } from 'lodash';
import { normalizeContext } from 'utils/formUtil';

export const shouldValidate = (context: ValidationContext) => {
  const { component } = context;
  if (!component.validate?.json || !isObject(component.validate.json)) {
    return false;
  }
  return true;
};

export const validateJson: RuleFn = async (context: ValidationContext) => {
  return validateJsonSync(context);
};

export const validateJsonSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value, evalContext } = context;
  if (!shouldValidate(context)) {
    return null;
  }

  const func = component?.validate?.json;
  const evalContextValue = evalContext
    ? evalContext(normalizeContext(context))
    : normalizeContext(context);
  evalContextValue.value = value || null;
  const valid: true | string = JSONLogicEvaluator.evaluate(
    func,
    {
      ...evalContextValue,
      input: value,
    },
    'valid',
  );
  if (valid === null) {
    return null;
  }
  return valid === true
    ? null
    : new FieldError(
        valid || 'jsonLogic',
        {
          ...context,
          setting: func,
        },
        'json',
      );
};

export const validateJsonInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateJson',
  process: validateJson,
  processSync: validateJsonSync,
  shouldProcess: shouldValidate,
};
