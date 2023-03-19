import jsonLogic from 'json-logic-js';
import * as _ from '@formio/lodash';
import dayjs from 'dayjs';
import { lodashOperators } from './operators/operators';

// Configure JsonLogic
lodashOperators.forEach((name: string) => {
    if ((_ as any)[name]) {
        jsonLogic.add_operation(`_${name}`, (_ as any)[name]);
    }
});

// Retrieve Any Date
jsonLogic.add_operation('getDate', (date: any) => {
  return dayjs(date).toISOString();
});

// Set Relative Minimum Date
jsonLogic.add_operation('relativeMinDate', (relativeMinDate: any) => {
  return dayjs().subtract(relativeMinDate, 'days').toISOString();
});

// Set Relative Maximum Date
jsonLogic.add_operation('relativeMaxDate', (relativeMaxDate: any) => {
  return dayjs().add(relativeMaxDate, 'days').toISOString();
});

export { jsonLogic };