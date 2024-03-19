import { FieldError, ProcessorError } from 'error';
import { SelectBoxesComponent, DataObject, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableSelectBoxesComponent = (component: any): component is SelectBoxesComponent => {
    return component && component.validate?.hasOwnProperty('minSelectedCount');
};

const getValidationSetting = (component: SelectBoxesComponent) => {
    let min = (component as SelectBoxesComponent).validate?.minSelectedCount;
    if (typeof min === 'string') {
        min = parseFloat(min);
    }
    return min;
};

export const shouldValidate = (context: ValidationContext) => {
    const { component, value } = context;
    if (!isValidatableSelectBoxesComponent(component)) {
        return false;
    }
    if (!value) {
        return false;
    }
    if (!getValidationSetting(component)) {
        return false;
    }
    return true;
};

function validateValue(value: DataObject[any]): asserts value is Record<string, boolean> {
    if (value == null || typeof value !== 'object') {
        throw new Error(
            `Cannot validate maximum selected count for value ${value} as it is not an object`
        );
    }
    const subValues = Object.values(value);
    if (!subValues.every((value) => typeof value === 'boolean')) {
        throw new Error(
            `Cannot validate maximum selected count for value ${value} because it has non-boolean members`
        );
    }
}

export const validateMinimumSelectedCount: RuleFn = async (context: ValidationContext) => {
    return validateMinimumSelectedCountSync(context);
};

export const validateMinimumSelectedCountSync: RuleFnSync = (context: ValidationContext) => {
    const { component, value } = context;
    try {

        if (!shouldValidate(context)) {
            return null;
        }
        validateValue(value);
        const min = getValidationSetting((component as SelectBoxesComponent));
        if (!min) {
            return null;
        }
        const count = Object.keys(value).reduce((sum, key) => (value[key] ? ++sum : sum), 0);

        // Should not be triggered if there are no options selected at all
        if (count <= 0) {
            return null;
        }
        return count < min
            ? new FieldError((component as SelectBoxesComponent).minSelectedCountMessage || 'minSelectedCount', {
                ...context,
                minCount: String(min),
                setting: String(min),
            })
            : null;
    } catch (err: any) {
        throw new ProcessorError(err.message || err, context, 'validate:validateMinimumSelectedCount');
    }
};

export const validateMinimumSelectedCountInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
    name: 'validateMinimumSelectedCount',
    process: validateMinimumSelectedCount,
    processSync: validateMinimumSelectedCountSync,
    shouldProcess: shouldValidate,
};
