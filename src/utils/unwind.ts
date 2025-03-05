import { get, set, has, each, find, filter } from 'lodash';
import { fastCloneDeep } from './fastCloneDeep';
import { eachComponent } from './formUtil';
export function mergeObject(src: any, dst: any) {
  each(src, function (value: any, key: any) {
    if (!Array.isArray(value)) {
      dst[key] = value;
    } else {
      if (!dst[key]) {
        dst[key] = [];
      }
      mergeArray(value, dst[key]);
    }
  });
}

export function mergeArray(src: any, dst: any) {
  src.forEach(function (value: any) {
    const query: any = {};
    each(value, function (subValue: any, key: any) {
      if (!Array.isArray(subValue)) {
        query[key] = subValue;
      }
    });
    const dstValue = find(dst, query);
    if (dstValue) {
      mergeObject(value, dstValue);
    } else {
      dst.push(value);
    }
  });
}

export function rewind(submissions: any) {
  const submission = { data: {} };
  if (submissions && submissions.length) {
    submissions.forEach((sub: any) => mergeObject(sub.data, submission.data));
  }
  return submission;
}

/**
 * @deprecated This method is no longer supported
 */
export function unwind(form: any, submission: any) {
  const dataPaths = {};
  const locked = {};
  const submissions = [fastCloneDeep(submission)];
  // Set the data value for a data path.

  const setDataValue = function (
    dataPath: any,
    values: any,
    parent: any,
    offset: any,
    current: any,
  ) {
    offset = offset || 0;
    current = current || 0;
    // Make sure we don't overwrite any locked values.
    while (has(locked, '[' + current + '].' + parent)) {
      if (current + 1 >= submissions.length) {
        submissions.push(fastCloneDeep(submissions[current]));
      }
      current++;
    }
    // Ensure that all parents have been copied over to this path.
    /* eslint-disable no-useless-escape */
    const parentPath = parent.replace(/\.[^\.]+$/, '');
    if (
      !has(submissions[current].data, parentPath) &&
      submissions[current - 1] &&
      has(submissions[current - 1].data, parentPath)
    ) {
      set(
        submissions[current].data,
        parentPath,
        fastCloneDeep(get(submissions[current - 1].data, parentPath)),
      );
    }
    /* eslint-enable no-useless-escape */
    const pathValue: any = [];
    set(submissions[current].data, parent, pathValue);
    set(locked, '[' + current + '].' + parent, true);
    for (let i = offset; i < values.length; i++) {
      if (i - offset <= dataPath.max) {
        pathValue.push(values[i]);
        if (dataPath.paths && Object.keys(dataPath.paths).length) {
          addData(dataPath.paths, values[i], parent + '[' + (i - offset) + ']', current);
        }
      } else {
        setDataValue(dataPath, values, parent, i, current);
        break;
      }
    }
  };

  // Add data to a series of data paths.
  const addData = function (dataPaths: any, data: any, parent?: any, current?: any) {
    for (const path in dataPaths) {
      const dataPath = dataPaths[path];
      if (data[path] && Array.isArray(data[path])) {
        setDataValue(dataPath, data[path], parent ? parent + '.' + path : path, 0, current);
      }
    }
  };
  const addDataPaths = function (dataPath: any, paths: any, index?: any, parentDataPath?: any) {
    index = index || 0;
    const path = paths[index];
    /* eslint-disable no-useless-escape */
    const matches = path.match(/([^\[]+)\[?([0-9]+)?\]?/);
    /* eslint-enable no-useless-escape */
    if (matches && matches.length === 3) {
      const dataParam = matches[1];
      const dataIndex = parseInt(matches[2], 10) || 0;
      if (dataPath[dataParam]) {
        if (dataIndex > dataPath[dataParam].max) {
          dataPath[dataParam].max = dataIndex;
        }
      } else {
        dataPath[dataParam] = {
          max: dataIndex,
          param: dataParam,
          parent: parentDataPath || null,
          paths: {},
        };
      }
      if (index + 1 < paths.length) {
        addDataPaths(dataPath[dataParam].paths, paths, index + 1, dataPath[dataParam]);
      }
    }
  };

  // Iterate through all components.
  eachComponent(
    form.components,
    function (component: any, path: any) {
      if (component.type === 'form' && component.components?.length) {
        eachComponent(component.components, (comp: any) => {
          comp.isInsideNestedForm = true;
        });
      }
      if (!component.overlay || (!component.overlay.width && !component.overlay.height)) {
        return;
      }

      const hasDataPath = component.properties && component.properties.dataPath;
      let key = component.key;
      if (hasDataPath) {
        path = component.properties.dataPath;
        key = component.properties.dataPath;
      }

      const paths = filter(path.replace(new RegExp('.?' + component.key + '$'), '').split('.'));

      if (!hasDataPath && paths.length && !component.isInsideNestedForm) {
        key = paths.join('.') + '.' + component.key;
      }
      if (component.multiple) {
        paths.push(component.key);
      }
      component.key = key;
      if (paths && paths.length) {
        addDataPaths(dataPaths, paths);
      }
    },
    true,
  );
  addData(dataPaths, submission.data);
  return submissions;
}
