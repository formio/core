import { expect } from 'chai';

import { eachComponentData } from '../eachComponentData';

describe('eachComponentData', function () {
  it('Should not iterate over each component in a nested component if includeAll=false and there is an empty data', function () {
    const components = [
      {
        type: 'datagrid',
        key: 'dataGrid',
        label: 'Data Grid',
        input: true,
        components: [
          {
            key: 'textField',
            type: 'textfield',
            label: 'Text Field',
            input: true,
          },
        ],
      },
    ];

    const data = { dataGrid: [] };

    const rowResults: Map<string, any> = new Map();
    eachComponentData(
      components,
      data,
      (component, data, row, path) => {
        rowResults.set(path, component.key);
      },
      false,
    );
    expect(rowResults.size).to.equal(1);
    expect(rowResults.get('dataGrid')).to.deep.equal('dataGrid');
  });

  it('Should iterate over each component in a nested component if there is no data associated with the component', function () {
    const components = [
      {
        type: 'datagrid',
        key: 'dataGrid',
        label: 'Data Grid',
        input: true,
        components: [
          {
            key: 'textField',
            type: 'textfield',
            label: 'Text Field',
            input: true,
          },
          {
            key: 'number',
            type: 'number',
            label: 'Number',
            input: true,
          },
        ],
      },
    ];

    const data = {};

    const rowResults: Map<string, any> = new Map();
    eachComponentData(components, data, (component, data, row, path) => {
      rowResults.set(path, component.key);
    });
    expect(rowResults.size).to.equal(3);
    expect(rowResults.get('dataGrid')).to.deep.equal('dataGrid');
    expect(rowResults.get('dataGrid[0].textField')).to.deep.equal('textField');
    expect(rowResults.get('dataGrid[0].number')).to.deep.equal('number');
  });

  it('Should iterate over each component in a nested component if includeAll=true and there is no data associated with the component', function () {
    const components = [
      {
        type: 'datagrid',
        key: 'dataGrid',
        label: 'Data Grid',
        input: true,
        components: [
          {
            key: 'textField',
            type: 'textfield',
            label: 'Text Field',
            input: true,
          },
        ],
      },
    ];

    const data = {};

    const rowResults: Map<string, any> = new Map();
    eachComponentData(
      components,
      data,
      (component, data, row, path) => {
        rowResults.set(path, component.key);
      },
      true,
    );
    expect(rowResults.size).to.equal(2);
    expect(rowResults.get('dataGrid')).to.deep.equal('dataGrid');
    expect(rowResults.get('dataGrid[0].textField')).to.deep.equal('textField');
  });
});
