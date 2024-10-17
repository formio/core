import {
  compareSelectResourceWithObjectTypeValues,
  isSelectResourceWithObjectValue,
} from 'utils/formUtil';
import ConditionOperator from './ConditionOperator';
import { isString, isObject, isEqual, get } from 'lodash';

export default class IsEqualTo extends ConditionOperator {
    static get operatorKey() {
        return 'isEqual';
    }

    static get displayedName() {
        return 'Is Equal To';
    }

    execute({ value, comparedValue, conditionComponent }) {
        // special check for select boxes
        if (conditionComponent?.type === 'selectboxes') {
            return get(value, comparedValue, false);
        }
        
        if (value && comparedValue && typeof value !== typeof comparedValue && isString(comparedValue)) {
            try {
                comparedValue = JSON.parse(comparedValue);
            }
            // eslint-disable-next-line no-empty
            catch (e) {}
        }

    if (
      conditionComponent &&
      isSelectResourceWithObjectValue(conditionComponent) &&
      conditionComponent.template
    ) {
      return compareSelectResourceWithObjectTypeValues(value, comparedValue, conditionComponent);
    }

    return isEqual(value, comparedValue);
  }
}
