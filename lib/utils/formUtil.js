"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueName = exports.guid = exports.flattenComponents = exports.eachComponent = void 0;
const Evaluator_1 = require("./Evaluator");
const lodash_1 = require("@formio/lodash");
/**
 * Iterate through each component within a form.
 *
 * @param {Object} components
 *   The components to iterate.
 * @param {Function} fn
 *   The iteration function to invoke for each component.
 * @param {Boolean} includeAll
 *   Whether or not to include layout components.
 * @param {String} path
 *   The current data path of the element. Example: data.user.firstName
 * @param {Object} parent
 *   The parent object.
 */
function eachComponent(components, fn, includeAll, path, parent) {
    if (!components)
        return;
    path = path || '';
    components.forEach((component) => {
        if (!component) {
            return;
        }
        const hasColumns = component.columns && Array.isArray(component.columns);
        const hasRows = component.rows && Array.isArray(component.rows);
        const hasComps = component.components && Array.isArray(component.components);
        let noRecurse = false;
        const newPath = component.key ? (path ? (`${path}.${component.key}`) : component.key) : '';
        // Keep track of parent references.
        if (parent) {
            // Ensure we don't create infinite JSON structures.
            component.parent = Object.assign({}, parent);
            delete component.parent.components;
            delete component.parent.componentMap;
            delete component.parent.columns;
            delete component.parent.rows;
        }
        // there's no need to add other layout components here because we expect that those would either have columns, rows or components
        const layoutTypes = ['htmlelement', 'content'];
        const isLayoutComponent = hasColumns || hasRows || hasComps || layoutTypes.indexOf(component.type) > -1;
        if (includeAll || component.tree || !isLayoutComponent) {
            noRecurse = fn(component, newPath, components);
        }
        const subPath = () => {
            if (component.key &&
                !['panel', 'table', 'well', 'columns', 'fieldset', 'tabs', 'form'].includes(component.type) &&
                (['datagrid', 'container', 'editgrid', 'address', 'dynamicWizard'].includes(component.type) ||
                    component.tree)) {
                return newPath;
            }
            else if (component.key &&
                component.type === 'form') {
                return `${newPath}.data`;
            }
            return path;
        };
        if (!noRecurse) {
            if (hasColumns) {
                component.columns.forEach((column) => eachComponent(column.components, fn, includeAll, subPath(), parent ? component : null));
            }
            else if (hasRows) {
                component.rows.forEach((row) => {
                    if (Array.isArray(row)) {
                        row.forEach((column) => eachComponent(column.components, fn, includeAll, subPath(), parent ? component : null));
                    }
                });
            }
            else if (hasComps) {
                eachComponent(component.components, fn, includeAll, subPath(), parent ? component : null);
            }
        }
    });
}
exports.eachComponent = eachComponent;
/**
 * Flatten the form components for data manipulation.
 *
 * @param {Object} components
 *   The components to iterate.
 * @param {Boolean} includeAll
 *   Whether or not to include layout components.
 *
 * @returns {Object}
 *   The flattened components map.
 */
function flattenComponents(components, includeAll) {
    const flattened = {};
    eachComponent(components, (component, path) => {
        flattened[path] = component;
    }, includeAll);
    return flattened;
}
exports.flattenComponents = flattenComponents;
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x'
            ? r
            : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
exports.guid = guid;
/**
 * Make a filename guaranteed to be unique.
 * @param name
 * @param template
 * @param evalContext
 * @returns {string}
 */
function uniqueName(name, template, evalContext) {
    template = template || '{{fileName}}-{{guid}}';
    //include guid in template anyway, to prevent overwriting issue if filename matches existing file
    if (!template.includes('{{guid}}')) {
        template = `${template}-{{guid}}`;
    }
    const parts = name.split('.');
    let fileName = parts.slice(0, parts.length - 1).join('.');
    const extension = parts.length > 1
        ? `.${(0, lodash_1.last)(parts)}`
        : '';
    //allow only 100 characters from original name to avoid issues with filename length restrictions
    fileName = fileName.substr(0, 100);
    evalContext = Object.assign(evalContext || {}, {
        fileName,
        guid: guid()
    });
    //only letters, numbers, dots, dashes, underscores and spaces are allowed. Anything else will be replaced with dash
    const uniqueName = `${Evaluator_1.Evaluator.interpolate(template, evalContext)}${extension}`.replace(/[^0-9a-zA-Z.\-_ ]/g, '-');
    return uniqueName;
}
exports.uniqueName = uniqueName;
