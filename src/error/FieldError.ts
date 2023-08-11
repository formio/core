import { ProcessorContext } from 'types';
import { getComponentErrorField } from 'validation/util';

type FieldErrorContext = ProcessorContext & {
    field?: string;
    // TODO: the following are needed for for backwards compatibility, do we need this?
    // * context.level will determine whether the `alert` template will display
    // * context.hasLabel will determine how the error is displayed in the `alert` template
    level?: string;
    hasLabel?: boolean;
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
    context: FieldErrorContext
    errorKeyOrMessage: string;
    level?: string;
    constructor(errorKeyOrMessage: string, context: FieldErrorContext) {
        const { component, hasLabel = true, field = getComponentErrorField(component, context), level = 'error' } = context;
        if (context.component.validate?.customMessage) {
            this.errorKeyOrMessage = context.component.validate.customMessage;
            this.context = { ...context, hasLabel: false, field, level };
        }
        else {
            this.errorKeyOrMessage = errorKeyOrMessage;
            this.context = { ...context, hasLabel, field };
            this.level = level;
        }
    }
}
