import { FieldError, ProcessorError } from 'error';
import { SurveyComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

type SurveyDataObject = Record<string, string>;

const isValidatableSurveyDataObject = (obj: any): obj is SurveyDataObject => {
  return Object.entries(obj).every(
    ([key, value]) => typeof key === 'string' && typeof value === 'string',
  );
};

const isValidatableSurveyComponent = (component: any): component is SurveyComponent => {
  return component && component.type === 'survey' && component.validate?.required;
};

export const validateRequiredSurvey: RuleFn = async (context) => {
  return validateRequiredSurveySync(context);
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isValidatableSurveyComponent(component)) {
    return false;
  }
  if (!value) {
    return false;
  }
  return true;
};

export const validateRequiredSurveySync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  if (!isValidatableSurveyDataObject(value)) {
    throw new ProcessorError(
      `Cannot validate survey component because ${value} is not valid`,
      context,
      'validate:validateRequiredSurvey',
    );
  }
  for (const question of (component as SurveyComponent).questions) {
    if (!value[question.value]) {
      const error = new FieldError('requiredSurvey', context, 'required');
      return error;
    }
  }
  return null;
};

export const validateRequiredSurveyInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateRequiredSurvey',
  process: validateRequiredSurvey,
  processSync: validateRequiredSurveySync,
  shouldProcess: shouldValidate,
};
