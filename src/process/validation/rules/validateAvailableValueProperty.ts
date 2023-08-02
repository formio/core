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

export const validateAvailableValueProperty: RuleFn = async (context) => {
    return validateAvailableValuePropertySync(context);
};

export const validateAvailableValuePropertySync: RuleFnSync = (context) => {
    const { component, value } = context;
    if (!isValidatableListComponent(component)) {
        return null;
    }
    const error = new FieldError('invalidValueProperty', context);
    if (component.dataSrc === 'url' && (_.isUndefined(value) || _.isObject(value))) {
        return error;
    }
    return null;
};
