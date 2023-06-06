import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { ValidatorError } from '../../error/ValidatorError';
import { NumberComponent } from '../../types/Component';
import { RuleFn } from '../../types/RuleFn';
import { getErrorMessage } from '../util';

const isValidatableNumberComponent = (component: any): component is NumberComponent => {
    return component && component.validate?.hasOwnProperty('min');
};

export const validateMinimumValue: RuleFn = async (component, data) => {
    if (!isValidatableNumberComponent(component)) {
        return null;
    }
    const value = _.get(data, component.key);
    const min =
        typeof component.validate?.min === 'string'
            ? parseFloat(component.validate.min)
            : component.validate?.min;

    if (!value) {
        return null;
    }
    const parsedValue = typeof value === 'string' ? parseFloat(value) : Number(value);

    if (Number.isNaN(min) || !min) {
        throw new ValidatorError('Cannot evaluate minimum value because it is invalid');
    }
    if (Number.isNaN(parsedValue)) {
        throw new ValidatorError(
            `Cannot validate minimum value ${min} because the value is invalid`
        );
    }

    return parsedValue >= min
        ? null
        : new FieldError(component, getErrorMessage(component, `cannot be less than ${min}`));
};
