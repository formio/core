import { Component } from './Component';
import { DataObject } from './DataObject';
import { Form } from './Form';
import { Evaluator } from 'utils/Evaluator';

export type PassedComponentInstance = {
  evalContext: () => {
    component: Component;
    data: DataObject;
    row: DataObject;
    rowIndex: number;
    iconClass: string;
    t: (message: string) => string;
    submission: {
      data: DataObject;
    };
    form: Form;
    options: Record<string, any>;
  };
  evaluate?: typeof Evaluator.evaluate;
  interpolate?: typeof Evaluator.interpolate;
  shouldSkipValidation: (data?: DataObject, row?: DataObject) => boolean;
  loadedOptions?: Array<{ invalid: boolean; value: any; label: string }>;
};
