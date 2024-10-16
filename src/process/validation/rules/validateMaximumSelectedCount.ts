import { FieldError, ProcessorError } from 'error';
import { SelectBoxesComponent, DataObject, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableSelectBoxesComponent = (component: any): component is SelectBoxesComponent => {
  return component && component.validate?.hasOwnProperty('maxSelectedCount');
};

const getValidationSetting = (component: SelectBoxesComponent) => {
  let max = (component as SelectBoxesComponent).validate?.maxSelectedCount;
  if (typeof max === 'string') {
    max = parseFloat(max);
  }
  return max;
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isValidatableSelectBoxesComponent(component)) {
    return false;
  }
  if (!value) {
    return false;
  }
  if (!getValidationSetting(component)) {
    return false;
  }
  return true;
};

function validateValue(
  value: DataObject[any],
  context: ValidationContext,
): asserts value is Record<string, boolean> {
  if (value == null || typeof value !== 'object') {
    throw new ProcessorError(
      `Cannot validate maximum selected count for value ${value} as it is not an object`,
      context,
      'validate:validateMaximumSelectedCount',
    );
  }
  const subValues = Object.values(value);
  if (!subValues.every((value) => typeof value === 'boolean')) {
    throw new ProcessorError(
      `Cannot validate maximum selected count for value ${value} because it has non-boolean members`,
      context,
      'validate:validateMaximumSelectedCount',
    );
  }
}

export const validateMaximumSelectedCount: RuleFn = async (context: ValidationContext) => {
  return validateMaximumSelectedCountSync(context);
};

export const validateMaximumSelectedCountSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  try {
    if (!shouldValidate(context)) {
      return null;
    }
    validateValue(value, context);
    const max = getValidationSetting(component as SelectBoxesComponent);
    if (!max) {
      return null;
    }
    const count = Object.keys(value).reduce((sum, key) => (value[key] ? ++sum : sum), 0);

    // Should not be triggered if there is no options selected at all
    if (count <= 0) {
      return null;
    }
    return count > max
      ? new FieldError(
          (component as SelectBoxesComponent).maxSelectedCountMessage || 'maxSelectedCount',
          {
            ...context,
            maxCount: String(max),
            setting: String(max),
          },
        )
      : null;
  } catch (err: any) {
    throw new ProcessorError(err.message || err, context, 'validate:validateMaximumSelectedCount');
  }
};

export const validateMaximumSelectedCountInfo: ProcessorInfo<ValidationContext, FieldError | null> =
  {
    name: 'validateMaximumSelectedCount',
    process: validateMaximumSelectedCount,
    processSync: validateMaximumSelectedCountSync,
    shouldProcess: shouldValidate,
  };
