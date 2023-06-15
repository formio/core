import { Component } from './Component';
import { FieldError } from '../error/FieldError';
import { DataObject } from './DataObject';
import { ProcessContext } from './process/ProcessContext.js';

export type RuleFn = (context: ProcessContext) => Promise<FieldError | null>;
