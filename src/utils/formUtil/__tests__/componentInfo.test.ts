import { expect } from 'chai';
import { componentInfo } from '..';

describe('componentInfo', function () {
  it('should not think table component instance has rows', function () {
    const info = componentInfo({
      component: {
        label: 'Component',
        cellAlignment: 'left',
        key: 'table',
        type: 'components',
        component: {
          type: 'table',
          rows: [
            [
              {
                components: [
                  {
                    label: 'Url',
                    tableView: true,
                    key: 'url1',
                    type: 'url',
                    input: true,
                  },
                ],
              },
            ],
          ],
        },
      },
    });

    expect(info.hasRows).to.be.undefined; // eslint-disable-line
  });
});
