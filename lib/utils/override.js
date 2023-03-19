"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.override = void 0;
/**
 * Simple class to allow for overriding base classes.
 * @param classObj
 * @param extenders
 */
function override(classObj, extenders) {
    for (let key in extenders) {
        if (extenders.hasOwnProperty(key)) {
            const extender = extenders[key];
            if (typeof extender === 'function') {
                classObj.prototype[key] = extender;
            }
            else {
                const prop = Object.getOwnPropertyDescriptor(classObj.prototype, key);
                for (let attr in extender) {
                    if (extender.hasOwnProperty(attr)) {
                        prop[attr] = extender[attr](prop[attr]);
                    }
                }
                Object.defineProperty(classObj.prototype, key, prop);
            }
        }
    }
}
exports.override = override;
