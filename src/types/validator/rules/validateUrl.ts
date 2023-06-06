import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { UrlComponent } from '../../types/Component';
import { RuleFn } from '../../types/RuleFn';
import { getErrorMessage } from '../../validator/util';

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

export const validateUrl: RuleFn = async (component, data) => {
    if (!isUrlComponent(component)) {
        return null;
    }
    const value = _.get(data, component.key);
    if (!value) {
        return null;
    }
    const error = new FieldError(component, getErrorMessage(component, 'must be a valid URL'));
    if (typeof value !== 'string') {
        return error;
    }
    return isValidUrlAndProtocol(value) ? null : error;
};
