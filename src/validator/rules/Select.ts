import { Evaluator } from '@formio/utils';
import { isEmpty, isBoolean, each } from '@formio/lodash';
import fetchPonyfill from 'fetch-ponyfill';
const { fetch, Headers, Request } = fetchPonyfill();

import { Rule } from './Rule';
export class SelectRule extends Rule {
  defaultMessage = '{{ field }} contains an invalid selection';
  public async check(value: any = this.component.dataValue, options: any = {}): Promise<boolean> {
    // Skip if value is empty
    if (!value || isEmpty(value)) {
      return true;
    }

    // Skip if no url provided.
    if (!this.settings) {
      return true;
    }

    const schema = this.component.component;

    // Initialize the request options
    const requestOptions: any = {
      url: this.settings,
      method: 'GET',
      qs: {},
      json: true,
      headers: {}
    };

    // If the url is a boolean value
    if (isBoolean(requestOptions.url)) {
      requestOptions.url = !!requestOptions.url;

      if (
        !requestOptions.url ||
        schema.dataSrc !== 'url' ||
        !schema.data.url ||
        !schema.searchField
      ) {
        return true;
      }

      // Get the validation url
      requestOptions.url = schema.data.url;

      // Add the search field
      requestOptions.qs[schema.searchField] = value;

      // Add the filters
      if (schema.filter) {
        requestOptions.url += (!requestOptions.url.includes('?') ? '?' : '&') + schema.filter;
      }

      // If they only wish to return certain fields.
      if (schema.selectFields) {
        requestOptions.qs.select = schema.selectFields;
      }
    }

    if (!requestOptions.url) {
      return true;
    }

    // Make sure to interpolate.
    requestOptions.url = Evaluator.interpolate(requestOptions.url, { data: this.component.data });

    // Add query string to URL
    const query: Array<any> = [];
    each(requestOptions.qs, (val: any, key: string) => {
      query.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
    });
    requestOptions.url += (requestOptions.url.includes('?') ? '&' : '?') + query.join('&');

    // Set custom headers.
    if (schema.data && schema.data.headers) {
      each(schema.data.headers, (header: any) => {
        if (header.key) {
          requestOptions.headers[header.key] = header.value;
        }
      });
    }

    // Set form.io authentication.
    if (schema.authenticate && options.token) {
      requestOptions.headers['x-jwt-token'] = options.token;
    }

    const resp = await fetch(new Request(requestOptions.url, {
      headers: new Headers(requestOptions.headers)
    }));
    const results = await resp.json();
    return results && results.length;
  }
};
