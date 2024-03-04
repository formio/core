import { ValidationRuleInfo } from "types";
import { validateRemoteSelectValueInfo } from "./validateRemoteSelectValue";

// These are the validations that are asynchronouse (e.g. require fetch
export const asynchronousRules: ValidationRuleInfo[] = [
    validateRemoteSelectValueInfo,
];
