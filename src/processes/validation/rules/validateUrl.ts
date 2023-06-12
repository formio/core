import _ from 'lodash';

import { FieldError } from 'error';
import { UrlComponent, RuleFn, ProcessType } from 'types';
import { getComponentErrorField } from 'validation/util';

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

export const validateUrl: RuleFn = async (component, data, config) => {
    if (!isUrlComponent(component)) {
        return null;
    }
    const value = _.get(data, component.key);
    if (!value) {
        return null;
    }
    const error = new FieldError({component, errorKeyOrMessage: 'invalidUrl', field: getComponentErrorField(component), context: config?.context});
    if (typeof value !== 'string') {
        return error;
    }
    return isValidUrlAndProtocol(value) ? null : error;
};
