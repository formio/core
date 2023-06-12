import _ from 'lodash';

import { FieldError } from 'error';
import { TextAreaComponent, TextFieldComponent, RuleFn, ProcessType } from 'types';
import { getComponentErrorField } from 'validation/util';

const isValidatableTextFieldComponent = (
    component: any
): component is TextFieldComponent | TextAreaComponent => {
    return component && component.validate?.hasOwnProperty('pattern');
};

export const validateRegexPattern: RuleFn = async (component, data, config) => {
    if (!isValidatableTextFieldComponent(component)) {
        return null;
    }
    const value = _.get(data, component.key);

    const pattern = component.validate?.pattern;
    if (!pattern) {
        return null;
    }
    const regex = new RegExp(`^${pattern}$`);
    return typeof value === 'string' && regex.test(value)
        ? null
        : new FieldError({
              component,
              errorKeyOrMessage: 'regex',
              field: getComponentErrorField(component),
              context: config?.context,
          });
};
