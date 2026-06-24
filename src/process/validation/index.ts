import {
  ProcessorFn,
  ProcessorFnSync,
  ProcessorInfo,
  ValidationContext,
  ValidationProcessorFn,
  ValidationProcessorFnSync,
  ValidationRuleInfo,
  ValidationScope,
  SkipValidationFn,
  ConditionsContext,
  ProcessorPostFn,
  ProcessorPostFnSync,
} from 'types';
import { evaluationRules, rules, serverRules } from './rules';
import find from 'lodash/find';
import get from 'lodash/get';
import pick from 'lodash/pick';
import { getErrorMessage } from 'utils/error';
import { FieldError } from 'error';
import {
  ConditionallyHidden,
  isConditionallyHidden,
  isCustomConditionallyHidden,
  isSimpleConditionallyHidden,
} from 'processes/conditions';

// Cleans up validation errors to remove unnessesary parts
// and make them transferable to ivm.
const cleanupValidationError = (error: any) => ({
  ...error,
  context: pick(error.context, [
    'component',
    'path',
    'index',
    'value',
    'field',
    'hasLabel',
    'processor',
    'setting',
    'pattern',
    'length',
    'min',
    'max',
    'maxDate',
    'minDate',
    'maxYear',
    'minYear',
    'minCount',
    'maxCount',
    'regex',
  ]),
});

export function validationRules(
  context: ValidationContext,
  rules: ValidationRuleInfo[],
  skipValidation?: SkipValidationFn,
): ValidationRuleInfo[] {
  if (skipValidation && skipValidation(context)) {
    return [];
  }
  const validationRules: ValidationRuleInfo[] = [];
  return rules.reduce((acc, rule: ValidationRuleInfo) => {
    if (rule.shouldProcess && rule.shouldProcess(context)) {
      acc.push(rule);
    }
    return acc;
  }, validationRules);
}

export function isInputComponent(context: ValidationContext): boolean {
  const { component } = context;
  return !component.hasOwnProperty('input') || component.input;
}

export function isValueHidden(context: ValidationContext): boolean {
  const { component } = context;
  if (component.protected) {
    return false;
  }
  if (
    (component.hasOwnProperty('persistent') && !component.persistent) ||
    component.persistent === 'client-only'
  ) {
    return true;
  }
  return false;
}
export function isForcedHidden(
  context: ValidationContext,
  isConditionallyHidden: ConditionallyHidden,
): boolean {
  const { component } = context;
  if (component.scope?.conditionallyHidden || isConditionallyHidden(context as ConditionsContext)) {
    return true;
  }
  if (component.scope?.intentionallyHidden) {
    return true;
  }
  if (component.hasOwnProperty('hidden')) {
    return !!component.hidden;
  }
  return false;
}

export const _shouldSkipValidation = (
  context: ValidationContext,
  isConditionallyHidden: ConditionallyHidden,
) => {
  const { component } = context;

  const rules = [
    // Skip validation if component is readOnly
    // () => this.options.readOnly,
    // Do not check validations if component is not an input component.
    () => !isInputComponent(context),
    // Check to see if we are editing and if so, check component persistence.
    () => isValueHidden(context),
    // Force valid if component is hidden.
    () => !component.validateWhenHidden && isForcedHidden(context, isConditionallyHidden),
  ];

  return rules.some((pred) => pred());
};

export const shouldSkipValidationCustom: SkipValidationFn = (context: ValidationContext) => {
  return _shouldSkipValidation(context, isCustomConditionallyHidden);
};

export const shouldSkipValidationSimple: SkipValidationFn = (context: ValidationContext) => {
  return _shouldSkipValidation(context, isSimpleConditionallyHidden);
};

export const shouldSkipValidation: SkipValidationFn = (context: ValidationContext) => {
  return _shouldSkipValidation(context, isConditionallyHidden);
};

export function shouldValidateAll(context: ValidationContext): boolean {
  return validationRules(context, rules, shouldSkipValidation).length > 0;
}

