import { ValidationRuleInfo } from 'types';
import { validateCustomInfo } from './validateCustom';
import { validateAvailableItemsInfo } from './validateAvailableItems';
export const evaluationRules: ValidationRuleInfo[] = [
  validateCustomInfo,
  validateAvailableItemsInfo,
];
