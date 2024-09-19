import { ValidationRuleInfo } from "types";
import { validateUrlSelectValueInfo } from "./validateUrlSelectValue";
import { validateAvailableItemsUrlInfo } from "./validateAvailableItemsUrl";

// These are the validations that are asynchronouse (e.g. require fetch
export const asynchronousRules: ValidationRuleInfo[] = [
    validateUrlSelectValueInfo,
    validateAvailableItemsUrlInfo
];
