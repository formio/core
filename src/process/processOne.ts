import { get, set } from 'lodash';
import { ProcessorsContext, ProcessorType } from 'types';

export async function processOne<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
  const { processors, row, component } = context;
  // Create a getter for `value` that is always derived from the current data object
  if (typeof context.value === 'undefined') {
    Object.defineProperty(context, 'value', {
      enumerable: true,
      get() {
        if (
          !component.type ||
          component.modelType === 'none' ||
          component.modelType === 'content'
        ) {
          return undefined;
        }
        return get(context.data, context.path);
      },
      set(newValue: any) {
        if (
          !component.type ||
          component.modelType === 'none' ||
          component.modelType === 'content'
        ) {
          // Do not set the value if the model type is 'none' or 'content'
          return;
        }
        set(context.data, context.path, newValue);
      },
    });
  }

  if (!row) {
    return;
  }
  context.processor = ProcessorType.Custom;
  for (const processor of processors) {
    if (processor?.process) {
      await processor.process(context);
    }
  }
}

export function processOneSync<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
  const { processors, row, component } = context;
  // Create a getter for `value` that is always derived from the current data object
  if (typeof context.value === 'undefined') {
    Object.defineProperty(context, 'value', {
      enumerable: true,
      get() {
        if (
          !component.type ||
          component.modelType === 'none' ||
          component.modelType === 'content'
        ) {
          return undefined;
        }
        return get(context.data, context.path);
      },
      set(newValue: any) {
        if (
          !component.type ||
          component.modelType === 'none' ||
          component.modelType === 'content'
        ) {
          // Do not set the value if the model type is 'none' or 'content'
          return;
        }
        set(context.data, context.path, newValue);
      },
    });
  }

  if (!row) {
    return;
  }

  // Process the components.
  context.processor = ProcessorType.Custom;
  for (const processor of processors) {
    if (processor?.processSync) {
      processor.processSync(context);
    }
  }
}
