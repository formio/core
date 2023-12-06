
import { RuleFn, RuleFnSync, TimeComponent, ValidationContext } from "types";
import { isEmpty } from "../util";
import { FieldError, ValidatorError } from 'error';
import { dayjs } from 'utils/date';
import { ProcessorInfo } from "types/process/ProcessorInfo";

const isValidatableTimeComponent = (comp: any): comp is TimeComponent => {
    return comp && comp.type === 'time';
}

export const shouldValidate = (context: ValidationContext) => {
    const { component, value } = context;
    if (!isValidatableTimeComponent(component)) {
        return false;
    }
    return true;
};

export const validateTimeSync: RuleFnSync = (context: ValidationContext) => {
    const { component, value } = context;
    if (!shouldValidate(context)) {
        return null;
    }
    try {
        if (!value || isEmpty(component, value)) return null;
        const isValid = typeof value === 'string' ?
            dayjs(value, (component as TimeComponent).format).isValid() : dayjs(String(value), (component as TimeComponent).format).isValid();
        return isValid ? null : new FieldError('time', context);
    }
    catch (err) {
        throw new ValidatorError(`Could not validate time component ${component.key} with value ${value}`);
    }
}

export const validateTime: RuleFn = async (context: ValidationContext) => {
    return validateTimeSync(context);
}

export const validateTimeInfo: ProcessorInfo<ValidationContext, FieldError | null>  = {
    name: 'validateTime',
    process: validateTime,
    processSync: validateTimeSync,
    shouldProcess: shouldValidate,
}
