import _ from 'lodash';

import { FieldError, ValidatorError } from 'error';
import { NumberComponent, RuleFn, ProcessType } from 'types';
import { getComponentErrorField } from 'validation/util';

const isValidatableNumberComponent = (component: any): component is NumberComponent => {
    return component && component.validate?.hasOwnProperty('max');
};

export const validateMaximumValue: RuleFn = async (component, data, config) => {
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
        : new FieldError({
              component,
              errorKeyOrMessage: 'maxValue',
              field: getComponentErrorField(component),
              context: config?.context,
          });
};
