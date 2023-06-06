import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { ValidatorError } from '../../error/ValidatorError';
import { NumberComponent } from '../../types/Component';
import { RuleFn } from '../../types/RuleFn';
import { getErrorMessage } from '../../validator/util';

const isValidatableNumberComponent = (component: any): component is NumberComponent => {
    return component && component.validate?.hasOwnProperty('max');
};

export const validateMaximumValue: RuleFn = async (component, data) => {
    if (!isValidatableNumberComponent(component)) {
        return null;
    }
    const value = _.get(data, component.key);
    const max =
        typeof component.validate?.max === 'string'
            ? parseFloat(component.validate.max)
            : component.validate?.max;

    if (!value) {
        return null;
    }
    const parsedValue = typeof value === 'string' ? parseFloat(value) : Number(value);

    if (Number.isNaN(max) || !max) {
        throw new ValidatorError('Cannot evaluate maximum value because it is invalid');
    }
    if (Number.isNaN(parsedValue)) {
        throw new ValidatorError(
            `Cannot validate maximum value ${max} because the value is invalid`
        );
    }

    return parsedValue <= max
        ? null
        : new FieldError(component, getErrorMessage(component, `cannot be greater than ${max}`));
};
