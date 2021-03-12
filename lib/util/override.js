"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.override = void 0;
/**
 * Simple class to allow for overriding base classes.
 * @param classObj
 * @param extenders
 */
function override(classObj, extenders) {
    for (var key in extenders) {
        if (extenders.hasOwnProperty(key)) {
            var extender = extenders[key];
            if (typeof extender === 'function') {
                classObj.prototype[key] = extender;
            }
            else {
                var prop = Object.getOwnPropertyDescriptor(classObj.prototype, key);
                for (var attr in extender) {
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
