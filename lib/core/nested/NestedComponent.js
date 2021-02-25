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
exports.NestedComponent = void 0;
var Component_1 = require("../component/Component");
var index_1 = require("../index");
var _ = __importStar(require("../../util/util"));
var NestedComponent = /** @class */ (function (_super) {
    __extends(NestedComponent, _super);
    function NestedComponent(component, options, data) {
        if (options === void 0) { options = {}; }
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, component, options, data) || this;
        _this.template = 'nested';
        _this.components = [];
        _this.initComponents();
        return _this;
    }
    /**
     * The JSON schema for a base component.
     * @param extend
     */
    NestedComponent.schema = function (extend) {
        if (extend === void 0) { extend = {}; }
        if (!extend.components) {
            extend.components = [];
        }
        return Component_1.Component.schema(extend);
    };
    Object.defineProperty(NestedComponent.prototype, "defaultSchema", {
        get: function () {
            return NestedComponent.schema();
        },
        enumerable: false,
        configurable: true
    });
    NestedComponent.prototype.getComponents = function () {
        return this.components || [];
    };
    /**
     * Perform an iteration over each component within this container component.
     *
     * @param {function} fn - Called for each component
     */
    NestedComponent.prototype.eachComponent = function (fn) {
        _.each(this.getComponents(), function (component, index) {
            if (fn(component, index) === false) {
                return false;
            }
        });
    };
    /**
     * Detach components.
     */
    NestedComponent.prototype.detach = function () {
        _super.prototype.detach.call(this);
        this.eachComponent(function (comp) { return comp.detach(); });
    };
    NestedComponent.prototype.componentData = function () {
        return this.data;
    };
    NestedComponent.prototype.removeComponent = function (component) {
        var _this = this;
        (this.components || []).forEach(function (comp, index) {
            if (comp === component) {
                comp.detach();
                _this.components.splice(index, 1);
            }
        });
    };
    NestedComponent.prototype.createComponent = function (component, data) {
        var comp = index_1.Components.createComponent(component, this.options, data);
        comp.parent = this;
        comp.root = this.root || this;
        return comp;
    };
    NestedComponent.prototype.createComponents = function (data) {
        var _this = this;
        var added = [];
        (this.component.components || []).forEach(function (comp) {
            var newComp = _this.createComponent(comp, data);
            _this.components.push(newComp);
            added.push(newComp);
        });
        return added;
    };
    NestedComponent.prototype.initComponents = function () {
        this.createComponents(this.componentData());
    };
    NestedComponent.prototype.renderContext = function (context) {
        if (context === void 0) { context = {}; }
        context.content = this.components.reduce(function (tpl, comp) {
            return tpl + comp.render();
        }, '');
        return _super.prototype.renderContext.call(this, context);
    };
    Object.defineProperty(NestedComponent.prototype, "dataValue", {
        /**
         * Get the datavalue of this component.
         */
        get: function () {
            return this.data;
        },
        /**
         * Sets the datavalue for this component.
         */
        set: function (value) {
            if (Object.keys(value).length) {
                this.eachComponent(function (comp) {
                    comp.dataValue = _.get(value, comp.component.key);
                });
            }
        },
        enumerable: false,
        configurable: true
    });
    return NestedComponent;
}(Component_1.Component));
exports.NestedComponent = NestedComponent;
