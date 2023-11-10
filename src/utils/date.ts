import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { isNaN, isNil } from 'lodash';
import { Evaluator } from './Evaluator';
import { DayComponent } from 'types';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

/**
 * Get the current timezone string.
 *
 * @return {string}
 */
export function currentTimezone(): string {
    return dayjs.tz.guess();
}

/**
 * Convert the format from the angular-datepicker module to moment format.
 * @param format
 * @return {string}
 */
export function convertFormatToMoment(format: string) {
    return format
        // Year conversion.
        .replace(/y/g, 'Y')
        // Day in month.
        .replace(/d/g, 'D')
        // Day in week.
        .replace(/E/g, 'd')
        // AM/PM marker
        .replace(/a/g, 'A')
        // Unix Timestamp
        .replace(/U/g, 'X');
}

/**
 * Get the moment date object for translating dates with timezones.
 *
 * @param value
 * @param format
 * @param timezone
 * @return {*}
 */
export function momentDate(value: any, format: any, timezone: any): any {
    const momentDate = dayjs(value);
    if (timezone === 'UTC') {
        return dayjs.utc();
    }
    if (timezone !== currentTimezone() || (format && format.match(/\s(z$|z\s)/))) {
        return momentDate.tz(timezone);
    }
    return momentDate;
}

/**
 * Format a date provided a value, format, and timezone object.
 *
 * @param value
 * @param format
 * @param timezone
 * @return {string}
 */
export function formatDate(value: any, format: any, timezone: any): string {
    const momentDate = dayjs(value);
    if (timezone === 'UTC') {
        return `${dayjs.utc().format(convertFormatToMoment(format))} UTC`;
    }
    if (timezone) {
        return momentDate.tz(timezone).format(`${convertFormatToMoment(format)} z`);
    }
    return momentDate.format(convertFormatToMoment(format));
}

/**
 * Return a translated date setting.
 *
 * @param date
 * @return {(null|Date)}
 */
 export function getDateSetting(date: any) {
    if (isNil(date) || isNaN(date) || date === '') {
      return null;
    }

    if (date instanceof Date) {
      return date;
    }
    else if (typeof date.toDate === 'function') {
      return date.isValid() ? date.toDate() : null;
    }

    let dateSetting = ((typeof date !== 'string') || (date.indexOf('moment(') === -1)) ? dayjs(date) : null;
    if (dateSetting && dateSetting.isValid()) {
      return dateSetting.toDate();
    }

    dateSetting = null;
    try {
      const value = Evaluator.evaluator(`return ${date};`, 'moment')(dayjs);
      if (typeof value === 'string') {
        dateSetting = dayjs(value);
      }
      else if (typeof value.toDate === 'function') {
        dateSetting = dayjs(value.toDate().toUTCString());
      }
      else if (value instanceof Date) {
        dateSetting = dayjs(value);
      }
    }
    catch (e) {
      return null;
    }

    if (!dateSetting) {
      return null;
    }

    // Ensure this is a date.
    if (!dateSetting.isValid()) {
      return null;
    }

    return dateSetting.toDate();
  }

  export const getDateValidationFormat = (component: DayComponent) => {
    return component.dayFirst ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
};

export const isPartialDay = (component: DayComponent, value: string | undefined) => {
    if (!value) {
        return false;
    }
    const [DAY, MONTH, YEAR] = component.dayFirst ? [0, 1, 2] : [1, 0, 2];
    const values = value.split('/');
    return values[DAY] === '00' || values[MONTH] === '00' || values[YEAR] === '0000';
};

export { dayjs };
