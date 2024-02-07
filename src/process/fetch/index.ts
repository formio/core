import { ProcessorFn, ProcessorInfo, FetchContext, FetchScope, FetchFn } from 'types';
import get from 'lodash/get';
import set from 'lodash/set';
import { Evaluator } from 'utils';
import { getComponentKey } from 'utils/formUtil';

export const shouldFetch = (context: FetchContext): boolean => {
    const { component } = context;
    if (component.type !== 'datasource' || !get(component, 'trigger.server', false)) {
        return false;
    }
    return true;
};

export const fetchProcess: ProcessorFn<FetchScope> = async (context: FetchContext) => {
    const { component, row, evalContext, path, scope } = context;
    let _fetch: FetchFn | null = null;
    try {
        _fetch = context.fetch ? context.fetch : fetch;
    }
    catch (err) {
        _fetch = null;
    }
    if (!_fetch) {
        console.log('You must provide a fetch interface to the fetch processor.');
        return;
    }
    if (!shouldFetch(context)) {
        return;
    }
    if (!scope.fetched) scope.fetched = [];
    const evalContextValue = evalContext ? evalContext(context) : context;
    const url = Evaluator.interpolateString(get(component, 'fetch.url', ''), evalContextValue);
    if (!url) {
        return;
    }
    const request: any = {
        method: get(component, 'fetch.method', 'get').toUpperCase(),
        headers: {}
    };
    get(component, 'fetch.headers', []).map((header: any) => {
        header.value = Evaluator.interpolateString(header.value, evalContextValue);
        if (header.value && header.key) {
            request.headers[header.key] = header.value;
        }
        return header;
    });
    if (context.headers && get(component, 'fetch.authenticate', false)) {
        if (context.headers['x-jwt-token']) {
            request.headers['x-jwt-token'] = context.headers['x-jwt-token'];
        }
        if (context.headers['x-remote-token']) {
            request.headers['x-remote-token'] = context.headers['x-remote-token'];
        }
    }

    const body = get(component, 'fetch.specifyBody', '');
    if (request.method === 'POST') {
        request.body = JSON.stringify(Evaluator.evaluate(body, evalContextValue, 'body'));
    }

    try {
        // Perform the fetch.
        const result = await (await _fetch(url, request)).json();
        const mapFunction = get(component, 'fetch.mapFunction');

        // Set the row data of the fetched value.
        const key = getComponentKey(component);
        set(row, key, mapFunction ? Evaluator.evaluate(mapFunction, {
            ...evalContextValue, 
            ...{responseData: result}
        }, 'value') : result);
        scope.fetched.push({
            path,
            value: get(row, key)
        });
    }
    catch (err: any) {
        console.log(err.message);
    }
};

export const fetchProcessInfo: ProcessorInfo<FetchContext, void> = {
    name: 'fetch',
    process: fetchProcess,
    shouldProcess: shouldFetch,
};