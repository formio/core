export interface ModelInterface {
  component?: any;
  options?: any;
  data?: any;
  new (component?: any, options?: any, data?: any): any;
}

import EventEmitterBase from 'eventemitter3';
export function EventEmitter(BaseClass?: any): ModelInterface {
  if (!BaseClass) {
    BaseClass = class _BaseClass {};
  }
  return class EventEmitter extends BaseClass {
    /**
     * The parent entity.
     */
    public parent: any = null;

    /**
     * The events to fire for this model.
     */
    public events: EventEmitterBase = new EventEmitterBase();

    /**
     * Bubble an event up to the parent.
     *
     * @param event
     * @param args
     * @returns
     */
    public bubble(event: any, ...args: any) {
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
    public emit(event: any, ...args: any) {
      return this.events.emit(event, ...args);
    }

    /**
     * Register an event subscriber.
     * @param event
     * @param fn
     * @param args
     * @returns
     */
    public on(event: any, fn: any, ...args: any) {
      return this.events.on(event, fn, ...args);
    }

    /**
     * Register an event subscriber that will only be called once.
     * @param event
     * @param fn
     * @param args
     * @returns
     */
    public once(event: any, fn: any, ...args: any) {
      return this.events.once(event, fn, ...args);
    }

    /**
     * Turn off the event registrations.
     * @param event
     * @param args
     * @returns
     */
    public off(event: any, ...args: any) {
      return this.events.off(event, ...args);
    }
  };
}

export { EventEmitterBase };
