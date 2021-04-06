"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitterBase = exports.EventEmitter = void 0;
var eventemitter3_1 = __importDefault(require("eventemitter3"));
exports.EventEmitterBase = eventemitter3_1.default;
function EventEmitter(Base) {
    return /** @class */ (function (_super) {
        __extends(EventEmitter, _super);
        function EventEmitter() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.events = new eventemitter3_1.default();
            return _this;
        }
        EventEmitter.prototype.emit = function (event) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this.events).emit.apply(_a, __spreadArray([event], args));
        };
        EventEmitter.prototype.on = function (event, fn) {
            var _a;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return (_a = this.events).on.apply(_a, __spreadArray([event, fn], args));
        };
        EventEmitter.prototype.once = function (event, fn) {
            var _a;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return (_a = this.events).once.apply(_a, __spreadArray([event, fn], args));
        };
        EventEmitter.prototype.off = function (event) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this.events).off.apply(_a, __spreadArray([event], args));
        };
        return EventEmitter;
    }(Base));
}
exports.EventEmitter = EventEmitter;
