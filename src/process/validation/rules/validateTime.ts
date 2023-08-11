
import { RuleFn, RuleFnSync, TimeComponent } from "types";
import { isEmpty } from "../util";
import { FieldError, ValidatorError } from 'error';
import { dayjs } from 'utils/date';

const isValidatableTimeComponent = (comp: any): comp is TimeComponent => {
    return comp && comp.type === 'time';
}

export const validateTimeSync: RuleFnSync = (context) => {
    const { component, value } = context;

    if (!isValidatableTimeComponent(component)) {
        return null;
    }
    try {
        if (!value || isEmpty(component, value)) return null;
        const isValid = typeof value === 'string' ?
            dayjs(value, component.format).isValid() : dayjs(String(value), component.format).isValid();
        return isValid ? null : new FieldError('time', context);
    }
    catch (err) {
        throw new ValidatorError(`Could not validate time component ${component.key} with value ${value}`);
    }
}

export const validateTime: RuleFn = async (context) => {
    return validateTimeSync(context);
}
