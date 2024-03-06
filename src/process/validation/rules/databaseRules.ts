import { ValidationRuleInfo } from "types";
import { validateUniqueInfo } from "./validateUnique";
import { validateCaptchaInfo } from "./validateCaptcha";
import { validateResourceSelectValueInfo } from "./validateResourceSelectValue";

// These are the validations that require a database connection.
export const databaseRules: ValidationRuleInfo[] = [
    validateUniqueInfo,
    validateCaptchaInfo,
    validateResourceSelectValueInfo
];
