import { ValidationRuleInfo } from 'types';
import { validateUrlSelectValueInfo } from './validateUrlSelectValue';
import { validateAvailableItemsInfo } from './validateAvailableItems';

// These are the validations that are asynchronouse (e.g. require fetch
export const asynchronousRules: ValidationRuleInfo[] = [
  validateUrlSelectValueInfo,
  validateAvailableItemsInfo,
];
