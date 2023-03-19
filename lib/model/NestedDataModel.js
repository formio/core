"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.NestedDataModel = void 0;
const _ = __importStar(require("@formio/lodash"));
const NestedModel_1 = require("./NestedModel");
function NestedDataModel(props = {}) {
    return function (BaseClass) {
        return class BaseNestedDataModel extends (0, NestedModel_1.NestedModel)(props)(BaseClass) {
            get emptyValue() {
                return {};
            }
            get defaultValue() {
                return {};
            }
            /**
             * Get the component data.
             */
            componentData() {
                const compData = _.get(this.data, this.component.key, this.defaultValue);
                if (!Object.keys(compData).length) {
                    _.set(this.data, this.component.key, compData);
                }
                return compData;
            }
            get dataValue() {
                return _.get(this.data, this.component.key);
            }
            set dataValue(value) {
                this.eachComponentValue(value, (comp, val) => (comp.dataValue = val));
            }
        };
    };
}
exports.NestedDataModel = NestedDataModel;
;
