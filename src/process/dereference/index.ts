import { ProcessorError } from 'error';
import {
  ProcessorFn,
  ProcessorScope,
  ProcessorContext,
  ProcessorInfo,
  Component,
  DataTableComponent,
} from 'types';
import { fastCloneDeep } from 'utils';

type DereferenceScope = ProcessorScope & {
  dereference: {
    [path: string]: Component[];
  };
};

const isDereferenceableDataTableComponent = (component: any): component is DataTableComponent => {
  return (
    component &&
    component.type === 'datatable' &&
    component.fetch?.enableFetch === true &&
    component.fetch?.dataSrc === 'resource' &&
    typeof component.fetch?.resource === 'string'
  );
};

/**
 * This function is used to dereference reference IDs contained in the form.
 * It is currently only compatible with Data Table components.
 * @todo Add support for other components (if applicable) and for submission data dereferencing (e.g. save-as-reference, currently a property action).
 */
export const dereferenceProcess: ProcessorFn<DereferenceScope> = async (context) => {
  const { component, config, scope, path } = context;
  if (!scope.dereference) {
    scope.dereference = {};
  }
  if (!isDereferenceableDataTableComponent(component)) {
    return;
  }
  if (!config?.database) {
    throw new ProcessorError(
      'Cannot dereference resource value without a database config object',
      context,
      'dereference',
    );
  }

  try {
    const components = await config.database?.dereferenceDataTableComponent(component);
    const vmCompatibleComponents = fastCloneDeep(components);
    scope.dereference[path] = vmCompatibleComponents;
    // Modify the components in place; we have to do this now as opposed to a "post-processor" step because
    // eachComponentDataAsync will immediately turn around and introspect these components in the case of Data Table
    component.components = vmCompatibleComponents;
  } catch (err: any) {
    throw new ProcessorError(err.message || err, context, 'dereference');
  }
};

export const dereferenceProcessInfo: ProcessorInfo<ProcessorContext<DereferenceScope>, void> = {
  name: 'dereference',
  shouldProcess: () => true,
  process: dereferenceProcess,
};
