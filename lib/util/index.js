"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.override = exports.dom = exports.sanitize = exports.Evaluator = exports.Utils = exports.lodash = void 0;
exports.lodash = __importStar(require("./lodash"));
exports.Utils = __importStar(require("./formUtil"));
var Evaluator_1 = require("./Evaluator");
Object.defineProperty(exports, "Evaluator", { enumerable: true, get: function () { return Evaluator_1.Evaluator; } });
var sanitize_1 = require("./sanitize");
Object.defineProperty(exports, "sanitize", { enumerable: true, get: function () { return sanitize_1.sanitize; } });
exports.dom = __importStar(require("./dom"));
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
