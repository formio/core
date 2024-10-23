import { isArray, some } from 'lodash';

export default class ConditionOperator {
  static get operatorKey() {
    return '';
  }

  static get displayedName() {
    return '';
  }

  static get requireValue() {
    return true;
  }

  execute() {
    return true;
  }

  getResult(options = {}) {
    const { value } = options;

    if (isArray(value)) {
      return some(value, (valueItem) => this.execute({ ...options, value: valueItem }));
    }

    return this.execute(options);
  }
}
