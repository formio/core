import { get, set } from 'lodash';
import { ProcessorsContext, ProcessorType } from 'types';
import { getModelType } from 'utils/formUtil';

export async function processOne<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
  const { processors, component } = context;
  // Create a getter for `value` that is always derived from the current data object
  if (typeof context.value === 'undefined') {
    Object.defineProperty(context, 'value', {
      enumerable: true,
      get() {
        const modelType = getModelType(component);
        if (!component.type || modelType === 'none' || modelType === 'content') {
          return undefined;
        }
        return get(context.data, context.path);
      },
      set(newValue: any) {
        const modelType = getModelType(component);
        if (!component.type || modelType === 'none' || modelType === 'content') {
          // Do not set the value if the model type is 'none' or 'content'
          return;
        }
        set(context.data, context.path, newValue);
      },
    });
  }

  context.processor = ProcessorType.Custom;
  for (const processor of processors) {
    if (processor?.process) {
      await processor.process(context);
    }
  }
}

export function processOneSync<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
  const { processors, component } = context;
  // Create a getter for `value` that is always derived from the current data object
  if (typeof context.value === 'undefined') {
    Object.defineProperty(context, 'value', {
      enumerable: true,
      get() {
        const modelType = getModelType(component);
        if (!component.type || modelType === 'none' || modelType === 'content') {
          return undefined;
        }
        return get(context.data, context.path);
      },
      set(newValue: any) {
        const modelType = getModelType(component);
        if (!component.type || modelType === 'none' || modelType === 'content') {
          // Do not set the value if the model type is 'none' or 'content'
          return;
        }
        set(context.data, context.path, newValue);
      },
    });
  }

  // Process the components.
  context.processor = ProcessorType.Custom;
  for (const processor of processors) {
    if (processor?.processSync) {
      processor.processSync(context);
    }
  }
}
