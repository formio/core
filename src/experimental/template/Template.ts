import { merge } from 'lodash';

/**
 * Manages all the available templates which can be rendered.
 */
export class Template {
  public static templates: any = {};
  public static _current: any = {};
  public static _framework: string = 'bootstrap';

  /**
   * Adds a collection of template frameworks to the renderer.
   * @param templates
   */
  public static addTemplates(templates: any) {
    const framework = Template.framework;
    Template.templates = merge(Template.templates, templates);
    Template.framework = framework;
  }

  /**
   * Adds some templates to the existing template.
   * @param name
   * @param template
   */
  public static addTemplate(name: string, template: any) {
    Template.templates[name] = merge(Template.current, template);
    if (Template.templates.hasOwnProperty(Template._framework)) {
      Template._current = Template.templates[Template._framework];
    }
  }

  /**
   * Extend an existing template.
   * @param name
   * @param template
   */
  public static extendTemplate(name: string, template: any) {
    Template.templates[name] = merge(Template.templates[name], template);
    if (Template.templates.hasOwnProperty(Template._framework)) {
      Template._current = Template.templates[Template._framework];
    }
  }

  /**
   * Sets a template.
   * @param name
   * @param template
   */
  public static setTemplate(name: string, template: any) {
    Template.addTemplate(name, template);
  }

  /**
   * Set the current template.
   */
  public static set current(templates) {
    const defaultTemplates = Template.current;
    Template._current = merge(defaultTemplates, templates);
  }

  /**
   * Get the current template.
   */
  public static get current() {
    return Template._current;
  }

  /**
   * Sets the current framework.
   */
  public static set framework(framework) {
    Template._framework = framework;
    if (Template.templates.hasOwnProperty(framework)) {
      Template._current = Template.templates[framework];
    }
  }

  /**
   * Gets the current framework.
   */
  public static get framework() {
    return Template._framework;
  }

  /**
   * Render a partial within the current template.
   * @param name
   * @param ctx
   * @param mode
   * @returns
   */
  public static render(name: any, ctx: any, mode: string = 'html', defaultTemplate: any = null) {
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
