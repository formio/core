import { assert } from 'chai';
import sinon from 'sinon';
import { getComponentLocalData, guid } from '../index';
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

  describe('guid', function () {
    const v4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    afterEach(function () {
      sinon.restore();
    });

    it('returns a valid v4 UUID', function () {
      assert.match(guid(), v4);
    });

    it('uses the native crypto.randomUUID when available', function () {
      const stub = sinon
        .stub(globalThis.crypto, 'randomUUID')
        .returns('11111111-1111-4111-8111-111111111111');
      const result = guid();
      assert.isTrue(stub.calledOnce);
      assert.equal(result, '11111111-1111-4111-8111-111111111111');
    });

    it('falls back to getRandomValues when randomUUID is unavailable', function () {
      const real = globalThis.crypto;
      sinon.stub(globalThis, 'crypto').value({ getRandomValues: real.getRandomValues.bind(real) });
      assert.match(guid(), v4);
    });
  });
});
