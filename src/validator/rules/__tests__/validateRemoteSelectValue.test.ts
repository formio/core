import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import _ from 'lodash';

import { simpleSelectOptions, simpleTextField } from './fixtures/components';
import { validateRemoteSelectValue, generateUrl } from '../validateRemoteSelectValue';
import { FieldError } from '../../../error/FieldError';
import { DataObject } from '../../../types/DataObject';
import { SelectComponent } from '../../../types/Component';

beforeEach(() => {
    fetchMock.reset();
});

it('Validating a component without the remote value validation parameter will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateRemoteSelectValue(component, data, {});
    expect(result).to.equal(null);;
});

it('Validating a select component without the remote value validation parameter will return null', async () => {
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
    expect(result).to.equal(null);;
});

it('The remote value validation will generate the correct URL given a searchField and a valueProperty', async () => {
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
    expect(result).to.be.instanceOf(URL);
    expect(result.href).to.equal(`http://localhost:8080/numbers?number=2`);
});

it('Validating a select component with the remote validation parameter will return a FieldError if the value does not exist and the API returns an array', async () => {
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
    fetchMock.mock(component.data.url, JSON.stringify({}), {query: { [component.searchField!]: data.component.value }});

    const result = await validateRemoteSelectValue(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.message).to.contain('contains an invalid selection');
});

it('Validating a select component with the remote validation parameter will return a FieldError if the value does not exist and the API returns an object', async () => {
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
    fetchMock.mock(component.data.url, JSON.stringify({}), {query: { [component.searchField!]: data.component.value }});
    const result = await validateRemoteSelectValue(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.message).to.contain('contains an invalid selection');
});

it('Validating a select component with the remote validation parameter will return null if the value exists', async () => {
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
    fetchMock.mock(component.data.url, JSON.stringify([{ id: 'b', value: 2 }]), {query: { [component.searchField!]: data.component.value }});
    const result = await validateRemoteSelectValue(component, data, {});
    expect(result).to.equal(null);;
});
