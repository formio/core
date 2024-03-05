import { ValidationRuleInfo } from 'types';
import { clientRules } from './clientRules';
import { databaseRules } from './databaseRules';
import { evaluationRules } from './evaluationRules';
import { asynchronousRules } from './asynchronousRules';

export const serverRules: ValidationRuleInfo[] = [...asynchronousRules, ...databaseRules];
export const rules: ValidationRuleInfo[] = [...clientRules, ...evaluationRules];
export { clientRules, databaseRules, evaluationRules };
