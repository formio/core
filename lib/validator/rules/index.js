"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Custom_1 = require("./Custom");
const Date_1 = require("./Date");
const Day_1 = require("./Day");
const Email_1 = require("./Email");
const Mask_1 = require("./Mask");
const Max_1 = require("./Max");
const MaxDate_1 = require("./MaxDate");
const MaxLength_1 = require("./MaxLength");
const MaxWords_1 = require("./MaxWords");
const Min_1 = require("./Min");
const MinDate_1 = require("./MinDate");
const MinLength_1 = require("./MinLength");
const MinWords_1 = require("./MinWords");
const Pattern_1 = require("./Pattern");
const Required_1 = require("./Required");
const Select_1 = require("./Select");
const Unique_1 = require("./Unique");
const Url_1 = require("./Url");
const MinYear_1 = require("./MinYear");
const MaxYear_1 = require("./MaxYear");
const Time_1 = require("./Time");
exports.default = {
    custom: Custom_1.CustomRule,
    date: Date_1.DateRule,
    day: Day_1.DayRule,
    email: Email_1.EmailRule,
    mask: Mask_1.MaskRule,
    max: Max_1.MaxRule,
    maxDate: MaxDate_1.MaxDateRule,
    maxLength: MaxLength_1.MaxLengthRule,
    maxWords: MaxWords_1.MaxWordsRule,
    min: Min_1.MinRule,
    minDate: MinDate_1.MinDateRule,
    minLength: MinLength_1.MinLengthRule,
    minWords: MinWords_1.MinWordsRule,
    pattern: Pattern_1.PatternRule,
    required: Required_1.RequiredRule,
    select: Select_1.SelectRule,
    unique: Unique_1.UniqueRule,
    url: Url_1.UrlRule,
    minYear: MinYear_1.MinYearRule,
    maxYear: MaxYear_1.MaxYearRule,
    time: Time_1.TimeRule,
};
