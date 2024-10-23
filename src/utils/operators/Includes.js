import ConditionOperator from './ConditionOperator';
import { includes } from 'lodash';

export default class Includes extends ConditionOperator {
  static get operatorKey() {
    return 'includes';
  }

  static get displayedName() {
    return 'Includes';
  }

  execute({ value, comparedValue }) {
    return includes(value, comparedValue);
  }
}
