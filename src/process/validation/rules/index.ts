import { ValidationRuleInfo } from 'types';
import { ClientRules } from './clientRules';
import { DatabaseRules } from './databaseRules';
import { EvaluationRules } from './evaluationRules';
export const ServerRules: ValidationRuleInfo[] = DatabaseRules;
export const Rules: ValidationRuleInfo[] = [...ClientRules, ...EvaluationRules];
export { ClientRules, DatabaseRules, EvaluationRules };
