import _ from 'lodash';

import { FieldError } from '../../../error/FieldError';
import { RuleFn } from '../../../types/index';
import { isEmptyObject } from '../util';

// export const validateUnique: RuleFn = async (component, data) => {
//     if (!component.unique) {
//         return null;
//     }

//     const value = _.get(data, component.key);
//     if (!value || isEmptyObject(value)) {
//         return null;
//     }

//     const isUnique = config.database?.isUnique(value);
//     return isUnique
//         ? null
//         : new FieldError({ component, errorKeyOrMessage: 'unique', field: getComponentErrorField(component), context: { process: ProcessType.Validation } });
// };
