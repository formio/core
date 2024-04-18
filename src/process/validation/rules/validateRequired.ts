import { FieldError } from 'error';
import { AddressComponentDataObject, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { isEmptyObject } from '../util';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isAddressComponentDataObject = (value: any): value is AddressComponentDataObject => {
    return value !== null && typeof value === 'object' && value.mode && value.address && typeof value.address === 'object';
}

export const shouldValidate = (context: ValidationContext) => {
    const { component } = context;
    if (component.validate?.required) {
        return true;
    }
    return false;
};

export const validateRequired: RuleFn = async (context: ValidationContext) => {
    return validateRequiredSync(context);
};

export const validateRequiredSync: RuleFnSync = (context: ValidationContext) => {
    const error = new FieldError('required', {...context, setting: true});
    const { component, value } = context;
    if (!shouldValidate(context)) {
        return null;
    }
    if (
        (value === null || value === undefined || isEmptyObject(value) || (!!value === false && value !== 0)) &&
        !component.hidden
    ) {
        return error;
    }
    else if (Array.isArray(value) && value.length === 0) {
        return error;
    }
    else if (component.type === 'address' && isAddressComponentDataObject(value)) {
        return isEmptyObject(value.address) ? error : Object.values(value.address).every((val) => !!val) ? null : error;
    }
    else if (component.type === 'day' && value === '00/00/0000') {
        return error;
    }
    else if (typeof value === 'object' && value !== null) {
        return Object.values(value).some((val) => !!val) ? null : error;
    }
    return null;
};

export const validateRequiredInfo: ProcessorInfo<ValidationContext, FieldError | null>  = {
    name: 'validateRequired',
    process: validateRequired,
    processSync: validateRequiredSync,
    shouldProcess: shouldValidate,
};
