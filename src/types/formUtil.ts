import { Component, DataObject } from "types";

export type AsyncComponentDataCallback =
  (component: Component, data: DataObject, row: any, path: string, components?: Component[], index?: number, parent?: (Component | null)) => Promise<boolean | void>;

export type ComponentDataCallback =
  (component: Component, data: DataObject, row: any, path: string, components?: Component[], index?: number, parent?: (Component | null)) => boolean | void;

export type FetchFn = (url: string, options?: RequestInit) => Promise<any>;