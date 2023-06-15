import { ProcessContext } from 'types';
import { getComponentErrorField } from 'processes/validation/util';

export class FieldError {
    context: ProcessContext;
    errorKeyOrMessage: string;
    field: string;
    constructor(errorKeyOrMessage: string, context: ProcessContext) {
        this.errorKeyOrMessage = errorKeyOrMessage;
        this.context = context;
        this.field = getComponentErrorField(context.component);
    }
}
