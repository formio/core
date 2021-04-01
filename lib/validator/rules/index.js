"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Custom_1 = require("./Custom");
var Date_1 = require("./Date");
var Day_1 = require("./Day");
var Email_1 = require("./Email");
var Mask_1 = require("./Mask");
var Max_1 = require("./Max");
var MaxDate_1 = require("./MaxDate");
var MaxLength_1 = require("./MaxLength");
var MaxWords_1 = require("./MaxWords");
var Min_1 = require("./Min");
var MinDate_1 = require("./MinDate");
var MinLength_1 = require("./MinLength");
var MinWords_1 = require("./MinWords");
var Pattern_1 = require("./Pattern");
var Required_1 = require("./Required");
var Select_1 = require("./Select");
var Unique_1 = require("./Unique");
var Url_1 = require("./Url");
var MinYear_1 = require("./MinYear");
var MaxYear_1 = require("./MaxYear");
var Time_1 = require("./Time");
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
