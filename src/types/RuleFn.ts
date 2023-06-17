import { Component } from './Component';
import { FieldError } from '../error/FieldError';
import { DataObject } from './DataObject';
import { ProcessorContext } from './process/ProcessorContext.js';

export type RuleFn = (context: ProcessorContext) => Promise<FieldError | null>;
