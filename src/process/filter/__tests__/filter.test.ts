import { expect } from 'chai';

import { filterProcessSync, filterPostProcess } from '../';
import { generateProcessorContext } from '../../__tests__/fixtures/util';
import { FilterScope, ProcessorContext } from 'types';

const filterProcess = async (context: ProcessorContext<FilterScope>) => {
  filterProcessSync(context);
  filterPostProcess(context);
};

describe('Filter processor', function () {
  it('Should not filter empty array value for dataGrid component', async function () {
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
          label: 'Text Field',
        },
      ],
    };
    const data = {
      dataGrid: [],
    };
    const context: any = generateProcessorContext(dataGridComp, data);
    filterProcess(context);
    expect(context.scope.filter).to.deep.equal({
      dataGrid: true,
    });
  });

  it('Should not filter empty array value for editGrid component', async function () {
    const editGridComp = {
      type: 'editgrid',
      key: 'editGrid',
      input: true,
      components: [
        {
          type: 'textfield',
          key: 'textField',
          input: true,
          label: 'Text Field',
        },
      ],
    };
    const data = {
      editGrid: [],
    };
    const context: any = generateProcessorContext(editGridComp, data);
    filterProcess(context);
    expect(context.scope.filter).to.deep.equal({
      editGrid: true,
    });
  });

  it('Should not filter empty array value for dataTable component', async function () {
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
          label: 'Text Field',
        },
      ],
    };
    const data = {
      dataTable: [],
    };
    const context: any = generateProcessorContext(dataTableComp, data);
    filterProcess(context);
    expect(context.scope.filter).to.deep.equal({
      dataTable: true,
    });
  });

  it('Should not filter coordinates for Tagpad component', async function () {
    const tagpadComp = {
      label: 'Tagpad',
      imageUrl: 'https://onetreeplanted.org/cdn/shop/articles/nature_facts_1600x.jpg?v=1705008496',
      tableView: false,
      validateWhenHidden: false,
      key: 'tagpad',
      path: 'tagpad',
      type: 'tagpad',
      input: true,
      components: [
        {
          label: 'Text Field',
          applyMaskOn: 'change',
          tableView: true,
          validateWhenHidden: false,
          key: 'textField',
          type: 'textfield',
          input: true,
        },
      ],
    };
    const data = {
      tagpad: [
        {
          coordinate: {
            x: 83,
            y: 61,
            width: 280,
            height: 133,
          },
          data: {
            textField: 'test1',
          },
        },
        {
          coordinate: {
            x: 194,
            y: 93,
            width: 280,
            height: 133,
          },
          data: {
            textField: 'test2',
          },
        },
      ],
    };
    const context: any = generateProcessorContext(tagpadComp, data);
    filterProcess(context);
    expect(context.scope.filtered).to.deep.equal({
      tagpad: [
        {
          coordinate: {
            x: 83,
            y: 61,
            width: 280,
            height: 133,
          },
          data: {},
        },
        {
          coordinate: {
            x: 194,
            y: 93,
            width: 280,
            height: 133,
          },
          data: {},
        },
      ],
    });
  });

  it('Should not filter the datamap component', async function () {
    const dataMapComp = {
      label: 'Data Map',
      tableView: false,
      validateWhenHidden: false,
      key: 'dataMap',
      type: 'datamap',
      path: 'dataMap',
      input: true,
      valueComponent: {
        type: 'textfield',
        key: 'value',
        label: 'Value',
        input: true,
        hideLabel: true,
        tableView: true,
      },
    };

    const data = {
      dataMap: {
        foo: 'bar',
        baz: 'biz',
      },
    };

    const context: ProcessorContext<FilterScope> = generateProcessorContext(dataMapComp, data);
    filterProcess(context);
    expect(context.scope.filtered).to.deep.equal({
      dataMap: {
        foo: 'bar',
        baz: 'biz',
      },
    });
  });
});
