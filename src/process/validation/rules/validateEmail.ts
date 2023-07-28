import _ from 'lodash';

import { FieldError } from 'error';
import { EmailComponent, RuleFn } from 'types';

const isValidatableEmailComponent = (component: any): component is EmailComponent => {
    return component && component.type === 'email';
};

export const validateEmail: RuleFn = async (context) => {
    const error = new FieldError('invalid_email', context);
    const { component, value } = context;
    if (!value) {
        return null;
    }
    if (!isValidatableEmailComponent(component)) {
        return null;
    }

    // From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Allow emails to be valid if the component is pristine and no value is provided.
    if (typeof value === 'string' && !emailRegex.test(value)) {
        return error;
    }
    return null;
};
