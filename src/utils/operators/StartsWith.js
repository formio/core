import ConditionOperator from './ConditionOperator';
import { startsWith } from 'lodash';

export default class StartsWith extends ConditionOperator {
  static get operatorKey() {
    return 'startsWith';
  }

  static get displayedName() {
    return 'Starts With';
  }

  execute({ value, comparedValue }) {
    return startsWith(value, comparedValue);
  }
}
