import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { SelectComponent } from '../../types/Component';
import { RuleFn } from '../../types/RuleFn';
import { getErrorMessage, isEmptyObject, toBoolean } from '../../validator/util';

const isValidatableSelectComponent = (component: any): component is SelectComponent => {
    return (
        component &&
        component.type === 'select' &&
        toBoolean(component.dataSrc === 'url') &&
        toBoolean(component.validate?.select)
    );
};

export const generateUrl = (baseUrl: URL, component: SelectComponent, value: any) => {
    const url = baseUrl;
    const query = url.searchParams;
    if (component.searchField) {
        if (component.valueProperty) {
            query.set(component.searchField, JSON.stringify(value[component.valueProperty]));
        } else {
            query.set(component.searchField, JSON.stringify(value));
        }
    }
    if (component.selectFields) {
        query.set('select', component.selectFields);
    }
    if (component.sort) {
        query.set('sort', component.sort);
    }
    if (component.filter) {
        const filterQueryStrings = new URLSearchParams(component.filter);
        filterQueryStrings.forEach((value, key) => query.set(key, value));
    }
    return url;
};

export const validateRemoteSelectValue: RuleFn = async (component, data, config) => {
    // Only run this validation if server-side
    if (typeof window !== 'undefined') {
        return null;
    }

    if (!isValidatableSelectComponent(component)) {
        return null;
    }

    const value = _.get(data, component.key);

    if (
        !value ||
        isEmptyObject(value) ||
        (Array.isArray(value) && (value as Array<Record<string, any>>).length === 0)
    ) {
        return null;
    }

    // If given an invalid configuration, do not validate the remote value
    if (component.dataSrc !== 'url' || !component.data?.url || !component.searchField) {
        return null;
    }

    const baseUrl = new URL(
        config.evaluator
            ? config.evaluator.interpolate(component.data.url, data, {})
            : component.data.url
    );
    const url = generateUrl(baseUrl, component, value);
    const headers: Record<string, string> = component.data.headers
        ? component.data.headers.reduce(
              (acc, header) => ({ ...acc, [header.key]: header.value }),
              {}
          )
        : {};

    // Set form.io authentication
    if (component.authenticate && config.token) {
        headers['x-jwt-token'] = config.token;
    }

    try {
        const response = await fetch(url.toString(), { method: 'GET', headers });
        // TODO: should we always expect JSON here?
        if (response.ok) {
            const data = await response.json();
            const error = new FieldError(
                component,
                getErrorMessage(component, 'contains an invalid selection')
            );
            if (Array.isArray(data)) {
                return data && data.length ? null : error;
            }
            return data ? (isEmptyObject(data) ? error : null) : error;
        }
        const data = await response.text();
        return new FieldError(
            component,
            getErrorMessage(component, `returned an error while validating remote value: ${data}`)
        );
    } catch (err) {
        const error = new FieldError(
            component,
            getErrorMessage(component, `returned an error while validating remote value: ${err}`)
        );
        return error;
    }
};
