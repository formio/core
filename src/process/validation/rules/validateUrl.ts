import _ from 'lodash';

import { FieldError } from 'error';
import { UrlComponent, RuleFn, RuleFnSync } from 'types';

const isUrlComponent = (component: any): component is UrlComponent => {
    return component && component.type === 'url';
};

const isValidUrlAndProtocol = (url: string) => {
    let urlObj;
    try {
        urlObj = new URL(url);
    } catch (e) {
        return false;
    }
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
};


export const validateUrlSync: RuleFnSync = (context) => {
    const { component, value } = context;
    if (!isUrlComponent(component)) {
        return null;
    }
    if (!value) {
        return null;
    }
    const error = new FieldError('invalid_url', context);
    if (typeof value !== 'string') {
        return error;
    }
    // From https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url
    const re = /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    // From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Allow urls to be valid if the component is pristine and no value is provided.
    return (re.test(value) && !emailRe.test(value)) ? null : error;
    // return isValidUrlAndProtocol(value) ? null : error;
};

export const validateUrl: RuleFn = async (context) => {
    return validateUrlSync(context);
};
