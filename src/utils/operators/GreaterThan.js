import ConditionOperator from './ConditionOperator';
import { isNumber } from 'lodash';

export default class GeaterThan extends ConditionOperator {
  static get operatorKey() {
    return 'greaterThan';
  }

  static get displayedName() {
    return 'Greater Than';
  }

  execute({ value, comparedValue }) {
    return isNumber(value) && value > comparedValue;
  }
}
