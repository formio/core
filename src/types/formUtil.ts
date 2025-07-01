import { Component } from './Component';
import { DataObject } from './DataObject';

/**
 * Defines the Component paths used for every component within a form. This allows for
 * quick reference to either the "form" path or the "data" path of a component. These paths are
 * defined as follows.
 *
 *  - Form Path: The path to a component within the Form JSON. This path is used to locate a component provided a nested Form JSON object.
 *  - Data Path: The path to the data value of a component within the data model for the form. This path is used to provide the value path provided the Submission JSON object.
 *
 * These paths can also be broken into two different path "types".   Local and Full paths.
 *
 *  - Local Path: This is the path relative to the "current" form. This is used inside of a nested form to identify components and values relative to the current form in context.
 *  - Full Path: This is the path that is absolute to the root form object. Any nested form paths will include the parent form path as part of the value for the provided path.
 */
export enum ComponentPath {
  /**
   * The "form" path to the component including all parent paths (exclusive of layout components). This path is used to uniquely identify component within a form inclusive of any parent form paths.
   *
   * For example: Suppose you have the following form structure.
   *    - Root
   *      - Panel 1 (panel)
   *        - Form (form)
   *          - Panel 2 (panel2)
   *            - Data Grid (dataGrid)
   *              - Panel 3 (panel3)
   *                - TextField (textField)
   *
   * The "path" to the TextField component from the perspective of a configuration within the Form, would be "form.dataGrid.textField"
   */
  path = 'path',

  /**
   * The "form" path to the component including all parent paths (inclusive of layout componnts). This path is used to uniquely identify component within a form inclusive of any parent form paths.
   *
   * For example: Suppose you have the following form structure.
   *    - Root
   *      - Panel 1 (panel)
   *        - Form (form)
   *          - Panel 2 (panel2)
   *            - Data Grid (dataGrid)
   *              - Panel 3 (panel3)
   *                - TextField (textField)
   *
   * The "fullPath" to the TextField component from the perspective of a configuration within the Form, would be "panel1.form.panel2.dataGrid.panel3.textField"
   */
  fullPath = 'fullPath',

  /**
   * The local "form" path to the component. This is the local path to any component within a form. This
   * path is consistent no matter if this form is nested within another form or not. All form configurations
   * are in relation to this path since forms are configured independently. The difference between a form path
   * and a dataPath is that this includes any parent layout components to locate the component provided a form JSON.
   * This path does NOT include any layout components.
   *
   * For example: Suppose you have the following form structure.
   *    - Root
   *      - Panel 1 (panel)
   *        - Form (form)
   *          - Panel 2 (panel2)
   *            - Data Grid (dataGrid)
   *              - Panel 3 (panel3)
   *                - TextField (textField)
   *
   * The "path" to the TextField component from the perspective of a configuration within the Form, would be "dataGrid.textField"
   */
  localPath = 'localPath',

  /**
   * The local "form" path to the component. This is the local path to any component within a form. This
   * path is consistent no matter if this form is nested within another form or not. All form configurations
   * are in relation to this path since forms are configured independently. The difference between a form path
   * and a dataPath is that this includes any parent layout components to locate the component provided a form JSON.
   * This path does NOT include any layout components.
   *
   * For example: Suppose you have the following form structure.
   *    - Root
   *      - Panel 1 (panel)
   *        - Form (form)
   *          - Panel 2 (panel2)
   *            - Data Grid (dataGrid)
   *              - Panel 3 (panel3)
   *                - TextField (textField)
   *
   * The "path" to the TextField component from the perspective of a configuration within the Form, would be "panel2.dataGrid.panel3.textField"
   */
  fullLocalPath = 'fullLocalPath',

  /**
   *  The "data" path to the component including all parent paths. This path is used to fetch the data value of a component within a data model, inclusive of any parent data paths of nested forms.
   *
   * For example: Suppose you have the following form structure.
   *    - Root
   *      - Panel 1 (panel)
   *        - Form (form)
   *          - Panel 2 (panel2)
   *            - Data Grid (dataGrid)
   *              - Panel 3 (panel3)
   *                - TextField (textField)
   *
   * The "dataPath" to the TextField component would be "form.data.dataGrid[1].textField"
   */
  dataPath = 'dataPath',

  /**
   * The "data" path is the local path to the data value for any component. The difference between this path
   * and the "path" is that this path is used to locate the data value for a component within the data model.
   * and does not include any keys for layout components.
   *
   * For example: Suppose you have the following form structure.
   *    - Root
   *      - Panel 1 (panel)
   *        - Form (form)
   *          - Panel 2 (panel2)
   *            - Data Grid (dataGrid)
   *              - Panel 3 (panel3)
   *                - TextField (textField)
   *
   * The "localDataPath" to the TextField component from the perspective of a configuration within the Form, would be "dataGrid[1].textField"
   */
  localDataPath = 'localDataPath',

  /**
   * The contextual "row" path for the component.
   */
  localContextualRowPath = 'localContextualRowPath',
  contextualRowPath = 'contextualRowPath',
}

/**
 * The types of paths that can be set on a component.
 */
export type ComponentPaths = {
  path?: string;
  fullPath?: string;
  localPath?: string;
  fullLocalPath?: string;
  dataPath?: string;
  localDataPath?: string;
  dataIndex?: number;
  contextualRowPath?: string;
  localContextualRowPath?: string;
};

export type EachComponentDataAsyncCallback = (
  component: Component,
  data: DataObject,
  row: any,
  path: string,
  components?: Component[],
  index?: number,
  parent?: Component | null,
  paths?: ComponentPaths,
) => Promise<boolean | void>;

export type EachComponentDataCallback = (
  component: Component,
  data: DataObject,
  row: any,
  path: string,
  components?: Component[],
  index?: number,
  parent?: Component | null,
  paths?: ComponentPaths,
) => boolean | void;

export type EachComponentCallback = (
  component: Component,
  path: string,
  components?: Component[],
  parent?: Component,
  paths?: ComponentPaths,
) => boolean | void;

export type EachComponentAsyncCallback = (
  component: Component,
  path: string,
  components?: Component[],
  parent?: Component,
  paths?: ComponentPaths,
) => Promise<boolean | void>;

export type FetchFn = (url: string, options?: RequestInit) => Promise<any>;
