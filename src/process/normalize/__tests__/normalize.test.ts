import { expect } from 'chai';

import { TimeComponent } from 'types';
import { normalizeProcessSync } from '../';
import { generateProcessorContext } from '../../__tests__/fixtures/util';

const timeField: TimeComponent = {
    type: 'time',
    key: 'time',
    label: 'Time',
    input: true,
    dataFormat: 'HH:mm:ss'
};

it('Should normalize a time component with a valid time value that doees not match dataFormat', async () => {
    const data = { time: '12:00' };
    const context = generateProcessorContext(timeField, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({time: '12:00:00'});
});
