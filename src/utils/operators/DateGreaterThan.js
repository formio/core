import ConditionOperator from './ConditionOperator';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { isPartialDay, getDateValidationFormat } from '../../utils/date';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
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
    const date = validationFormat ? dayjs(value, validationFormat) : dayjs(value);
    const comparedDate = validationFormat
      ? dayjs(comparedValue, validationFormat)
      : dayjs(comparedValue);

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
