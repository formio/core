import _ from 'lodash';

import { FieldError, ValidatorError } from 'error';
import { NumberComponent, RuleFn } from 'types';

const isValidatableNumberComponent = (component: any): component is NumberComponent => {
    return component && component.validate?.hasOwnProperty('max');
};

export const validateMaximumValue: RuleFn = async (context) => {
    const { component, data, path } = context;
    if (!isValidatableNumberComponent(component)) {
        return null;
    }
    const value = _.get(data, path);
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
        : new FieldError('maxValue', {...context, max: String(max) });
};
