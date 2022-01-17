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
exports.NestedDataModel = void 0;
var _ = __importStar(require("@formio/lodash"));
var NestedModel_1 = require("./NestedModel");
function NestedDataModel(props) {
    if (props === void 0) { props = {}; }
    return function (BaseClass) {
        return /** @class */ (function (_super) {
            __extends(BaseNestedDataModel, _super);
            function BaseNestedDataModel() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(BaseNestedDataModel.prototype, "emptyValue", {
                get: function () {
                    return {};
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseNestedDataModel.prototype, "defaultValue", {
                get: function () {
                    return {};
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Get the component data.
             */
            BaseNestedDataModel.prototype.componentData = function () {
                var compData = _.get(this.data, this.component.key, this.defaultValue);
                if (!Object.keys(compData).length) {
                    _.set(this.data, this.component.key, compData);
                }
                return compData;
            };
            Object.defineProperty(BaseNestedDataModel.prototype, "dataValue", {
                get: function () {
                    return _.get(this.data, this.component.key);
                },
                set: function (value) {
                    this.eachComponentValue(value, function (comp, val) { return (comp.dataValue = val); });
                },
                enumerable: false,
                configurable: true
            });
            return BaseNestedDataModel;
        }((0, NestedModel_1.NestedModel)(props)(BaseClass)));
    };
}
exports.NestedDataModel = NestedDataModel;
;
