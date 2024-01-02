import ConditionOperator from './ConditionOperator';
import { isString, isObject, isEqual } from 'lodash';

export default class IsEqualTo extends ConditionOperator {
    static get operatorKey() {
        return 'isEqual';
    }

    static get displayedName() {
        return 'Is Equal To';
    }

    execute({ value, comparedValue }) {
        if (value && comparedValue && typeof value !== typeof comparedValue && isString(comparedValue)) {
            try {
                comparedValue = JSON.parse(comparedValue);
            }
            // eslint-disable-next-line no-empty
            catch (e) {}
        }

        //special check for select boxes
        if (isObject(value) && comparedValue && isString(comparedValue)) {
            return value[comparedValue];
        }

        return  isEqual(value, comparedValue);
    }
}
