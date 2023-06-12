import _ from 'lodash';

import { FieldError, ValidatorError } from 'error';
import { SelectBoxesComponent, DataObject, RuleFn, ProcessType} from 'types';
import { getComponentErrorField } from 'validation/util';

const isValidatableSelectBoxesComponent = (component: any): component is SelectBoxesComponent => {
    return component && component.validate?.hasOwnProperty('maxSelectedCount');
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

export const validateMaximumSelectedCount: RuleFn = async (component, data) => {
    if (!isValidatableSelectBoxesComponent(component)) {
        return null;
    }
    const value = _.get(data, component.key);
    if (!value) {
        return null;
    }
    validateValue(value);

    const max =
        typeof component.validate?.maxSelectedCount === 'string'
            ? parseFloat(component.validate.maxSelectedCount)
            : component.validate?.maxSelectedCount;

    if (!max) {
        return null;
    }
    const count = Object.keys(value).reduce((sum, key) => (value[key] ? ++sum : sum), 0);

    // Should not be triggered if there is no options selected at all
    if (count <= 0) {
        return null;
    }
    return count > max
        ? new FieldError({ component, errorKeyOrMessage: 'maxSelectedCount', field: getComponentErrorField(component), context: { process: ProcessType.Validation } })
        : null;
};
