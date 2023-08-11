import { validateAvailableItems, validateAvailableItemsSync } from './validateAvailableItems';
import { validateCustom, validateCustomSync } from './validateCustom';
import { validateDate, validateDateSync } from './validateDate';
import { validateDay, validateDaySync } from './validateDay';
import { validateEmail, validateEmailSync } from './validateEmail';
import { validateJson, validateJsonSync } from './validateJson';
import { validateMask, validateMaskSync } from './validateMask';
import { validateMaximumDay, validateMaximumDaySync } from './validateMaximumDay';
import { validateMaximumLength, validateMaximumLengthSync } from './validateMaximumLength';
import { validateMaximumSelectedCount, validateMaximumSelectedCountSync } from './validateMaximumSelectedCount';
import { validateMaximumValue, validateMaximumValueSync } from './validateMaximumValue';
import { validateMaximumWords, validateMaximumWordsSync } from './validateMaximumWords';
import { validateMaximumYear, validateMaximumYearSync } from './validateMaximumYear';
import { validateMinimumDay, validateMinimumDaySync } from './validateMinimumDay';
import { validateMinimumLength, validateMinimumLengthSync } from './validateMinimumLength';
import { validateMinimumSelectedCount, validateMinimumSelectedCountSync } from './validateMinimumSelectedCount';
import { validateMinimumValue, validateMinimumValueSync } from './validateMinimumValue';
import { validateMinimumWords, validateMinimumWordsSync } from './validateMinimumWords';
import { validateMinimumYear, validateMinimumYearSync } from './validateMinimumYear';
import { validateRegexPattern, validateRegexPatternSync } from './validateRegexPattern';
import { validateRemoteSelectValue } from './validateRemoteSelectValue';
import { validateRequired, validateRequiredSync } from './validateRequired';
import { validateMultiple, validateMultipleSync } from './validateMultiple';
import { validateTime, validateTimeSync } from './validateTime';
import { validateValueProperty, validateValuePropertySync } from './validateValueProperty';
import { validateUnique } from './validateUnique';
import { validateUrl, validateUrlSync } from './validateUrl';
import { validateRequiredDay, validateRequiredDaySync } from './validateRequiredDay';

export const rules = [
    validateAvailableItems,
    validateValueProperty,
    validateCustom,
    validateDate,
    validateDay,
    validateEmail,
    validateJson,
    validateMask,
    validateMaximumDay,
    validateMaximumLength,
    validateMaximumSelectedCount,
    validateMaximumValue,
    validateMaximumWords,
    validateMaximumYear,
    validateMinimumDay,
    validateMinimumLength,
    validateMinimumSelectedCount,
    validateMinimumValue,
    validateMinimumWords,
    validateMinimumYear,
    validateMultiple,
    validateRegexPattern,
    validateRemoteSelectValue,
    validateRequired,
    validateRequiredDay,
    validateTime,
    validateUnique,
    validateUrl,
];

export const rulesSync = [
    validateAvailableItemsSync,
    validateValuePropertySync,
    validateCustomSync,
    validateDateSync,
    validateDaySync,
    validateEmailSync,
    validateJsonSync,
    validateMaskSync,
    validateMaximumDaySync,
    validateMaximumLengthSync,
    validateMaximumSelectedCountSync,
    validateMaximumValueSync,
    validateMaximumWordsSync,
    validateMaximumYearSync,
    validateMinimumDaySync,
    validateMinimumLengthSync,
    validateMinimumSelectedCountSync,
    validateMinimumValueSync,
    validateMinimumWordsSync,
    validateMinimumYearSync,
    validateMultipleSync,
    validateRegexPatternSync,
    validateRequiredSync,
    validateRequiredDaySync,
    validateTimeSync,
    validateUrlSync,
];
