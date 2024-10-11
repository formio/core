import { isComponentDataEmpty } from 'utils/formUtil';
import ConditionOperator from './ConditionOperator';

export default class IsEmptyValue extends ConditionOperator {
  static get operatorKey() {
    return 'isEmpty';
  }

  static get displayedName() {
    return 'Is Empty';
  }

  static get requireValue() {
    return false;
  }

  execute({ value, conditionComponentPath, data, conditionComponent }) {
    return isComponentDataEmpty(conditionComponent, data, conditionComponentPath, value);
  }

  getResult(options) {
    return this.execute(options);
  }
}
