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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitterBase = exports.EventEmitter = void 0;
var eventemitter3_1 = __importDefault(require("eventemitter3"));
exports.EventEmitterBase = eventemitter3_1.default;
function EventEmitter(BaseClass) {
    if (!BaseClass) {
        BaseClass = /** @class */ (function () {
            function _BaseClass() {
            }
            return _BaseClass;
        }());
    }
    return /** @class */ (function (_super) {
        __extends(EventEmitter, _super);
        function EventEmitter() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * The parent entity.
             */
            _this.parent = null;
            /**
             * The events to fire for this model.
             */
            _this.events = new eventemitter3_1.default();
            return _this;
        }
        /**
         * Bubble an event up to the parent.
         *
         * @param event
         * @param args
         * @returns
         */
        EventEmitter.prototype.bubble = function (event) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.parent) {
                return (_a = this.parent).bubble.apply(_a, __spreadArray([event], args, false));
            }
            return this.emit.apply(this, __spreadArray([event], args, false));
        };
        /**
         * Emit an event on this component.
         * @param event
         * @param args
         * @returns
         */
        EventEmitter.prototype.emit = function (event) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this.events).emit.apply(_a, __spreadArray([event], args, false));
        };
        /**
         * Register an event subscriber.
         * @param event
         * @param fn
         * @param args
         * @returns
         */
        EventEmitter.prototype.on = function (event, fn) {
            var _a;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return (_a = this.events).on.apply(_a, __spreadArray([event, fn], args, false));
        };
        /**
         * Register an event subscriber that will only be called once.
         * @param event
         * @param fn
         * @param args
         * @returns
         */
        EventEmitter.prototype.once = function (event, fn) {
            var _a;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return (_a = this.events).once.apply(_a, __spreadArray([event, fn], args, false));
        };
        /**
         * Turn off the event registrations.
         * @param event
         * @param args
         * @returns
         */
        EventEmitter.prototype.off = function (event) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this.events).off.apply(_a, __spreadArray([event], args, false));
        };
        return EventEmitter;
    }(BaseClass));
}
exports.EventEmitter = EventEmitter;
