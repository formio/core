import { ProcessorContext } from 'types';
import { getComponentErrorField } from 'validation/util';

export class FieldError {
    context: ProcessorContext;
    errorKeyOrMessage: string;
    field: string;
    constructor(errorKeyOrMessage: string, context: ProcessorContext) {
        this.errorKeyOrMessage = errorKeyOrMessage;
        this.context = context;
        this.field = getComponentErrorField(context.component);
    }
}
