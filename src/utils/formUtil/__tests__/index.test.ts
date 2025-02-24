import { assert } from 'chai';
import { getComponentLocalData } from '../index';
describe('Form Utils', function () {
  it('getComponentLocalData', function () {
    assert.deepEqual(
      getComponentLocalData(
        {
          dataPath: 'firstName',
          localDataPath: 'firstName',
        },
        {
          firstName: 'Joe',
        },
      ),
      {
        firstName: 'Joe',
      } as any,
    );
  });
});
