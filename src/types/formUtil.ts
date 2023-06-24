import { FieldError } from "error";
import { Component, DataObject } from "types";

export type AsyncComponentDataCallback =
  (component: Component, data: DataObject, path: string, components?: Component[], errors?: FieldError[]) => Promise<void>;
