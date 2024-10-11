import { FieldError, ProcessorError } from 'error';
import { SelectComponent, RuleFn, ValidationContext, FetchFn } from 'types';
import { Evaluator } from 'utils';
import { isEmptyObject, toBoolean } from '../util';
import { getErrorMessage } from 'utils/error';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

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
    let searchValue = value;
    if (component.valueProperty) {
      searchValue = value[component.valueProperty];
    } else {
      searchValue = value;
    }
    query.set(
      component.searchField,
      typeof searchValue === 'string' ? searchValue : JSON.stringify(searchValue),
    );
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

export const shouldValidate = (context: ValidationContext) => {
  const { component, value, config } = context;
  // Only run this validation if server-side
  if (!config?.server) {
    return false;
  }
  if (!isValidatableSelectComponent(component)) {
    return false;
  }
  if (
    !value ||
    isEmptyObject(value) ||
    (Array.isArray(value) && (value as Array<Record<string, any>>).length === 0)
  ) {
    return false;
  }

  // If given an invalid configuration, do not validate the remote value
  if (component.dataSrc !== 'url' || !component.data?.url || !component.searchField) {
    return false;
  }

  return true;
};

export const validateUrlSelectValue: RuleFn = async (context: ValidationContext) => {
  const { component, value, data, config } = context;
  let _fetch: FetchFn | null = null;
  try {
    _fetch = context.fetch ? context.fetch : fetch;
  } catch (ignoreError) {
    _fetch = null;
  }
  try {
    if (!_fetch) {
      console.log('You must provide a fetch interface to the fetch processor.');
      return null;
    }
    if (!shouldValidate(context)) {
      return null;
    }

    const baseUrl = new URL(
      Evaluator
        ? Evaluator.interpolate((component as any).data.url, data, {})
        : (component as any).data.url,
    );
    const url = generateUrl(baseUrl, component as SelectComponent, value);
    const headers: Record<string, string> = (component as any).data.headers
      ? (component as any).data.headers.reduce(
          (acc: any, header: any) => ({ ...acc, [header.key]: header.value }),
          {},
        )
      : {};

    // Set form.io authentication
    if ((component as SelectComponent).authenticate && config && config.tokens) {
      Object.assign(headers, config.tokens);
    }

    try {
      const response = await _fetch(url.toString(), { method: 'GET', headers });
      // TODO: should we always expect JSON here?
      if (response.ok) {
        const data = await response.json();
        const error = new FieldError('select', context);
        if (Array.isArray(data)) {
          return data && data.length ? null : error;
        }
        return data ? (isEmptyObject(data) ? error : null) : error;
      }
      const data = await response.text();
      throw new ProcessorError(
        `Component with path ${component.key} returned an error while validating remote value: ${data}`,
        context,
        'validate:validateRemoteSelectValue',
      );
    } catch (err) {
      throw new ProcessorError(
        `Component with path ${component.key} returned an error while validating remote value: ${err}`,
        context,
        'validate:validateRemoteSelectValue',
      );
    }
  } catch (err) {
    console.error(getErrorMessage(err));
    return null;
  }
};

export const validateUrlSelectValueInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateUrlSelectValue',
  process: validateUrlSelectValue,
  shouldProcess: shouldValidate,
};
