import { expect } from 'chai';

import { filterProcessSync } from '../';
import { generateProcessorContext } from '../../__tests__/fixtures/util';

it('Should not filter empty array value for dataGrid component', async () => {
    const dataGridComp = {
        type: 'datagrid',
        key: 'dataGrid',
        input: true,
        path: 'dataGrid',
        components: [
            {
                type: 'textfield',
                key: 'textField',
                input: true,
                label: 'Text Field'
            }
        ]
    };
    const data = {
        dataGrid: []
    };
    const context: any = generateProcessorContext(dataGridComp, data);
    filterProcessSync(context);
    expect(context.scope.filter).to.deep.equal({'dataGrid': {'compModelType': 'array', 'include': true, value: []}});
});

it('Should not filter empty array value for editGrid component', async () => {
    const editGridComp = {
        type: 'editgrid',
        key: 'editGrid',
        input: true,
        path: 'editGrid',
        components: [
            {
                type: 'textfield',
                key: 'textField',
                input: true,
                label: 'Text Field'
            }
        ]
    };
    const data = {
        editGrid: []
    };
    const context: any = generateProcessorContext(editGridComp, data);
    filterProcessSync(context);
    expect(context.scope.filter).to.deep.equal({'editGrid': {'compModelType': 'array', 'include': true, value: []}});
});

it('Should not filter empty array value for datTable component', async () => {
    const dataTableComp = {
        type: 'datatable',
        key: 'dataTable',
        input: true,
        path: 'dataTable',
        components: [
            {
                type: 'textfield',
                key: 'textField',
                input: true,
                label: 'Text Field'
            }
        ]
    };
    const data = {
        dataTable: []
    };
    const context: any = generateProcessorContext(dataTableComp, data);
    filterProcessSync(context);
    expect(context.scope.filter).to.deep.equal({'dataTable': {'compModelType': 'array', 'include': true, value: []}});
});
