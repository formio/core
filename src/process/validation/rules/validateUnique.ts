import _ from 'lodash';

import { FieldError } from '../../../error/FieldError';
import { RuleFn } from '../../../types/index';
import { isEmptyObject } from '../util';

// export const validateUnique: RuleFn = async (component, data, config) => {
//     if (!component.unique) {
//         return null;
//     }

//     const value = _.get(data, path);
//     if (!value || isEmptyObject(value)) {
//         return null;
//     }

//     const isUnique = config.database?.isUnique(value);
//     return isUnique
//         ? null
//         : new FieldError({ component, errorKeyOrMessage: 'unique', field: getComponentErrorField(component), context: config?.context });
// };
