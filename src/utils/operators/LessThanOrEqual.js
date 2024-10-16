import ConditionOperator from './ConditionOperator';
import { isNumber, isEqual } from 'lodash';

export default class LessThanOrEqual extends ConditionOperator {
  static get operatorKey() {
    return 'lessThanOrEqual';
  }

  static get displayedName() {
    return 'Less Than Or Equal To';
  }

  execute({ value, comparedValue }) {
    return isNumber(value) && (value < comparedValue || isEqual(value, comparedValue));
  }
}
