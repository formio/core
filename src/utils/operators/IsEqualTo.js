import {
  compareSelectResourceWithObjectTypeValues,
  isSelectResourceWithObjectValue,
} from 'utils/formUtil';
import ConditionOperator from './ConditionOperator';
import { isString, isEqual, get } from 'lodash';

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

    if (
      value &&
      comparedValue &&
      typeof value !== typeof comparedValue &&
      isString(comparedValue)
    ) {
      try {
        comparedValue = JSON.parse(comparedValue);
      } catch (ignoreErr) {
        // do nothing
      }
    }

    if (
      conditionComponent &&
      isSelectResourceWithObjectValue(conditionComponent.component) &&
      conditionComponent?.component?.template
    ) {
      return compareSelectResourceWithObjectTypeValues(value, comparedValue, conditionComponent.component);
    }

    return isEqual(value, comparedValue);
  }
}
