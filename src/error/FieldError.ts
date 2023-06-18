import { ProcessorContext } from 'types';
import { getComponentErrorField } from 'validation/util';

type ErrorKey = 'min' | 'max' | 'length' | 'pattern' | 'minDate' | 'maxDate' | 'minYear' | 'maxYear' | 'regex';

type FieldErrorContext = ProcessorContext & {
    field?: string;
    // TODO: the following are needed for for backwards compatibility, do we need this?
    // * error.level will determine whether the `alert` template will display
    // * error.context.hasLabel will determine how the error is displayed in the `alert` template
    level?: string;
    hasLabel?: boolean;
    // TODO: these are the custom error properties according to the inline docs in the builer
    min?: string;
    max?: string;
    length?: string;
    pattern?: string;
    minDate?: string;
    maxDate?: string;
    minYear?: string;
    maxYear?: string;
    regex?: string;
};
export class FieldError {
    context: FieldErrorContext
    errorKeyOrMessage: string;
    constructor(errorKeyOrMessage: string, context: FieldErrorContext) {
        const { component, field = getComponentErrorField(component) } = context;
        if (context.component.validate?.customMessage) {
            this.errorKeyOrMessage = context.component.validate.customMessage;
            this.context = { ...context, hasLabel: false, field };
        }
        else {
            this.errorKeyOrMessage = errorKeyOrMessage;
            this.context = { ...context, field };
        }
    }
}
