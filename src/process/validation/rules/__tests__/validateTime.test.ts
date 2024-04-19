import { expect } from 'chai';
import { TimeComponent } from 'types';
import { FieldError } from 'error';

import { generateProcessorContext } from './fixtures/util';
import { validateTime } from '../validateTime';

const timeField: TimeComponent = {
    type: 'time',
    key: 'time',
    label: 'Time',
    input: true,
    dataFormat: 'HH:mm:ss'
};

it('Should validate a time component with a valid time value', async () => {
    const data = { time: '12:00:00' };
    const context = generateProcessorContext(timeField, data);
    const result = await validateTime(context);
    expect(result).to.equal(null);
});

it('Should return a FieldError when validating a time component with an invalid time value', async () => {
    const data = { time: '25:00:00' };
    const context = generateProcessorContext(timeField, data);
    const result = await validateTime(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('time');
});

it('Should return a FieldError when validating a time component with a valid format but one that does not match the dataFormat', async () => {
    const data = { time: '12:00' };
    const context = generateProcessorContext(timeField, data);
    const result = await validateTime(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('time');
});

it('Should return a FieldError when validating a time component with an invalid format', async () => {
    const data = { time: '12:' };
    const context = generateProcessorContext(timeField, data);
    const result = await validateTime(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('time');
});
