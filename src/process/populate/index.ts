import set from 'lodash/set';
import get from 'lodash/get';
import { PopulateContext, PopulateScope, ProcessorFnSync } from 'types';
import { componentDataPath, getContextualRowPath, getModelType } from 'utils/formUtil';

// This processor ensures that a "linked" row context is provided to every component.
export const populateProcessSync: ProcessorFnSync<PopulateScope> = (context: PopulateContext) => {
    const { component, path, scope } = context;
    const { data } = scope;
    const compDataPath = componentDataPath(component, getContextualRowPath(path));
    const compData: any = get(data, compDataPath);
    switch (getModelType(component)) {
        case 'array':
            if (!compData || !compData.length) {
                set(data, compDataPath, [{}]);
                scope.row = get(data, compDataPath)[0];
            }
            break;
        case 'dataObject':
        case 'object':
            if (!compData || typeof compData !== 'object') {
                set(data, compDataPath, {});
                scope.row = get(data, compDataPath);
            }
            break;
    }

};

export const populateProcessInfo = {
    name: 'populate',
    processSync: populateProcessSync,
};