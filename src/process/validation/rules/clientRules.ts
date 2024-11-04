import { ValidationRuleInfo } from 'types';
import { validateDateInfo } from './validateDate';
import { validateDayInfo } from './validateDay';
import { validateEmailInfo } from './validateEmail';
import { validateJsonInfo } from './validateJson';
import { validateMaskInfo } from './validateMask';
import { validateMaximumDayInfo } from './validateMaximumDay';
import { validateMaximumLengthInfo } from './validateMaximumLength';
import { validateMaximumSelectedCountInfo } from './validateMaximumSelectedCount';
import { validateMaximumValueInfo } from './validateMaximumValue';
import { validateMaximumWordsInfo } from './validateMaximumWords';
import { validateMaximumYearInfo } from './validateMaximumYear';
import { validateMinimumDayInfo } from './validateMinimumDay';
import { validateMinimumLengthInfo } from './validateMinimumLength';
import { validateMinimumSelectedCountInfo } from './validateMinimumSelectedCount';
import { validateMinimumValueInfo } from './validateMinimumValue';
import { validateMinimumWordsInfo } from './validateMinimumWords';
import { validateMinimumYearInfo } from './validateMinimumYear';
import { validateMultipleInfo } from './validateMultiple';
import { validateRegexPatternInfo } from './validateRegexPattern';
import { validateRequiredInfo } from './validateRequired';
import { validateRequiredDayInfo } from './validateRequiredDay';
import { validateTimeInfo } from './validateTime';
import { validateUrlInfo } from './validateUrl';
import { validateValuePropertyInfo } from './validateValueProperty';
import { validateNumberInfo } from './validateNumber';

// These are the validations that are performed in the client.
export const clientRules: ValidationRuleInfo[] = [
  validateDateInfo,
  validateDayInfo,
  validateEmailInfo,
  validateJsonInfo,
  validateMaskInfo,
  validateMaximumDayInfo,
  validateMaximumLengthInfo,
  validateMaximumSelectedCountInfo,
  validateMaximumValueInfo,
  validateMaximumWordsInfo,
  validateMaximumYearInfo,
  validateMinimumDayInfo,
  validateMinimumLengthInfo,
  validateMinimumSelectedCountInfo,
  validateMinimumValueInfo,
  validateMinimumWordsInfo,
  validateMinimumYearInfo,
  validateMultipleInfo,
  validateRegexPatternInfo,
  validateRequiredInfo,
  validateRequiredDayInfo,
  validateTimeInfo,
  validateUrlInfo,
  validateValuePropertyInfo,
  validateNumberInfo,
];
