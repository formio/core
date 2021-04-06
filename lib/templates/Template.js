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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
var index_1 = __importDefault(require("./index"));
var _ = __importStar(require("@formio/lodash"));
/**
 * Manages all the available templates which can be rendered.
 */
var Template = /** @class */ (function () {
    function Template() {
    }
    /**
     * Adds a collection of template frameworks to the renderer.
     * @param templates
     */
    Template.addTemplates = function (templates) {
        var framework = Template.framework;
        Template.templates = _.merge(Template.templates, templates);
        Template.framework = framework;
    };
    /**
     * Adds some templates to the existing template.
     * @param name
     * @param template
     */
    Template.addTemplate = function (name, template) {
        var newTemplate = Template.templates[name] = _.merge(Template.current, template);
    };
    /**
     * Extend an existing template.
     * @param name
     * @param template
     */
    Template.extendTemplate = function (name, template) {
        Template.templates[name] = _.merge(Template.templates[name], template);
    };
    /**
     * Sets a template.
     * @param name
     * @param template
     */
    Template.setTemplate = function (name, template) {
        Template.addTemplate(name, template);
    };
    Object.defineProperty(Template, "current", {
        /**
         * Get the current template.
         */
        get: function () {
            return Template._current;
        },
        /**
         * Set the current template.
         */
        set: function (templates) {
            var defaultTemplates = Template.current;
            Template._current = _.merge(defaultTemplates, templates);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Template, "framework", {
        /**
         * Gets the current framework.
         */
        get: function () {
            return Template._framework;
        },
        /**
         * Sets the current framework.
         */
        set: function (framework) {
            if (Template.templates.hasOwnProperty(framework)) {
                Template._framework = framework;
                Template._current = Template.templates[framework];
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Render a partial within the current template.
     * @param name
     * @param ctx
     * @param mode
     * @returns
     */
    Template.render = function (name, ctx, mode, defaultTemplate) {
        if (mode === void 0) { mode = 'html'; }
        if (defaultTemplate === void 0) { defaultTemplate = null; }
        if (typeof name === 'function') {
            return name(ctx);
        }
        if (this.current[name] && this.current[name][mode]) {
            return this.current[name][mode](ctx);
        }
        if (defaultTemplate) {
            return defaultTemplate(ctx);
        }
        return 'Unknown template';
    };
    Template.templates = index_1.default;
    Template._current = index_1.default.bootstrap;
    Template._framework = 'bootstrap';
    return Template;
}());
exports.Template = Template;
