import dayjs from 'dayjs';
/**
 * Get the current timezone string.
 *
 * @return {string}
 */
export declare function currentTimezone(): string;
/**
 * Convert the format from the angular-datepicker module to moment format.
 * @param format
 * @return {string}
 */
export declare function convertFormatToMoment(format: string): string;
/**
 * Get the moment date object for translating dates with timezones.
 *
 * @param value
 * @param format
 * @param timezone
 * @return {*}
 */
export declare function momentDate(value: any, format: any, timezone: any): any;
/**
 * Format a date provided a value, format, and timezone object.
 *
 * @param value
 * @param format
 * @param timezone
 * @return {string}
 */
export declare function formatDate(value: any, format: any, timezone: any): string;
/**
 * Return a translated date setting.
 *
 * @param date
 * @return {(null|Date)}
 */
export declare function getDateSetting(date: any): any;
export { dayjs };
