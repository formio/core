import { ValidationRuleInfo } from "types";
import { validateUrlSelectValueInfo } from "./validateUrlSelectValue";

// These are the validations that are asynchronouse (e.g. require fetch
export const asynchronousRules: ValidationRuleInfo[] = [
    validateUrlSelectValueInfo,
];
