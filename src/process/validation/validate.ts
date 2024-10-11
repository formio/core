import {
  Component,
  ComponentInstances,
  DataObject,
  ValidationRuleInfo,
  ValidationFn,
  ValidationFnSync,
  ValidationScope,
  ProcessContext,
} from 'types';
import { process, processSync } from '../process';
import { FieldError } from 'error';
import { validateProcessInfo } from '.';
import { rules } from './rules';

export type ProcessValidateContext = ProcessContext<ValidationScope> & {
  rules: ValidationRuleInfo[];
};

export async function processValidate(context: ProcessValidateContext): Promise<ValidationScope> {
  return await process<ValidationScope>(context);
}

export function processValidateSync(context: ProcessValidateContext): ValidationScope {
  return processSync<ValidationScope>(context);
}

export const validator = (rules: ValidationRuleInfo[]): ValidationFn => {
  return async (
    components: Component[],
    data: DataObject,
    instances?: ComponentInstances,
  ): Promise<FieldError[]> => {
    const scope: ValidationScope = await processValidate({
      components,
      data,
      instances,
      scope: { errors: [] },
      processors: [validateProcessInfo],
      rules,
    });
    return scope.errors;
  };
};

export const validatorSync = (rules: ValidationRuleInfo[]): ValidationFnSync => {
  return (
    components: Component[],
    data: DataObject,
    instances?: ComponentInstances,
  ): FieldError[] => {
    return processValidateSync({
      components,
      data,
      instances,
      scope: { errors: [] },
      processors: [validateProcessInfo],
      rules,
    }).errors;
  };
};

// Perform a validation on a form asynchonously.
export async function validate(
  components: Component[],
  data: DataObject,
  instances?: ComponentInstances,
): Promise<FieldError[]> {
  return validator(rules)(components, data, instances);
}

// Perform a validation on a form synchronously.
export function validateSync(
  components: Component[],
  data: DataObject,
  instances?: ComponentInstances,
): FieldError[] {
  return validatorSync(rules)(components, data, instances);
}
