import { expect } from 'chai';
import { get } from 'lodash';
import { DataObject, SelectComponent } from 'types';
import { FieldError } from 'error';
import { simpleSelectOptions, simpleTextField } from './fixtures/components';
import { generateProcessContext } from './fixtures/util';
import { validateRemoteSelectValue, generateUrl } from '../validateRemoteSelectValue';

it('Validating a component without the remote value validation parameter will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessContext(component, data);
    const result = await validateRemoteSelectValue(context);
    expect(result).to.equal(null);
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
    const context = generateProcessContext(component, data);
    const result = await validateRemoteSelectValue(context);
    expect(result).to.equal(null);
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
    const value = get(data, component.key);

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
    const context = generateProcessContext(component, data);
    const result = await validateRemoteSelectValue(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('select');
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
    const context = generateProcessContext(component, data);
    const result = await validateRemoteSelectValue(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('select');
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

    const context = generateProcessContext(component, data);
    context.fetch = (url: string, options?: RequestInit | undefined) => {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 'b', value: 2 }])
        });
    };
    const result = await validateRemoteSelectValue(context);
    expect(result).to.equal(null);
});
