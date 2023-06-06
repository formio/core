import { Component } from './Component';
import { FieldError } from '../error/FieldError';
import { Evaluator } from '../evaluator/Evaluator';
import { DataObject } from './DataObject';
import { ValidatorConfig } from './ValidatorConfig';

export type RuleFn = (
    component: Component,
    data: DataObject,
    config: ValidatorConfig
) => Promise<FieldError | null>;
