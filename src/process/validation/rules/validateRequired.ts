import _ from 'lodash';

import { FieldError } from 'error';
import { AddressComponentDataObject, RuleFn, RuleFnSync } from 'types';
import { isEmptyObject } from '../util';

const isAddressComponentDataObject = (value: any): value is AddressComponentDataObject => {
    return value !== null && typeof value === 'object' && value.mode && value.address && typeof value.address === 'object';
}

export const validateRequired: RuleFn = async (context) => {
    return validateRequiredSync(context);
};

export const validateRequiredSync: RuleFnSync = (context) => {
    const error = new FieldError('required', context);
    const { component, value } = context;
    if (component.validate?.required) {
        if (
            (value === null || value === undefined || isEmptyObject(value) || !!value === false) &&
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
    }
    return null;
};
