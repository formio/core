import jsonLogic from 'json-logic-js';
import { dayjs } from 'utils/date';
import { operators } from './operators';

// Configure JsonLogic
for (const operator in operators) {
  jsonLogic.add_operation(`_${operator}`, operators[operator]);
}

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
