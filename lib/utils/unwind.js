"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwind = exports.rewind = exports.mergeArray = exports.mergeObject = void 0;
const lodash_1 = require("@formio/lodash");
const formUtil_1 = require("./formUtil");
function mergeObject(src, dst) {
    (0, lodash_1.each)(src, function (value, key) {
        if (!Array.isArray(value)) {
            dst[key] = value;
        }
        else {
            if (!dst[key]) {
                dst[key] = [];
            }
            mergeArray(value, dst[key]);
        }
    });
}
exports.mergeObject = mergeObject;
function mergeArray(src, dst) {
    src.forEach(function (value) {
        var query = {};
        (0, lodash_1.each)(value, function (subValue, key) {
            if (!Array.isArray(subValue)) {
                query[key] = subValue;
            }
        });
        var dstValue = (0, lodash_1.find)(dst, query);
        if (dstValue) {
            mergeObject(value, dstValue);
        }
        else {
            dst.push(value);
        }
    });
}
exports.mergeArray = mergeArray;
function rewind(submissions) {
    var submission = { data: {} };
    if (submissions && submissions.length) {
        submissions.forEach((sub) => mergeObject(sub.data, submission.data));
    }
    return submission;
}
exports.rewind = rewind;
function unwind(form, submission) {
    var dataPaths = {};
    var locked = {};
    var submissions = [(0, lodash_1.fastCloneDeep)(submission)];
    // Set the data value for a data path.
    /* eslint-disable no-use-before-define */
    var setDataValue = function (dataPath, values, parent, offset, current) {
        offset = offset || 0;
        current = current || 0;
        // Make sure we don't overwrite any locked values.
        while ((0, lodash_1.has)(locked, "[" + current + "]." + parent)) {
            if ((current + 1) >= submissions.length) {
                submissions.push((0, lodash_1.fastCloneDeep)(submissions[current]));
            }
            current++;
        }
        // Ensure that all parents have been copied over to this path.
        /* eslint-disable no-useless-escape */
        var parentPath = parent.replace(/\.[^\.]+$/, '');
        if (!(0, lodash_1.has)(submissions[current].data, parentPath) &&
            submissions[current - 1] &&
            (0, lodash_1.has)(submissions[(current - 1)].data, parentPath)) {
            (0, lodash_1.set)(submissions[current].data, parentPath, (0, lodash_1.fastCloneDeep)((0, lodash_1.get)(submissions[(current - 1)].data, parentPath)));
        }
        /* eslint-enable no-useless-escape */
        var pathValue = [];
        (0, lodash_1.set)(submissions[current].data, parent, pathValue);
        (0, lodash_1.set)(locked, "[" + current + "]." + parent, true);
        for (var i = offset; i < values.length; i++) {
            if ((i - offset) <= dataPath.max) {
                pathValue.push(values[i]);
                if (dataPath.paths && Object.keys(dataPath.paths).length) {
                    addData(dataPath.paths, values[i], parent + "[" + (i - offset) + "]", current);
                }
            }
            else {
                setDataValue(dataPath, values, parent, i, current);
                break;
            }
        }
    };
    /* eslint-enable no-use-before-define */
    // Add data to a series of data paths.
    var addData = function (dataPaths, data, parent, current) {
        for (var path in dataPaths) {
            var dataPath = dataPaths[path];
            if (data[path] && Array.isArray(data[path])) {
                setDataValue(dataPath, data[path], (parent ? parent + "." + path : path), 0, current);
            }
        }
    };
    var addDataPaths = function (dataPath, paths, index, parentDataPath) {
        index = index || 0;
        var path = paths[index];
        /* eslint-disable no-useless-escape */
        var matches = path.match(/([^\[]+)\[?([0-9]+)?\]?/);
        /* eslint-enable no-useless-escape */
        if (matches && (matches.length === 3)) {
            var dataParam = matches[1];
            var dataIndex = parseInt(matches[2], 10) || 0;
            if (dataPath[dataParam]) {
                if (dataIndex > dataPath[dataParam].max) {
                    dataPath[dataParam].max = dataIndex;
                }
            }
            else {
                dataPath[dataParam] = {
                    max: dataIndex,
                    param: dataParam,
                    parent: parentDataPath || null,
                    paths: {}
                };
            }
            if ((index + 1) < paths.length) {
                addDataPaths(dataPath[dataParam].paths, paths, (index + 1), dataPath[dataParam]);
            }
        }
    };
    // Iterate through all components.
    (0, formUtil_1.eachComponent)(form.components, function (component, path) {
        var _a;
        if (component.type === 'form' && ((_a = component.components) === null || _a === void 0 ? void 0 : _a.length)) {
            (0, formUtil_1.eachComponent)(component.components, (comp) => {
                comp.isInsideNestedForm = true;
            });
        }
        if (!component.overlay || (!component.overlay.width && !component.overlay.height)) {
            return;
        }
        var hasDataPath = component.properties && component.properties.dataPath;
        var key = component.key;
        if (hasDataPath) {
            path = component.properties.dataPath;
            key = component.properties.dataPath;
        }
        /* eslint-disable no-useless-escape */
        var paths = (0, lodash_1.filter)(path.replace(new RegExp(".?" + component.key + "$"), '').split('.'));
        /* eslint-enable no-useless-escape */
        if (!hasDataPath && paths.length && !component.isInsideNestedForm) {
            key = paths.map(function (subpath) { return subpath + "[0]"; }).join('.') + "." + component.key;
        }
        if (component.multiple) {
            paths.push(component.key);
        }
        component.key = key;
        if (paths && paths.length) {
            addDataPaths(dataPaths, paths);
        }
    }, true);
    addData(dataPaths, submission.data);
    return submissions;
}
exports.unwind = unwind;
