import { get, set } from 'lodash';
import { Component, ProcessorsContext, ProcessorType } from 'types';
import { getComponentKey } from 'utils/formUtil';
import { resetEphermalState } from 'utils';

export function dataValue(component: Component, row: any) {
  const key = getComponentKey(component);
  return key ? get(row, key) : undefined;
}

export async function processOne<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
  const { processors, component, path } = context;
  // Create a getter for `value` that is always derived from the current data object
  if (typeof context.value === 'undefined') {
    Object.defineProperty(context, 'value', {
      enumerable: true,
      get() {
        return get(context.data, context.path);
      },
      set(newValue: any) {
        set(context.data, context.path, newValue);
      },
    });
  }

  // Define the component path
  Object.defineProperty(component, 'path', {
    enumerable: false,
    writable: true,
    value: path,
  });

  // If the component has ephemeral state, then we need to reset it in case this is e.g. a data grid,
  // in which each row needs to be validated independently
  resetEphermalState(component);
  context.processor = ProcessorType.Custom;
  for (const processor of processors) {
    if (processor?.process) {
      await processor.process(context);
    }
  }
}

export function processOneSync<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
  const { processors, component, path } = context;
  // Create a getter for `value` that is always derived from the current data object
  if (typeof context.value === 'undefined') {
    Object.defineProperty(context, 'value', {
      enumerable: true,
      get() {
        return get(context.data, context.path);
      },
      set(newValue: any) {
        set(context.data, context.path, newValue);
      },
    });
  }

  // Define the component path
  Object.defineProperty(component, 'path', {
    enumerable: false,
    writable: true,
    value: path,
  });

  // If the component has ephemeral state, then we need to reset the ephemeral state in case this is e.g. a data grid, in which each row needs to be validated independently
  resetEphermalState(component);
  context.processor = ProcessorType.Custom;
  for (const processor of processors) {
    if (processor?.processSync) {
      processor.processSync(context);
    }
  }
}
