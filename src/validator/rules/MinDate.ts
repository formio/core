import { getDateSetting } from '../../util/date';
import { isNull } from '@formio/lodash';
import dayjs from 'dayjs';

import { Rule } from './Rule';
export class MinDateRule extends Rule {
  defaultMessage = '{{field}} should not contain date before {{settings.dateLimit}}';
  public async check(value: any = this.component.dataValue) {
    if (!value) {
      return true;
    }

    const date = dayjs(value);
    const minDate = getDateSetting(this.settings.dateLimit);

    if (isNull(minDate)) {
      return true;
    }
    else {
      minDate.setHours(0, 0, 0, 0);
    }

    return date.isAfter(minDate) || date.isSame(minDate);
  }
};
