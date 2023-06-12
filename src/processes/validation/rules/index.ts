import { validateAvailableItems } from './validateAvailableItems';
import { validateCustom } from './validateCustom';
import { validateDate } from './validateDate';
import { validateDay } from './validateDay';
import { validateEmail } from './validateEmail';
import { validateJson } from './validateJson';
import { validateMask } from './validateMask';
import { validateMaximumDay } from './validateMaximumDay';
import { validateMaximumLength } from './validateMaximumLength';
import { validateMaximumSelectedCount } from './validateMaximumSelectedCount';
import { validateMaximumValue } from './validateMaximumValue';
import { validateMaximumWords } from './validateMaximumWords';
import { validateMaximumYear } from './validateMaximumYear';
import { validateMinimumDay } from './validateMinimumDay';
import { validateMinimumLength } from './validateMinimumLength';
import { validateMinimumValue } from './validateMinimumValue';
import { validateMinimumWords } from './validateMinimumWords';
import { validateMinimumYear } from './validateMinimumYear';
import { validateRegexPattern } from './validateRegexPattern';
import { validateRemoteSelectValue } from './validateRemoteSelectValue';
import { validateRequired } from './validateRequired';
// import { validateUnique } from './validateUnique';
import { validateUrl } from './validateUrl';

export const rules = [
    validateAvailableItems,
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
    validateMinimumValue,
    validateMinimumWords,
    validateMinimumYear,
    validateRegexPattern,
    validateRemoteSelectValue,
    validateRequired,
    // validateUnique,
    validateUrl,
];
