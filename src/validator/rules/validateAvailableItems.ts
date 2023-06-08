import _ from 'lodash';

import { FieldError } from 'error/FieldError';
import { ValidatorError } from 'error/ValidatorError';
import { Evaluator } from 'utils';
import { RadioComponent, SelectComponent } from '../../types/Component';
import { RuleFn } from '../../types';
import { getErrorMessage, isObject, isPromise, toBoolean } from '../util';

function isValidatableRadioComponent(component: any): component is RadioComponent {
    return (
        component &&
        !!component.validate?.hasOwnProperty('onlyAvailableItems') &&
        component.type === 'radio'
    );
}

function isValidateableSelectComponent(component: any): component is SelectComponent {
    return (
        component &&
        !!component.validate?.hasOwnProperty('onlyAvailableItems') &&
        component.type === 'select'
    );
}

function mapDynamicValues<T extends Record<string, any>>(component: SelectComponent, values: T[]) {
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

async function getAvailableValues(component: SelectComponent) {
    switch (component.dataSrc) {
        case 'values':
            if (Array.isArray(component.data.values)) {
                return mapStaticValues(component.data.values);
            }
            throw new ValidatorError(
                `Failed to validate available values in static values select component: the values are not an array`
            );
        case 'json': {
            if (typeof component.data.json === 'string') {
                try {
                    return mapDynamicValues(component, JSON.parse(component.data.json));
                } catch (err) {
                    throw new ValidatorError(
                        `Failed to validate available values in JSON select component: ${err}`
                    );
                }
            } else if (Array.isArray(component.data.json)) {
                // TODO: need to retype this
                return mapDynamicValues(component, component.data.json as Record<string, any>[]);
            } else {
                throw new ValidatorError(
                    `Failed to validate available values in JSON select component: the values are not an array`
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
                throw new ValidatorError(
                    `Failed to validate available values in JSON select component: the values are not an array`
                );
            }
            if (Array.isArray(customItems)) {
                return customItems;
            } else {
                throw new ValidatorError(
                    `Failed to validate available values in JSON select component: the values are not an array`
                );
            }
        default:
            throw new ValidatorError(
                `Failed to validate available values in select component: data source ${component.dataSrc} is not valid}`
            );
    }
}

function compareComplexValues(valueA: unknown, valueB: unknown) {
    if (!isObject(valueA) || !isObject(valueB)) {
        return false;
    }

    try {
        // TODO: we need to have normalized values here at this moment, otherwise
        // this won't work
        return JSON.stringify(valueA) === JSON.stringify(valueB);
    } catch (err) {
        throw new ValidatorError(`Error while comparing available values: ${err}`);
    }
}

export const validateAvailableItems: RuleFn = async (component, data, config) => {
    const error = new FieldError(component, getErrorMessage(component, 'is an invalid option'));
    if (isValidatableRadioComponent(component)) {
        const value = _.get(data, component.key);
        if (!value) {
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
        const value = _.get(data, component.key);
        if (!value) {
            return null;
        }
        const values = await getAvailableValues(component);
        if (values) {
            if (isObject(value)) {
                return values.find((optionValue) => compareComplexValues(optionValue, value)) !==
                    undefined
                    ? null
                    : error;
            }

            return values.find((optionValue) => optionValue === value) !== undefined ? null : error;
        }
    }
    return null;
};
