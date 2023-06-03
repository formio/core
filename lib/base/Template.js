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
exports.Template = void 0;
const _ = __importStar(require("@formio/lodash"));
/**
 * Manages all the available templates which can be rendered.
 */
class Template {
    /**
     * Adds a collection of template frameworks to the renderer.
     * @param templates
     */
    static addTemplates(templates) {
        var framework = Template.framework;
        Template.templates = _.merge(Template.templates, templates);
        Template.framework = framework;
    }
    /**
     * Adds some templates to the existing template.
     * @param name
     * @param template
     */
    static addTemplate(name, template) {
        Template.templates[name] = _.merge(Template.current, template);
    }
    /**
     * Extend an existing template.
     * @param name
     * @param template
     */
    static extendTemplate(name, template) {
        Template.templates[name] = _.merge(Template.templates[name], template);
    }
    /**
     * Sets a template.
     * @param name
     * @param template
     */
    static setTemplate(name, template) {
        Template.addTemplate(name, template);
    }
    /**
     * Set the current template.
     */
    static set current(templates) {
        const defaultTemplates = Template.current;
        Template._current = _.merge(defaultTemplates, templates);
    }
    /**
     * Get the current template.
     */
    static get current() {
        return Template._current;
    }
    /**
     * Sets the current framework.
     */
    static set framework(framework) {
        if (Template.templates.hasOwnProperty(framework)) {
            Template._framework = framework;
            Template._current = Template.templates[framework];
        }
    }
    /**
     * Gets the current framework.
     */
    static get framework() {
        return Template._framework;
    }
    /**
     * Render a partial within the current template.
     * @param name
     * @param ctx
     * @param mode
     * @returns
     */
    static render(name, ctx, mode = 'html', defaultTemplate = null) {
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
    }
}
exports.Template = Template;
Template.templates = [];
Template._current = {};
Template._framework = 'bootstrap';
