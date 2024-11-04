import ConditionOperator from './ConditionOperator';
import moment from 'moment';
import { isPartialDay, getDateValidationFormat } from '../../utils/date';
export default class DateGeaterThan extends ConditionOperator {
  static get operatorKey() {
    return 'dateGreaterThan';
  }

  static get displayedName() {
    return 'Greater Than';
  }

  getFormattedDates({ value, comparedValue, conditionTriggerComponent }) {
    const validationFormat =
      conditionTriggerComponent && conditionTriggerComponent.component.type === 'day'
        ? getDateValidationFormat(conditionTriggerComponent.component)
        : null;
    const date = validationFormat ? moment(value, validationFormat) : moment(value);
    const comparedDate = validationFormat
      ? moment(comparedValue, validationFormat)
      : moment(comparedValue);

    return { date, comparedDate };
  }

  execute(options, functionName = 'isAfter') {
    const { value, instance, conditionComponentPath } = options;

    if (!value) {
      return false;
    }

    let conditionTriggerComponent = null;

    if (instance && instance.root) {
      conditionTriggerComponent = instance.root.getComponent(conditionComponentPath);
    }

    if (
      conditionTriggerComponent &&
      conditionTriggerComponent.component.type === 'day' &&
      isPartialDay(conditionTriggerComponent.component, value)
    ) {
      return false;
    }

    const { date, comparedDate } = this.getFormattedDates({
      ...options,
      conditionTriggerComponent,
    });

    return date[functionName](comparedDate);
  }
}
