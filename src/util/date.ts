import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

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

export { dayjs };