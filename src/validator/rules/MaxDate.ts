import { getDateSetting } from '../../util/date';
import { isNull } from '@formio/lodash';
import dayjs from 'dayjs';

import { Rule } from './Rule';
export class MaxDateRule extends Rule {
  defaultMessage = '{{field}} should not contain date after {{settings.dateLimit}}';
  public async check(value: any = this.component.dataValue) {
    if (!value) {
      return true;
    }

    // If they are the exact same string or object, then return true.
    if (value === this.settings.dateLimit) {
      return true;
    }

    const date = dayjs(value);
    const maxDate = getDateSetting(this.settings.dateLimit);

    if (isNull(maxDate)) {
      return true;
    }
    else {
      maxDate.setHours(0, 0, 0, 0);
    }

    return date.isBefore(maxDate) || date.isSame(maxDate);
  }
};
