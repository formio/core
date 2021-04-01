import EventEmitterBase from 'eventemitter3';
import { Constructor } from './Constructor';
export function EventEmitter<TBase extends Constructor>(Base: TBase) {
    return class EventEmitter extends Base {
        public events: EventEmitterBase = new EventEmitterBase();
        public emit(event: any, ...args: any) {
            return this.events.emit(event, ...args);
        }
        public on(event: any, fn: any, ...args: any) {
            return this.events.on(event, fn, ...args);
        }
        public once(event: any, fn: any, ...args: any) {
            return this.events.once(event, fn, ...args);
        }
        public off(event: any, ...args: any) {
            return this.events.off(event, ...args);
        }
    }
}

export { EventEmitterBase };