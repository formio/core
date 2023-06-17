import _ from 'lodash';

import { FieldError } from 'error';
import { UrlComponent, RuleFn } from 'types';

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

export const validateUrl: RuleFn = async (context) => {
    const { component, data, path } = context;
    if (!isUrlComponent(component)) {
        return null;
    }
    const value = _.get(data, path);
    if (!value) {
        return null;
    }
    const error = new FieldError('invalidUrl', context);
    if (typeof value !== 'string') {
        return error;
    }
    return isValidUrlAndProtocol(value) ? null : error;
};
