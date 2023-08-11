import _ from 'lodash';

import { FieldError } from 'error';
import { ListComponent, RuleFn, RuleFnSync } from 'types';

const isValidatableListComponent = (comp: any): comp is ListComponent => {
    return (
        comp &&
        comp.type &&
        (comp.type === "radio" ||
            comp.type === "selectboxes" ||
            comp.type === "select")
    );
};

export const validateValueProperty: RuleFn = async (context) => {
    return validateValuePropertySync(context);
};

export const validateValuePropertySync: RuleFnSync = (context) => {
    const { component, value } = context;
    if (!isValidatableListComponent(component)) {
        return null;
    }
    if (!value || (typeof value === 'object' && _.isEmpty(value))) {
        return null;
    }
    const valueProperty = component.valueProperty;
    if (!valueProperty) {
        return null;
    }
    const error = new FieldError('invalidValueProperty', context);
    if (component.dataSrc === 'url') {
        // TODO: at some point in the radio component's change pipeline, object values are coerced into strings; testing for
        // '[object Object]' is an ugly way to determine whether or not the ValueProperty is invalid, but it'll have to do
        // for now
        if (component.inputType === 'radio' && (_.isUndefined(value) || _.isObject(value) || value === '[object Object]')) {
            return error;
        }
        // TODO: a cousin to the above issue, but sometimes ValueProperty will resolve to a boolean value so the keys in
        // e.g. SelectBoxes components will strings coerced from booleans; again, not pretty, but good enough for now
        else if (component.inputType !== 'radio') {
            if (Object.entries(value).some(([key, value]) => value && (key === '[object Object]' || key === 'true' || key === 'false'))) {
                return error;
            }
        }
    }
    return null;
};
