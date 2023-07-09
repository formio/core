import { Component, DataObject } from "types";

export type AsyncComponentDataCallback =
  (component: Component, data: DataObject, path: string, components?: Component[], index?: number) => Promise<void>;
