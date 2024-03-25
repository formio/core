import { expect } from 'chai';

import { TimeComponent, SelectBoxesComponent } from 'types';
import { normalizeProcessSync } from '../';
import { generateProcessorContext } from '../../__tests__/fixtures/util';

it('Should normalize a time component with a valid time value that doees not match dataFormat', async () => {
    const timeField: TimeComponent = {
        type: 'time',
        key: 'time',
        label: 'Time',
        input: true,
        dataFormat: 'HH:mm:ss'
    };
    const data = { time: '12:00' };
    const context = generateProcessorContext(timeField, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({time: '12:00:00'});
});

it('Should normalize a select boxes component with an incorrect data model', () => {
    const selectBoxesField: SelectBoxesComponent = {
        type: 'selectboxes',
        key: 'selectBoxes',
        label: 'Select Boxes',
        input: true,
        values: [
            {label: 'One', value: 'one'},
            {label: 'Two', value: 'two'},
            {label: 'Three', value: 'three'}
        ]
    };
    const data = {
        selectBoxes: ''
    };
    const context = generateProcessorContext(selectBoxesField, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({selectBoxes: {}});
});
