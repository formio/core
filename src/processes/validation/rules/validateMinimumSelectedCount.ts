import _ from 'lodash';

import { FieldError, ValidatorError } from 'error';
import { SelectBoxesComponent, DataObject, RuleFn, ProcessType } from 'types';
import { getComponentErrorField } from 'validation/util';

const isValidatableSelectBoxesComponent = (component: any): component is SelectBoxesComponent => {
    return component && component.validate?.hasOwnProperty('minSelectedCount');
};

function validateValue(value: DataObject[any]): asserts value is Record<string, boolean> {
    if (value == null || typeof value !== 'object') {
        throw new ValidatorError(
            `Cannot validate maximum selected count for value ${value} as it is not an object`
        );
    }
    const subValues = Object.values(value);
    if (!subValues.every((value) => typeof value === 'boolean')) {
        throw new ValidatorError(
            `Cannot validate maximum selected count for value ${value} because it has non-boolean members`
        );
    }
}

export const validateMinimumSelectedCount: RuleFn = async (component, data, config) => {
    if (!isValidatableSelectBoxesComponent(component)) {
        return null;
    }
    const value = _.get(data, component.key);
    if (!value) {
        return null;
    }
    validateValue(value);

    const min =
        typeof component.validate?.minSelectedCount === 'string'
            ? parseFloat(component.validate.minSelectedCount)
            : component.validate?.minSelectedCount;

    if (!min) {
        return null;
    }
    const count = Object.keys(value).reduce((sum, key) => (value[key] ? ++sum : sum), 0);

    // Should not be triggered if there is no options selected at all
    if (count <= 0) {
        return null;
    }
    return count < min
        ? new FieldError({
              component,
              errorKeyOrMessage: 'minSelectedCount',
              field: getComponentErrorField(component),
              context: config?.context,
          })
        : null;
};