export function shouldValidateCustom(context: ValidationContext): boolean {
  const { component } = context;
  if (component.customConditional) {
    return true;
  }
  return !shouldSkipValidationCustom(context);
}

export function shouldValidateServer(context: ValidationContext): boolean {
  const { component } = context;
  if (component.customConditional) {
    return false;
  }
  if (shouldSkipValidationSimple(context)) {
    return false;
  }
  return shouldValidateAll(context);
}

function handleError(error: FieldError | null, context: ValidationContext) {
  const { scope, path } = context;
  if (error) {
    const cleanedError = cleanupValidationError(error);
    cleanedError.context.path = path;
    if (
      !find(scope.errors, {
        errorKeyOrMessage: cleanedError.errorKeyOrMessage,
        context: {
          path: path,
        },
      })
    ) {
      if (!scope.validated) scope.validated = [];
      if (!scope.errors) scope.errors = [];
      scope.errors.push(cleanedError);
      scope.validated.push({ path, error: cleanedError });
    }
  }
}

export const validateProcess: ValidationProcessorFn = async (context) => {
  const { component, data, row, path, instance, scope, rules, skipValidation } = context;
  let { value } = context;
  if (!scope.validated) scope.validated = [];
  if (!scope.errors) scope.errors = [];
  if (!rules || !rules.length) {
    return;
  }
  if (component.multiple && Array.isArray(value) && value.length > 0) {
    const fullValueRules = rules.filter((rule) => rule.fullValue);
    const otherRules = rules.filter((rule) => !rule.fullValue);
    for (let i = 0; i < value.length; i++) {
      const amendedPath = `${path}[${i}]`;
      let amendedValue = get(data, amendedPath);
      if (instance?.shouldSkipValidation(data)) {
        return;
      }
      const rulesToExecute: ValidationRuleInfo[] = validationRules(
        context,
        otherRules,
        skipValidation,
      );
      if (!rulesToExecute.length) {
        continue;
      }
      if (component.truncateMultipleSpaces && amendedValue && typeof amendedValue === 'string') {
        amendedValue = amendedValue.trim().replace(/\s{2,}/g, ' ');
      }
      for (const rule of rulesToExecute) {
        if (rule && rule.process) {
          handleError(
            await rule.process({
              ...context,
              value: amendedValue,
              index: i,
              path: amendedPath,
            }),
            context,
          );
        }
      }
    }
    for (const rule of fullValueRules) {
      if (rule && rule.process) {
        handleError(
          await rule.process({
            ...context,
            value,
          }),
          context,
        );
      }
    }
    return;
  }
  if (instance?.shouldSkipValidation(data, row)) {
    return;
  }
  const rulesToExecute: ValidationRuleInfo[] = validationRules(context, rules, skipValidation);
  if (!rulesToExecute.length) {
    return;
  }
  if (component.truncateMultipleSpaces && value && typeof value === 'string') {
    value = value.trim().replace(/\s{2,}/g, ' ');
  }
  for (const rule of rulesToExecute) {
    try {
      if (rule && rule.process) {
        handleError(await rule.process({ ...context, value }), context);
      }
    } catch (err) {
      console.error('Validator error:', getErrorMessage(err));
    }
  }
  return;
};

