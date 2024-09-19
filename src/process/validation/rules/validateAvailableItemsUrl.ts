import { isEmpty } from 'lodash';
import { FieldError, ProcessorError } from 'error';
import { RadioComponent, SelectComponent, RuleFn, RuleFnSync, ValidationContext, FetchFn, SelectBoxesComponent } from 'types';
import { isObject } from '../util';
import { ProcessorInfo } from 'types/process/ProcessorInfo';
import { compareComplexValues, mapDynamicValues } from './validateAvailableItems';
import { getErrorMessage } from 'utils/error';

function isValidatableRadioComponent(component: any): component is RadioComponent {
    return (
        component &&
        component.type === 'radio' &&
        !!component.validate?.onlyAvailableItems &&
        component.dataSrc === 'url'
    );
}

function isValidateableSelectComponent(component: any): component is SelectComponent {
    return (
        component &&
        !!component.validate?.onlyAvailableItems &&
        component.type === 'select' &&
        component.dataSrc === 'url'
    );
}

function isValidateableSelectBoxesComponent(component: any): component is SelectBoxesComponent {
    return (
        component &&
        !!component.validate?.onlyAvailableItems &&
        component.type === 'selectboxes' &&
        component.dataSrc === 'url'
    );
}

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
    if (isValidateableSelectBoxesComponent(component)) {
        return true;
    }
    return false;
}

const getAvailableValues = async (component: any, context: ValidationContext) => {
    let _fetch: FetchFn | null = null;
    try {
        _fetch = context.fetch ? context.fetch : fetch;
    }
    catch (err) {
        _fetch = null;
    }
    try {
        if (!_fetch) {
            console.log('You must provide a fetch interface to the fetch processor.');
            return null;
        }
        const response = await _fetch((component as any).data.url, { method: 'GET' });
        const data = await response.json();
        return data ? mapDynamicValues(component, data) : null;
    } 
    catch (err) {
        console.error(getErrorMessage(err));
        return null;
    }
}

export const validateAvailableItemsUrl: RuleFn = async (context: ValidationContext) => {
    const { component, value } = context;
    const error = new FieldError('invalidOption', context, 'onlyAvailableItemsURL');
    try {
        if (isValidatableRadioComponent(component)) {
            if (value == null || isEmpty(value)) {
                return null;
            }

            const values = await getAvailableValues(component, context);
            if (values) {
                return values.findIndex((optionValue) => optionValue === value) !== -1
                    ? null
                    : error;
            }

            return null;
        } else if (isValidateableSelectComponent(component)) {
            if (value == null || isEmpty(value)) {
                return null;
            }
            const values = await getAvailableValues(component, context);
            if (values) {
                if (isObject(value)) {
                    return values.find((optionValue) => compareComplexValues(optionValue, value, context)) !==
                        undefined
                        ? null
                        : error;
                }

                return values.find((optionValue) => optionValue === value) !== undefined ? null : error;
            }
        } else if (isValidateableSelectBoxesComponent(component)) {
            if (value == null || isEmpty(value)) {
                return null;
            }
            const values = await getAvailableValues(component, context);
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
        throw new ProcessorError(err.message || err, context, 'validate:validateAvailableItemsURL');
    }
    return null;
};

export const validateAvailableItemsUrlInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
    name: 'validateAvailableItemsUrl',
    process: validateAvailableItemsUrl,
    shouldProcess: shouldValidate,
}