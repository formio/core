import { isEmpty, isUndefined} from 'lodash';
import { FieldError, ProcessorError } from 'error';
import { Evaluator } from 'utils';
import { RadioComponent, SelectComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { isObject, isPromise } from '../util';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

function isValidatableRadioComponent(component: any): component is RadioComponent {
    return (
        component &&
        component.type === 'radio' &&
        !!component.validate?.onlyAvailableItems &&
        component.dataSrc === 'values'
    );
}

function isValidateableSelectComponent(component: any): component is SelectComponent {
    return (
        component &&
        !!component.validate?.onlyAvailableItems &&
        component.type === 'select' &&
        component.dataSrc !== 'resource'
    );
}

export function mapDynamicValues<T extends Record<string, any>>(component: SelectComponent, values: T[]) {
    return values.map((value) => {
        if (component.valueProperty) {
            return value[component.valueProperty];
        }
        return value;
    });
}

function mapStaticValues(values: { label: string; value: string }[]) {
    return values.map((obj) => obj.value);
}

async function getAvailableSelectValues(component: SelectComponent, context: ValidationContext) {
    if (isUndefined(component.dataSrc) && component.data.hasOwnProperty('values')) {
        component.dataSrc = 'values';
    };
    switch (component.dataSrc) {
        case 'values':
            if (Array.isArray(component.data.values)) {
                return mapStaticValues(component.data.values);
            }
            throw new ProcessorError(
                `Failed to validate available values in static values select component '${component.key}': the values are not an array`,
                context,
                'validate:validateAvailableItems'
            );
        case 'json': {
            if (typeof component.data.json === 'string') {
                try {
                    return mapDynamicValues(component, JSON.parse(component.data.json));
                } catch (err) {
                    throw new ProcessorError(
                        `Failed to validate available values in JSON select component '${component.key}': ${err}`,
                        context,
                        'validate:validateAvailableItems'
                    );
                }
            } else if (Array.isArray(component.data.json)) {
                // TODO: need to retype this
                return mapDynamicValues(component, component.data.json as Record<string, any>[]);
            } else {
                throw new ProcessorError(
                    `Failed to validate available values in JSON select component '${component.key}': the values are not an array`,
                    context,
                    'validate:validateAvailableItems'
                );
            }
        }
        case 'custom':
            const customItems = Evaluator.evaluate(
                component.data.custom,
                {
                    values: [],
                },
                'values'
            );
            if (isPromise(customItems)) {
                const resolvedCustomItems = await customItems;
                if (Array.isArray(resolvedCustomItems)) {
                    return resolvedCustomItems;
                }
                throw new ProcessorError(
                    `Failed to validate available values in JSON select component '${component.key}': the values are not an array`,
                    context,
                    'validate:validateAvailableItems'
                );
            }
            if (Array.isArray(customItems)) {
                return customItems;
            } else {
                throw new ProcessorError(
                    `Failed to validate available values in JSON select component '${component.key}': the values are not an array`,
                    context,
                    'validate:validateAvailableItems'
                );
            }
        default:
            throw new ProcessorError(
                `Failed to validate available values in select component '${component.key}': data source ${component.dataSrc} is not valid}`,
                context,
                'validate:validateAvailableItems'
            );
    }
}

function getAvailableSelectValuesSync(component: SelectComponent, context: ValidationContext) {
    if (isUndefined(component.dataSrc) && component.data.hasOwnProperty('values')) {
        component.dataSrc = 'values';
    };
    switch (component.dataSrc) {
        case 'values':
            if (Array.isArray(component.data?.values)) {
                return mapStaticValues(component.data.values);
            }
            throw new ProcessorError(
                `Failed to validate available values in static values select component '${component.key}': the values are not an array`,
                context,
                'validate:validateAvailableItems'
            );
        case 'json': {
            if (typeof component.data.json === 'string') {
                try {
                    return mapDynamicValues(component, JSON.parse(component.data.json));
                } catch (err) {
                    throw new ProcessorError(
                        `Failed to validate available values in JSON select component '${component.key}': ${err}`,
                        context,
                        'validate:validateAvailableItems'
                    );
                }
            } else if (Array.isArray(component.data.json)) {
                // TODO: need to retype this
                return mapDynamicValues(component, component.data.json as Record<string, any>[]);
            } else {
                throw new ProcessorError(
                    `Failed to validate available values in JSON select component '${component.key}': the values are not an array`,
                    context,
                    'validate:validateAvailableItems'
                );
            }
        }
        case 'custom':
            const customItems = Evaluator.evaluate(
                component.data.custom,
                {
                    values: [],
                },
                'values'
            );
            if (Array.isArray(customItems)) {
                return customItems;
            } else {
                throw new ProcessorError(
                    `Failed to validate available values in JSON select component '${component.key}': the values are not an array`,
                    context,
                    'validate:validateAvailableItems'
                );
            }
        case 'url':
            return null;
        default:
            throw new ProcessorError(
                `Failed to validate available values in select component '${component.key}': data source ${component.dataSrc} is not valid}`,
                context,
                'validate:validateAvailableItems'
            );
    }
}

export function compareComplexValues(valueA: unknown, valueB: unknown, context: ValidationContext) {
    if (!isObject(valueA) || !isObject(valueB)) {
        return false;
    }

    try {
        // TODO: we need to have normalized values here at this moment, otherwise
        // this won't work
        return JSON.stringify(valueA) === JSON.stringify(valueB);
    } catch (err) {
        throw new ProcessorError(`Error while comparing available values: ${err}`, context, 'validate:validateAvailableItems');
    }
}

export const validateAvailableItems: RuleFn = async (context: ValidationContext) => {
    const { component, value } = context;
    const error = new FieldError('invalidOption', context, 'onlyAvailableItems');
    try {
        if (isValidatableRadioComponent(component)) {
            if (value == null || isEmpty(value)) {
                return null;
            }

            const values = component.values;
            if (values) {
                return values.findIndex(({ value: optionValue }) => optionValue === value) !== -1
                    ? null
                    : error;
            }

            return null;
        } else if (isValidateableSelectComponent(component)) {
            if (value == null || isEmpty(value)) {
                return null;
            }
            const values = await getAvailableSelectValues(component, context);
            if (values) {
                if (isObject(value)) {
                    return values.find((optionValue) => compareComplexValues(optionValue, value, context)) !==
                        undefined
                        ? null
                        : error;
                }

                return values.find((optionValue) => optionValue === value) !== undefined ? null : error;
            }
        }
    } catch (err: any) {
        throw new ProcessorError(err.message || err, context, 'validate:validateAvailableItems');
    }
    return null;
};

export const shouldValidate = (context: any) => {
    const { component, value } = context;
    if (value == null || isEmpty(value)) {
        return false;
    }
    if (isValidatableRadioComponent(component)) {
        return true;
    }
    if (isValidateableSelectComponent(component)) {
        return true;
    }
    return false;
}

export const validateAvailableItemsSync: RuleFnSync = (context: ValidationContext) => {
    const { component, value } = context;
    const error = new FieldError('invalidOption', context, 'onlyAvailableItems');
    try {
        if (!shouldValidate(context)) {
            return null;
        }
        if (isValidatableRadioComponent(component)) {
            const values = component.values;
            if (values) {
                return values.findIndex(({ value: optionValue }) => optionValue === value) !== -1
                    ? null
                    : error;
            }
            return null;
        } else if (isValidateableSelectComponent(component)) {
            const values = getAvailableSelectValuesSync(component, context);
            if (values) {
                if (isObject(value)) {
                    return values.find((optionValue) => compareComplexValues(optionValue, value, context)) !==
                        undefined
                        ? null
                        : error;
                }
                return values.find((optionValue) => optionValue === value) !== undefined ? null : error;
            }
        }
    } catch (err: any) {
        throw new ProcessorError(err.message || err, context, 'validate:validateAvailableItems');
    }
    return null;
};

export const validateAvailableItemsInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
    name: 'validateAvailableItems',
    process: validateAvailableItems,
    processSync: validateAvailableItemsSync,
    shouldProcess: shouldValidate
};
