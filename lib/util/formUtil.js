"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueName = exports.guid = exports.eachComponent = void 0;
var Evaluator_1 = require("./Evaluator");
var lodash_1 = require("@formio/lodash");
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
    components.forEach(function (component) {
        if (!component) {
            return;
        }
        var hasColumns = component.columns && Array.isArray(component.columns);
        var hasRows = component.rows && Array.isArray(component.rows);
        var hasComps = component.components && Array.isArray(component.components);
        var noRecurse = false;
        var newPath = component.key ? (path ? (path + "." + component.key) : component.key) : '';
        // Keep track of parent references.
        if (parent) {
            // Ensure we don't create infinite JSON structures.
            component.parent = __assign({}, parent);
            delete component.parent.components;
            delete component.parent.componentMap;
            delete component.parent.columns;
            delete component.parent.rows;
        }
        // there's no need to add other layout components here because we expect that those would either have columns, rows or components
        var layoutTypes = ['htmlelement', 'content'];
        var isLayoutComponent = hasColumns || hasRows || hasComps || layoutTypes.indexOf(component.type) > -1;
        if (includeAll || component.tree || !isLayoutComponent) {
            noRecurse = fn(component, newPath, components);
        }
        var subPath = function () {
            if (component.key &&
                !['panel', 'table', 'well', 'columns', 'fieldset', 'tabs', 'form'].includes(component.type) &&
                (['datagrid', 'container', 'editgrid', 'address', 'dynamicWizard'].includes(component.type) ||
                    component.tree)) {
                return newPath;
            }
            else if (component.key &&
                component.type === 'form') {
                return newPath + ".data";
            }
            return path;
        };
        if (!noRecurse) {
            if (hasColumns) {
                component.columns.forEach(function (column) {
                    return eachComponent(column.components, fn, includeAll, subPath(), parent ? component : null);
                });
            }
            else if (hasRows) {
                component.rows.forEach(function (row) {
                    if (Array.isArray(row)) {
                        row.forEach(function (column) {
                            return eachComponent(column.components, fn, includeAll, subPath(), parent ? component : null);
                        });
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
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x'
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
        template = template + "-{{guid}}";
    }
    var parts = name.split('.');
    var fileName = parts.slice(0, parts.length - 1).join('.');
    var extension = parts.length > 1
        ? "." + lodash_1.last(parts)
        : '';
    //allow only 100 characters from original name to avoid issues with filename length restrictions
    fileName = fileName.substr(0, 100);
    evalContext = Object.assign(evalContext || {}, {
        fileName: fileName,
        guid: guid()
    });
    //only letters, numbers, dots, dashes, underscores and spaces are allowed. Anything else will be replaced with dash
    var uniqueName = ("" + Evaluator_1.Evaluator.interpolate(template, evalContext) + extension).replace(/[^0-9a-zA-Z.\-_ ]/g, '-');
    return uniqueName;
}
exports.uniqueName = uniqueName;
