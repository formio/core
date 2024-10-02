import { Component, DataObject } from "types";

export type EachComponentDataAsyncCallback =
  (component: Component, data: DataObject, row: any, path: string, components?: Component[], index?: number, parent?: (Component | null)) => Promise<boolean | void>;

export type EachComponentDataCallback =
  (component: Component, data: DataObject, row: any, path: string, components?: Component[], index?: number, parent?: (Component | null)) => boolean | void;

export type EachComponentCallback = (component: Component, path: string, components?: Component[], parent?: Component) => boolean | void;

export type FetchFn = (url: string, options?: RequestInit) => Promise<any>;