export const validateProcessSync: ValidationProcessorFnSync = (context) => {
  const { component, data, row, path, instance, scope, rules, skipValidation } = context;
  let { value } = context;
  if (!scope.validated) scope.validated = [];
  if (!scope.errors) scope.errors = [];
  if (!rules || !rules.length) {
    return;
  }
  if (component.multiple && Array.isArray(value) && value.length > 0) {
    const fullValueRules = rules.filter((rule) => rule.fullValue);
    const otherRules = rules.filter((rule) => !rule.fullValue);
    for (let i = 0; i < value.length; i++) {
      const amendedPath = `${path}[${i}]`;
      let amendedValue = get(data, amendedPath);
      if (instance?.shouldSkipValidation(data)) {
        return;
      }
      const rulesToExecute: ValidationRuleInfo[] = validationRules(
        context,
        otherRules,
        skipValidation,
      );
      if (!rulesToExecute.length) {
        continue;
      }
      if (component.truncateMultipleSpaces && amendedValue && typeof amendedValue === 'string') {
        amendedValue = amendedValue.trim().replace(/\s{2,}/g, ' ');
      }
      for (const rule of rulesToExecute) {
        if (rule && rule.processSync) {
          handleError(
            rule.processSync({
              ...context,
              value: amendedValue,
              index: i,
              path: amendedPath,
            }),
            context,
          );
        }
      }
    }
    for (const rule of fullValueRules) {
      if (rule && rule.processSync) {
        handleError(
          rule.processSync({
            ...context,
            value,
          }),
          context,
        );
      }
    }
    return;
  }
  if (instance?.shouldSkipValidation(data, row)) {
    return;
  }
  const rulesToExecute: ValidationRuleInfo[] = validationRules(context, rules, skipValidation);
  if (!rulesToExecute.length) {
    return;
  }
  if (component.truncateMultipleSpaces && value && typeof value === 'string') {
    value = value.trim().replace(/\s{2,}/g, ' ');
  }
  for (const rule of rulesToExecute) {
    try {
      if (rule && rule.processSync) {
        handleError(rule.processSync({ ...context, value }), context);
      }
    } catch (err) {
      console.error('Validator error:', getErrorMessage(err));
    }
  }
  return;
};

export const validateCustomProcess: ValidationProcessorFn = async (context) => {
  context.rules = context.rules || evaluationRules;
  context.skipValidation = shouldSkipValidationCustom;
  return validateProcess(context);
};

export const validateCustomProcessSync: ProcessorFnSync<ValidationScope> = (
  context: ValidationContext,
) => {
  context.rules = context.rules || evaluationRules;
  context.skipValidation = shouldSkipValidationCustom;
  return validateProcessSync(context);
};

export const validateServerProcess: ValidationProcessorFn = async (context) => {
  context.rules = context.rules || serverRules;
  context.skipValidation = shouldSkipValidationSimple;
  return validateProcess(context);
};

export const validateServerProcessSync: ProcessorFnSync<ValidationScope> = (
  context: ValidationContext,
) => {
  context.rules = context.rules || serverRules;
  context.skipValidation = shouldSkipValidationSimple;
  return validateProcessSync(context);
};

export const validateAllProcess: ProcessorFn<ValidationScope> = async (
  context: ValidationContext,
) => {
  context.rules = context.rules || rules;
  context.skipValidation = shouldSkipValidation;
  return validateProcess(context);
};

export const validateAllProcessSync: ProcessorFnSync<ValidationScope> = (
  context: ValidationContext,
) => {
  context.rules = context.rules || rules;
  context.skipValidation = shouldSkipValidation;
  return validateProcessSync(context);
};

export const validatePostProcess: ProcessorPostFn<ValidationScope> = async (
  context: ValidationContext,
): Promise<void> => {
  await validateAllProcess(context);
};

export const validatePostProcessSync: ProcessorPostFnSync<ValidationScope> = (
  context: ValidationContext,
): void => {
  validateAllProcessSync(context);
};

export const validateCustomProcessInfo: ProcessorInfo<ValidationContext, void> = {
  name: 'validateCustom',
  process: validateCustomProcess,
  processSync: validateCustomProcessSync,
  shouldProcess: shouldValidateCustom,
};

export const validateServerProcessInfo: ProcessorInfo<ValidationContext, void> = {
  name: 'validateServer',
  process: validateServerProcess,
  processSync: validateServerProcessSync,
  shouldProcess: shouldValidateServer,
};

export const validateProcessInfo: ProcessorInfo<ValidationContext, void> = {
  name: 'validate',
  process: validateAllProcess,
  processSync: validateAllProcessSync,
  shouldProcess: shouldValidateAll,
};

export const postValidateProcessInfo: ProcessorInfo<ValidationContext, void> = {
  name: 'validate',
  postProcess: validatePostProcess,
  postProcessSync: validatePostProcessSync,
  shouldProcess: shouldValidateAll,
};

export * from './util';
