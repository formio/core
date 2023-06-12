import _ from 'lodash';

import { FieldError } from 'error';
import { DateTimeComponent, TextFieldComponent, RuleFn, ProcessType} from 'types';
import { getComponentErrorField } from 'validation/util';

const isValidatableDateTimeComponent = (obj: any): obj is DateTimeComponent => {
    return !!obj && !!obj.type && obj.type === 'datetime';
};

const isValidatableTextFieldComponent = (obj: any): obj is TextFieldComponent => {
    return !!obj && !!obj.type && obj.widget && obj.widget.type === 'calendar';
};

const isValidatable = (component: any) => {
    return isValidatableDateTimeComponent(component) || isValidatableTextFieldComponent(component);
};

export const validateDate: RuleFn = async (component, data) => {
    const error = new FieldError({component, errorKeyOrMessage: 'invalidDate', field: getComponentErrorField(component), context: {process: ProcessType.Validation} });
    let value = _.get(data, component.key);
    if (!value || !isValidatable(component)) {
        return null;
    }

    // TODO: is this right?
    if (typeof value === 'string') {
        if (value.toLowerCase() === 'invalid date') {
            return error;
        }
        if (new Date(value).toString() === 'Invalid Date') {
            return error;
        }
        return null;
    } else if (value instanceof Date) {
        return value.toString() !== 'Invalid Date' ? null : error;
    }
    return error;
};
