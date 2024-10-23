import ConditionOperator from './ConditionOperator';
import { isNumber, isEqual } from 'lodash';

export default class GreaterThanOrEqual extends ConditionOperator {
  static get operatorKey() {
    return 'greaterThanOrEqual';
  }

  static get displayedName() {
    return 'Greater Than Or Equal To';
  }

  execute({ value, comparedValue }) {
    return isNumber(value) && (value > comparedValue || isEqual(value, comparedValue));
  }
}
