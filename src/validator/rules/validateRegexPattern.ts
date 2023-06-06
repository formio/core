import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { TextAreaComponent, TextFieldComponent } from '../../types/Component';
import { RuleFn } from '../../types/RuleFn';
import { getErrorMessage } from '../util';

const isValidatableTextFieldComponent = (
    component: any
): component is TextFieldComponent | TextAreaComponent => {
    return component && component.validate?.hasOwnProperty('pattern');
};

export const validateRegexPattern: RuleFn = async (component, data) => {
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
        : new FieldError(
              component,
              getErrorMessage(component, `does not match the regular expression pattern ${pattern}`)
          );
};
