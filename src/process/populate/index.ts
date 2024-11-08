import { set } from 'lodash';
import { PopulateContext, PopulateScope, ProcessorFnSync } from 'types';
import { getModelType } from 'utils/formUtil';

// This processor ensures that a "linked" row context is provided to every component.
export const populateProcessSync: ProcessorFnSync<PopulateScope> = (context: PopulateContext) => {
  const { component, path, scope, value } = context;
  const { data } = scope;
  if (!scope.populated) scope.populated = [];
  switch (getModelType(component)) {
    case 'nestedArray':
      if (!value || !value.length) {
        const newValue = [{}];
        set(data, path, newValue);
        scope.row = newValue[0];
        scope.populated.push({
          path,
        });
      }
      break;
    case 'dataObject':
    case 'object':
      if (!value || typeof value !== 'object') {
        const newValue = {};
        set(data, value, newValue);
        scope.row = newValue;
        scope.populated.push({
          path,
        });
      }
      break;
  }
};

export const populateProcessInfo = {
  name: 'populate',
  shouldProcess: () => true,
  processSync: populateProcessSync,
};
