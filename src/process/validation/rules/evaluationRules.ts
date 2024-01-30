import { ValidationRuleInfo } from "types";
import { validateCustomInfo } from "./validateCustom";
import { validateAvailableItemsInfo } from "./validateAvailableItems";
export const EvaluationRules: ValidationRuleInfo[] = [
    validateCustomInfo,
    validateAvailableItemsInfo
];