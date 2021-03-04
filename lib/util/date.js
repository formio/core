"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayjs = exports.formatDate = exports.momentDate = exports.convertFormatToMoment = exports.currentTimezone = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
exports.dayjs = dayjs_1.default;
var timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
var utc_1 = __importDefault(require("dayjs/plugin/utc"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
/**
 * Get the current timezone string.
 *
 * @return {string}
 */
function currentTimezone() {
    return dayjs_1.default.tz.guess();
}
exports.currentTimezone = currentTimezone;
/**
 * Convert the format from the angular-datepicker module to moment format.
 * @param format
 * @return {string}
 */
function convertFormatToMoment(format) {
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
exports.convertFormatToMoment = convertFormatToMoment;
/**
 * Get the moment date object for translating dates with timezones.
 *
 * @param value
 * @param format
 * @param timezone
 * @return {*}
 */
function momentDate(value, format, timezone) {
    var momentDate = dayjs_1.default(value);
    if (timezone === 'UTC') {
        return dayjs_1.default.utc();
    }
    if (timezone !== currentTimezone() || (format && format.match(/\s(z$|z\s)/))) {
        return momentDate.tz(timezone);
    }
    return momentDate;
}
exports.momentDate = momentDate;
/**
 * Format a date provided a value, format, and timezone object.
 *
 * @param value
 * @param format
 * @param timezone
 * @return {string}
 */
function formatDate(value, format, timezone) {
    var momentDate = dayjs_1.default(value);
    if (timezone === 'UTC') {
        return dayjs_1.default.utc().format(convertFormatToMoment(format)) + " UTC";
    }
    if (timezone) {
        return momentDate.tz(timezone).format(convertFormatToMoment(format) + " z");
    }
    return momentDate.format(convertFormatToMoment(format));
}
exports.formatDate = formatDate;
