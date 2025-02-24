import { get } from 'lodash';
import { Component, DataObject, ProcessorType, ValidationContext } from 'types';

export const generateProcessorContext = (
  component: Component,
  data: DataObject,
  form?: any,
): ValidationContext => {
  const path = component.key;
  const value = get(data, path);
  return {
    component,
    data,
    form: form ? form : { components: [component] },
    scope: { errors: [] },
    row: data,
    paths: {
      path: component.key,
      localPath: component.key,
      fullPath: component.key,
      fullLocalPath: component.key,
    },
    path: component.key,
    value,
    config: {
      server: true,
    },
    fetch: () => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
        text: () => Promise.resolve(''),
      });
    },
    processor: ProcessorType.Validate,
  };
};
