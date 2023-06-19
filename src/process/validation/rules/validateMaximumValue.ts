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

    if (!value || !max) {
        return null;
    }
    const parsedValue = typeof value === 'string' ? parseFloat(value) : Number(value);

    if (Number.isNaN(max)) {
        throw new ValidatorError(`Cannot evaluate maximum value ${max} because it is invalid`);
    }
    if (Number.isNaN(parsedValue)) {
        throw new ValidatorError(
            `Cannot validate value ${parsedValue} because it is invalid`
        );
    }

    return parsedValue <= max
        ? null
        : new FieldError('max', {...context, max: String(max) });
};
