import { get, set } from 'lodash';
import { ProcessorsContext, ProcessorType } from 'types';
import { getModelType } from 'utils/formUtil';

export function contextValue<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
  const { component, paths, local, path } = context;
  if (typeof context.value === 'undefined') {
    const dataPath = local ? paths?.localDataPath || path : paths?.dataPath || path;
    Object.defineProperty(context, 'value', {
      enumerable: true,
      get() {
        const modelType = getModelType(component);
        if (!component.type || modelType === 'none' || modelType === 'content') {
          return undefined;
        }
        return get(context.data, dataPath);
      },
      set(newValue: any) {
        const modelType = getModelType(component);
        if (!component.type || modelType === 'none' || modelType === 'content') {
          // Do not set the value if the model type is 'none' or 'content'
          return;
        }
        set(context.data, dataPath, newValue);
      },
    });
  }
}

export async function processOne<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
  const { processors } = context;
  contextValue(context);
  context.processor = ProcessorType.Custom;
  for (const processor of processors) {
    if (processor?.process) {
      await processor.process(context);
    }
  }
}

export function processOneSync<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
  const { processors } = context;
  contextValue(context);
  context.processor = ProcessorType.Custom;
  for (const processor of processors) {
    if (processor?.processSync) {
      processor.processSync(context);
    }
  }
}

export async function postProcessOne<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
  const { processors } = context;
  contextValue(context);
  context.processor = ProcessorType.Custom;
  for (const processor of processors) {
    if (processor?.postProcess) {
      await processor.postProcess(context);
    }
  }
}

export function postProcessOneSync<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
  const { processors } = context;
  contextValue(context);
  context.processor = ProcessorType.Custom;
  for (const processor of processors) {
    if (processor?.postProcessSync) {
      processor.postProcessSync(context);
    }
  }
}
