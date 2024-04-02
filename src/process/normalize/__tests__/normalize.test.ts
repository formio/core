import { expect } from 'chai';

import { TimeComponent, SelectBoxesComponent } from 'types';
import { normalizeProcessSync } from '../';
import { generateProcessorContext } from '../../__tests__/fixtures/util';

it('Should normalize a time component with a valid time value that doees not match dataFormat', async () => {
    const timeComp: TimeComponent = {
        type: 'time',
        key: 'time',
        label: 'Time',
        input: true,
        dataFormat: 'HH:mm:ss'
    };
    const data = { time: '12:00' };
    const context = generateProcessorContext(timeComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({time: '12:00:00'});
});

it('Should normalize a select boxes component with an incorrect data model', () => {
    const selectBoxesComp: SelectBoxesComponent = {
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
    const context = generateProcessorContext(selectBoxesComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({selectBoxes: {}});
});

it('Should normalize an email component value', () => {
    const emailComp = {
        type: 'email',
        key: 'email',
        input: true,
        label: 'Email'
    };
    const data = {
        email: 'BrendanBond@Gmail.com'
    };
    const context = generateProcessorContext(emailComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({email: 'brendanbond@gmail.com'});
});

it('Should normalize a radio component with a string value', () => {
    const radioComp = {
        type: 'radio',
        key: 'radio',
        input: true,
        label: 'Radio',
        values: [
            {
                label: 'Yes',
                value: 'true',
            },
            {
                label: 'No',
                value: 'false',
            }
        ]
    };
    const data = {
        radio: 'true'
    };
    const context = generateProcessorContext(radioComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({radio: true});
});

it('Should normalize a radio component value with a number', () => {
    const radioComp = {
        type: 'radio',
        key: 'radio',
        input: true,
        label: 'Radio',
        values: [
            {
                label: 'Yes',
                value: '1',
            },
            {
                label: 'No',
                value: '0',
            }
        ]
    };
    const data = {
        radio: '0'
    };
    const context = generateProcessorContext(radioComp, data);
    normalizeProcessSync(context);
    expect(context.data).to.deep.equal({radio: 0});
});
