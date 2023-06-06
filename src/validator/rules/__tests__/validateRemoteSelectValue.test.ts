import fetchMock from 'jest-fetch-mock';
import _ from 'lodash';

import { simpleSelectOptions, simpleTextField } from 'test/fixtures/components';
import { validateRemoteSelectValue, generateUrl } from '../validateRemoteSelectValue';
import { FieldError } from '../../../error/FieldError';
import { DataObject } from '../../../types/DataObject';
import { SelectComponent } from '../../../types/Component';

beforeEach(() => {
    fetchMock.resetMocks();
});

test('Validating a component without the remote value validation parameter will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateRemoteSelectValue(component, data, {});
    expect(result).toBeNull();
});

test('Validating a select component without the remote value validation parameter will return null', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'url',
        data: {
            url: 'http://localhost:8080/numbers',
            headers: [],
        },
    };
    const data = {
        component: {
            id: 'b',
            value: 2,
        },
    };
    const result = await validateRemoteSelectValue(component, data, {});
    expect(result).toBeNull();
});

test('The remote value validation will generate the correct URL given a searchField and a valueProperty', async () => {
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'url',
        data: {
            url: 'http://localhost:8080/numbers',
            headers: [],
        },
        searchField: 'number',
        valueProperty: 'value',
        validate: { select: true },
    };
    const data: DataObject = {
        component: {
            id: 'b',
            value: 2,
        },
    };
    const value = _.get(data, component.key);

    if (!component.data || !component.data.url) {
        throw new Error('Component passed to remote validation testing does not contain a URL');
    }
    const baseUrl = new URL(component.data.url);
    const result = generateUrl(baseUrl, component, value);
    expect(result).toBeInstanceOf(URL);
    expect(result.href).toBe(`http://localhost:8080/numbers?number=2`);
});

test('Validating a select component with the remote validation parameter will return a FieldError if the value does not exist and the API returns an array', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'url',
        data: {
            url: 'http://localhost:8080/numbers',
            headers: [],
        },
        searchField: 'number',
        valueProperty: 'value',
        validate: { select: true },
    };

    const data = {
        component: {
            id: 'b',
            value: 2,
        },
    };
    const result = await validateRemoteSelectValue(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('contains an invalid selection');
});

test('Validating a select component with the remote validation parameter will return a FieldError if the value does not exist and the API returns an object', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'url',
        data: {
            url: 'http://localhost:8080/numbers',
            headers: [],
        },
        searchField: 'number',
        valueProperty: 'value',
        validate: { select: true },
    };
    const data = {
        component: {
            id: 'b',
            value: 2,
        },
    };
    const result = await validateRemoteSelectValue(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toContain('contains an invalid selection');
});

test('Validating a select component with the remote validation parameter will return null if the value exists', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ id: 'b', value: 2 }]));
    const component: SelectComponent = {
        ...simpleSelectOptions,
        dataSrc: 'url',
        data: {
            url: 'http://localhost:8080/numbers',
            headers: [],
        },
        searchField: 'number',
        valueProperty: 'value',
        validate: { select: true },
    };
    const data = {
        component: {
            id: 'b',
            value: 2,
        },
    };
    const result = await validateRemoteSelectValue(component, data, {});
    expect(result).toBeNull();
});
