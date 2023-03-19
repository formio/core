"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitterBase = exports.EventEmitter = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
exports.EventEmitterBase = eventemitter3_1.default;
function EventEmitter(BaseClass) {
    if (!BaseClass) {
        BaseClass = class _BaseClass {
        };
    }
    return class EventEmitter extends BaseClass {
        constructor() {
            super(...arguments);
            /**
             * The parent entity.
             */
            this.parent = null;
            /**
             * The events to fire for this model.
             */
            this.events = new eventemitter3_1.default();
        }
        /**
         * Bubble an event up to the parent.
         *
         * @param event
         * @param args
         * @returns
         */
        bubble(event, ...args) {
            if (this.parent) {
                return this.parent.bubble(event, ...args);
            }
            return this.emit(event, ...args);
        }
        /**
         * Emit an event on this component.
         * @param event
         * @param args
         * @returns
         */
        emit(event, ...args) {
            return this.events.emit(event, ...args);
        }
        /**
         * Register an event subscriber.
         * @param event
         * @param fn
         * @param args
         * @returns
         */
        on(event, fn, ...args) {
            return this.events.on(event, fn, ...args);
        }
        /**
         * Register an event subscriber that will only be called once.
         * @param event
         * @param fn
         * @param args
         * @returns
         */
        once(event, fn, ...args) {
            return this.events.once(event, fn, ...args);
        }
        /**
         * Turn off the event registrations.
         * @param event
         * @param args
         * @returns
         */
        off(event, ...args) {
            return this.events.off(event, ...args);
        }
    };
}
exports.EventEmitter = EventEmitter;
