import { ValidationRuleInfo } from 'types';
import { ClientRules } from './clientRules';
import { DatabaseRules } from './databaseRules';
import { EvaluationRules } from './evaluationRules';
export const ServerRules: ValidationRuleInfo[] = [...ClientRules, ...DatabaseRules];
export const Rules: ValidationRuleInfo[] = [...ServerRules, ...EvaluationRules];
export { ClientRules, DatabaseRules, EvaluationRules };
