import { ProcessorError } from 'error';
import {
  ProcessorFn,
  ProcessorScope,
  ProcessorContext,
  ProcessorInfo,
  Component,
  DataTableComponent,
  SelectComponent,
  Submission,
} from 'types';
import { fastCloneDeep } from 'utils';
import { isObject, isEmpty, assign, isArray, each, find } from 'lodash';

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

const isDereferenceableSelectResourceComponent = (component: any): component is SelectComponent => {
  return (
    component &&
    component.type === 'select' &&
    component.reference &&
    component.dataSrc === 'resource'
  );
};
/**
 * This function is used to dereference reference IDs contained in the form.
 * It is currently only compatible with Data Table components.
 * @todo Add support for other components (if applicable) and for submission data dereferencing (e.g. save-as-reference, currently a property action).
 */
export const dereferenceProcess: ProcessorFn<DereferenceScope> = async (context) => {
  const { component, config, scope, path, value } = context;
  if (!scope.dereference) {
    scope.dereference = {};
  }
  const dtDereference = isDereferenceableDataTableComponent(component);
  const selectResourceDereference = isDereferenceableSelectResourceComponent(component);

  if (!dtDereference && !selectResourceDereference) {
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
    if (dtDereference) {
      const components = await config.database?.dereferenceDataTableComponent(component);
      const vmCompatibleComponents = fastCloneDeep(components);
      scope.dereference[path] = vmCompatibleComponents;
      // Modify the components in place; we have to do this now as opposed to a "post-processor" step because
      // eachComponentDataAsync will immediately turn around and introspect these components in the case of Data Table
      component.components = vmCompatibleComponents;
    } 
    else if (selectResourceDereference) {
      if (isEmpty(value) || !isObject(value)) {
        return;
      }
      const references = await config.database?.dereferenceSelectResourceValue(component, value);

      if (isEmpty(references) || !isArray(references)) {
        return;
      }

      scope.dereference[path] = references;

      if (component.multiple) {
        each(value, (item: Record<string, any>) => {
          const itemId = item._id?.toString();
          const reference = find(references, (refItem: Submission) => refItem._id?.toString() === itemId);
          if (isObject(reference)) {
            assign(item, reference);
          }
        });
      } else {
        assign(value, references[0]);
      }
    }
  } catch (err: any) {
    throw new ProcessorError(err.message || err, context, 'dereference');
  }
};

export const dereferenceProcessInfo: ProcessorInfo<ProcessorContext<DereferenceScope>, void> = {
  name: 'dereference',
  shouldProcess: () => true,
  process: dereferenceProcess,
};
