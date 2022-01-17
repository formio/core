import { fastCloneDeep, get, set, has, each, find, filter } from '@formio/lodash';
import { eachComponent } from './formUtil';
export function mergeObject(src: any, dst: any) {
    each(src, function (value: any, key: any) {
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

export function mergeArray(src: any, dst: any) {
    src.forEach(function (value: any) {
        var query: any = {};
        each(value, function (subValue: any, key: any) {
            if (!Array.isArray(subValue)) {
                query[key] = subValue;
            }
        });
        var dstValue = find(dst, query);
        if (dstValue) {
            mergeObject(value, dstValue);
        }
        else {
            dst.push(value);
        }
    });
}

export function rewind(submissions: any) {
    var submission = { data: {} };
    if (submissions && submissions.length) {
        submissions.forEach((sub: any) => mergeObject(sub.data, submission.data));
    }
    return submission;
}

export function unwind(form: any, submission: any) {
    var dataPaths = {};
    var locked = {};
    var submissions = [fastCloneDeep(submission)];
    // Set the data value for a data path.
    /* eslint-disable no-use-before-define */
    var setDataValue = function (dataPath: any, values: any, parent: any, offset: any, current: any) {
        offset = offset || 0;
        current = current || 0;
        // Make sure we don't overwrite any locked values.
        while (has(locked, "[" + current + "]." + parent)) {
            if ((current + 1) >= submissions.length) {
                submissions.push(fastCloneDeep(submissions[current]));
            }
            current++;
        }
        // Ensure that all parents have been copied over to this path.
        /* eslint-disable no-useless-escape */
        var parentPath = parent.replace(/\.[^\.]+$/, '');
        if (!has(submissions[current].data, parentPath) &&
            submissions[current - 1] &&
            has(submissions[(current - 1)].data, parentPath)) {
            set(submissions[current].data, parentPath, fastCloneDeep(get(submissions[(current - 1)].data, parentPath)));
        }
        /* eslint-enable no-useless-escape */
        var pathValue: any = [];
        set(submissions[current].data, parent, pathValue);
        set(locked, "[" + current + "]." + parent, true);
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
    var addData = function (dataPaths: any, data: any, parent?: any, current?: any) {
        for (var path in dataPaths) {
            var dataPath = dataPaths[path];
            if (data[path] && Array.isArray(data[path])) {
                setDataValue(dataPath, data[path], (parent ? parent + "." + path : path), 0, current);
            }
        }
    };
    var addDataPaths = function (dataPath: any, paths: any, index?: any, parentDataPath?: any) {
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
    eachComponent(form.components, function (component: any, path: any) {
        if (component.type === 'form' && component.components?.length) {
            eachComponent(component.components, (comp: any) => {
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
        var paths = filter(path.replace(new RegExp(".?" + component.key + "$"), '').split('.'));
        /* eslint-enable no-useless-escape */
        if (!hasDataPath && paths.length && !component.isInsideNestedForm) {
            key = paths.map(function (subpath: any) { return subpath + "[0]"; }).join('.') + "." + component.key;
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
