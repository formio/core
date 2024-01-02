import ConditionOperator from './ConditionOperator';
import { isEqual } from 'lodash';

export default class IsNotEqualTo extends ConditionOperator {
    static get operatorKey() {
        return 'isNotEqual';
    }

    static get displayedName() {
        return 'Is Not Equal To';
    }

    execute({ value, comparedValue }) {
        return  !isEqual(value, comparedValue);
    }
}
