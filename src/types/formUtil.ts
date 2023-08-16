import { Component, DataObject } from "types";

export type AsyncComponentDataCallback =
  (component: Component, data: DataObject, row: any, path: string, components?: Component[], index?: number) => Promise<boolean | void>;

export type ComponentDataCallback =
  (component: Component, data: DataObject, row: any, path: string, components?: Component[], index?: number) => boolean | void;
