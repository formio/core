import _ from 'lodash';

import { FieldError, ValidatorError } from 'error';
import { NumberComponent, RuleFn, RuleFnSync } from 'types';

const isValidatableNumberComponent = (component: any): component is NumberComponent => {
    return component && component.validate?.hasOwnProperty('min') && component.validate?.min;
};

export const validateMinimumValue: RuleFn = async (context) => {
   return validateMinimumValueSync(context);
};

export const validateMinimumValueSync: RuleFnSync = (context) => {
    const { component, value } = context;
    if (!isValidatableNumberComponent(component)) {
        return null;
    }
    const min =
        typeof component.validate?.min === 'string'
            ? parseFloat(component.validate.min)
            : component.validate?.min;

    if (value == null || !min) {
        return null;
    }
    const parsedValue = typeof value === 'string' ? parseFloat(value) : Number(value);

    if (Number.isNaN(min)) {
        throw new ValidatorError(`Cannot evaluate minimum value ${min} because it is invalid`);
    }
    if (Number.isNaN(parsedValue)) {
        throw new ValidatorError(
            `Cannot validate value ${parsedValue} because it is invalid`,
        );
    }

    return parsedValue >= min
        ? null
        : new FieldError('min', { ...context, min: String(min) });
};
