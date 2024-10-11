import ConditionOperator from './ConditionOperator';
import { endsWith } from 'lodash';

export default class EndsWith extends ConditionOperator {
  static get operatorKey() {
    return 'endsWith';
  }

  static get displayedName() {
    return 'Ends With';
  }

  execute({ value, comparedValue }) {
    return endsWith(value, comparedValue);
  }
}
