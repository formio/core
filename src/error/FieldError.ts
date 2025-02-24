import { ValidationContext } from 'types';
import { getComponentErrorField } from 'utils/formUtil';

type FieldErrorContext = ValidationContext & {
  field?: string;
  // TODO: the following are needed for for backwards compatibility, do we need this?
  // * context.level will determine whether the `alert` template will display
  // * context.hasLabel will determine how the error is displayed in the `alert` template
  level?: string;
  hasLabel?: boolean;
  setting?: string | boolean | number;
  // TODO: these are the custom error properties according to the inline docs in the builer
  min?: string;
  max?: string;
  length?: string;
  pattern?: string;
  minCount?: string;
  maxCount?: string;
  minDate?: string;
  maxDate?: string;
  minYear?: string;
  maxYear?: string;
  regex?: string;
};
export class FieldError {
  context: FieldErrorContext;
  errorKeyOrMessage: string;
  ruleName: string;
  level?: string;
  constructor(
    errorKeyOrMessage: string,
    context: FieldErrorContext,
    ruleName: string = errorKeyOrMessage,
  ) {
    const {
      component,
      hasLabel = true,
      field = getComponentErrorField(component, context),
      level = 'error',
    } = context;
    this.ruleName = ruleName;
    this.level = level;
    if (context.component.validate?.customMessage) {
      this.errorKeyOrMessage = context.component.validate.customMessage;
      this.context = { ...context, hasLabel: false, field, level };
    } else {
      this.errorKeyOrMessage = errorKeyOrMessage;
      this.context = { ...context, hasLabel, field };
    }
  }
}

export type InterpolateErrorFn = (text: string, context: FieldErrorContext) => string;
