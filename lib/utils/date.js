"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayjs = exports.getDateSetting = exports.formatDate = exports.momentDate = exports.convertFormatToMoment = exports.currentTimezone = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
exports.dayjs = dayjs_1.default;
var timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
var utc_1 = __importDefault(require("dayjs/plugin/utc"));
var lodash_1 = require("@formio/lodash");
var Evaluator_1 = require("./Evaluator");
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
    var momentDate = (0, dayjs_1.default)(value);
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
    var momentDate = (0, dayjs_1.default)(value);
    if (timezone === 'UTC') {
        return "".concat(dayjs_1.default.utc().format(convertFormatToMoment(format)), " UTC");
    }
    if (timezone) {
        return momentDate.tz(timezone).format("".concat(convertFormatToMoment(format), " z"));
    }
    return momentDate.format(convertFormatToMoment(format));
}
exports.formatDate = formatDate;
/**
 * Return a translated date setting.
 *
 * @param date
 * @return {(null|Date)}
 */
function getDateSetting(date) {
    if ((0, lodash_1.isNil)(date) || (0, lodash_1.isNaN)(date) || date === '') {
        return null;
    }
    if (date instanceof Date) {
        return date;
    }
    else if (typeof date.toDate === 'function') {
        return date.isValid() ? date.toDate() : null;
    }
    var dateSetting = ((typeof date !== 'string') || (date.indexOf('moment(') === -1)) ? (0, dayjs_1.default)(date) : null;
    if (dateSetting && dateSetting.isValid()) {
        return dateSetting.toDate();
    }
    dateSetting = null;
    try {
        var value = Evaluator_1.Evaluator.evaluator("return ".concat(date, ";"), 'moment')(dayjs_1.default);
        if (typeof value === 'string') {
            dateSetting = (0, dayjs_1.default)(value);
        }
        else if (typeof value.toDate === 'function') {
            dateSetting = (0, dayjs_1.default)(value.toDate().toUTCString());
        }
        else if (value instanceof Date) {
            dateSetting = (0, dayjs_1.default)(value);
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
exports.getDateSetting = getDateSetting;