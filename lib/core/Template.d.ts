/**
 * Manages all the available templates which can be rendered.
 */
export declare class Template {
    static templates: any;
    static _current: any;
    static _framework: string;
    /**
     * Adds a collection of template frameworks to the renderer.
     * @param templates
     */
    static addTemplates(templates: any): void;
    /**
     * Adds some templates to the existing template.
     * @param name
     * @param template
     */
    static addTemplate(name: string, template: any): void;
    /**
     * Extend an existing template.
     * @param name
     * @param template
     */
    static extendTemplate(name: string, template: any): void;
    /**
     * Sets a template.
     * @param name
     * @param template
     */
    static setTemplate(name: string, template: any): void;
    /**
     * Set the current template.
     */
    static set current(templates: any);
    /**
     * Get the current template.
     */
    static get current(): any;
    /**
     * Sets the current framework.
     */
    static set framework(framework: string);
    /**
     * Gets the current framework.
     */
    static get framework(): string;
    /**
     * Render a partial within the current template.
     * @param name
     * @param ctx
     * @param mode
     * @returns
     */
    static render(name: any, ctx: any, mode?: string, defaultTemplate?: any): any;
}
