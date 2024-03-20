
import { RuleFn, RuleFnSync, TimeComponent, ValidationContext } from "types";
import { isEmpty } from "../util";
import { FieldError, ValidatorError } from 'error';
import { dayjs } from 'utils/date';
import { ProcessorInfo } from "types/process/ProcessorInfo";
import customParsers from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParsers);

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
    const { component, value, config } = context;
    if (!shouldValidate(context)) {
        return null;
    }
    try {
        if (!value || isEmpty(component, value)) return null;
        // Server side evaluations of validity should use the "dataFormat" vs the "format" which is used on the client.
        const format = config?.server ?
            ((component as TimeComponent).dataFormat || 'HH:mm:ss') :
            ((component as TimeComponent).format || 'HH:mm');
        const isValid = dayjs(String(value), format, true).isValid();
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
