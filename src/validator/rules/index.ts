import { CustomRule } from './Custom';
import { DateRule } from './Date';
import { DayRule } from './Day';
import { EmailRule } from './Email';
import { MaskRule } from './Mask';
import { MaxRule} from './Max';
import { MaxDateRule } from './MaxDate';
import { MaxLengthRule } from './MaxLength';
import { MaxWordsRule } from './MaxWords';
import { MinRule } from './Min';
import { MinDateRule } from './MinDate';
import { MinLengthRule } from './MinLength';
import { MinWordsRule } from './MinWords';
import { PatternRule } from './Pattern';
import { RequiredRule } from './Required';
import { SelectRule } from './Select';
import { UniqueRule } from './Unique';
import { UrlRule } from './Url';
import { MinYearRule } from './MinYear';
import { MaxYearRule } from './MaxYear';
import { TimeRule } from './Time';
export default {
  custom: CustomRule,
  date: DateRule,
  day: DayRule,
  email: EmailRule,
  mask: MaskRule,
  max: MaxRule,
  maxDate: MaxDateRule,
  maxLength: MaxLengthRule,
  maxWords: MaxWordsRule,
  min: MinRule,
  minDate: MinDateRule,
  minLength: MinLengthRule,
  minWords: MinWordsRule,
  pattern: PatternRule,
  required: RequiredRule,
  select: SelectRule,
  unique: UniqueRule,
  url: UrlRule,
  minYear: MinYearRule,
  maxYear: MaxYearRule,
  time: TimeRule,
};
