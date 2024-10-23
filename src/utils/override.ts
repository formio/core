/**
 * Simple class to allow for overriding base classes.
 * @param classObj
 * @param extenders
 */
export function override(classObj: any, extenders: any) {
  for (const key in extenders) {
    if (extenders.hasOwnProperty(key)) {
      const extender = extenders[key];
      if (typeof extender === 'function') {
        classObj.prototype[key] = extender;
      } else {
        const prop: any = Object.getOwnPropertyDescriptor(classObj.prototype, key);
        for (const attr in extender) {
          if (extender.hasOwnProperty(attr)) {
            prop[attr] = extender[attr](prop[attr]);
          }
        }
        Object.defineProperty(classObj.prototype, key, prop);
      }
    }
  }
}
