import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleUrlField } from './fixtures/components';
import { validateUrl } from '../validateUrl';

it('Validating a URL component whose data contains an invalid URL returns a FieldError', async () => {
    const component = simpleUrlField;
    const data = {
        component: 'htp:/ww.google',
    };
    const result = await validateUrl(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('invalidUrl');
});

it('Validating a URL component whose data contains an invalid URL returns a FieldError', async () => {
    const component = simpleUrlField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateUrl(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('invalidUrl');
});

it('Validating a URL component whose data contains an valid URL that is not HTTP or HTTPS returns a FieldError', async () => {
    const component = simpleUrlField;
    const data = {
        component: 'ftp://www.google.com',
    };
    const result = await validateUrl(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('invalidUrl');
});

it('Validating a URL component whose data contains an valid URL that is not HTTP or HTTPS returns a FieldError', async () => {
    const component = simpleUrlField;
    const data = {
        component: 'mailto://www.google.com',
    };
    const result = await validateUrl(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('invalidUrl');
});

it('Validating a URL component whose data contains a valid HTTPS URL returns null', async () => {
    const component = simpleUrlField;
    const data = {
        component: 'https://www.google.com',
    };
    const result = await validateUrl(component, data, {});
    expect(result).to.equal(null);
});

it('Validating a URL component whose data contains a valid HTTP URL returns null', async () => {
    const component = simpleUrlField;
    const data = {
        component: 'http://www.google.com',
    };
    const result = await validateUrl(component, data, {});
    expect(result).to.equal(null);
});

it('Validating a URL component whose data contains a valid localhost URL returns null', async () => {
    const component = simpleUrlField;
    const data = {
        component: 'http://localhost:3000',
    };
    const result = await validateUrl(component, data, {});
    expect(result).to.equal(null);
});
