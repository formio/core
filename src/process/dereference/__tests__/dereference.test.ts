import { expect } from 'chai';
import { process } from '../../process';
import { dereferenceProcessInfo } from '../index';
import { ProcessContext } from 'types';

// Mimic a BSON ObjectId in mongodb 6.x — its only own enumerable property is
// `buffer` (a Uint8Array). When such an instance round-trips through the
// IsolateVMEvaluator's structured clone, the prototype is lost and what comes
// back is a plain `{ buffer: Uint8Array }` object that BSON later serializes as
// a generic embedded doc. dereferenceProcess must emit JSON-friendly references
// so they survive that round-trip.
class FakeObjectId {
  buffer: Uint8Array;
  constructor(private hex: string) {
    this.buffer = new Uint8Array(12);
  }
  toJSON() {
    return this.hex;
  }
  toString() {
    return this.hex;
  }
}

const runProcess = async (
  components: any[],
  data: any,
  dereferenceSelectResourceValue: (component: any, value: any) => Promise<any>,
) => {
  const context: ProcessContext<any> = {
    processors: [dereferenceProcessInfo],
    components,
    data,
    scope: {},
    config: {
      database: {
        dereferenceSelectResourceValue,
      },
    },
  } as any;
  await process(context);
  return context;
};

const selectComponent = (overrides: any = {}) => ({
  type: 'select',
  key: 'fruit',
  reference: true,
  dataSrc: 'resource',
  data: { resource: '5692b920d1028f01000407e7' },
  input: true,
  ...overrides,
});

describe('Dereference processor', function () {
  it('does not leak BSON-like class instances onto submission data for single references', async function () {
    const refDoc = {
      _id: new FakeObjectId('507f1f77bcf86cd799439011'),
      form: new FakeObjectId('5692b920d1028f01000407e7'),
      data: { name: 'Apple' },
    };
    const data: any = { fruit: { _id: '507f1f77bcf86cd799439011' } };

    await runProcess([selectComponent()], data, async () => [refDoc]);

    expect(data.fruit._id, '_id should be a hex string after dereference').to.equal(
      '507f1f77bcf86cd799439011',
    );
    expect(data.fruit.form, 'form should be a hex string after dereference').to.equal(
      '5692b920d1028f01000407e7',
    );
    expect(data.fruit.data).to.deep.equal({ name: 'Apple' });
  });

  it('does not leak BSON-like class instances for multiple references', async function () {
    const refA = {
      _id: new FakeObjectId('507f1f77bcf86cd799439011'),
      form: new FakeObjectId('5692b920d1028f01000407e7'),
      data: { name: 'Apple' },
    };
    const refB = {
      _id: new FakeObjectId('aaa1f77bcf86cd799439022'),
      form: new FakeObjectId('5692b920d1028f01000407e7'),
      data: { name: 'Orange' },
    };
    const data: any = {
      fruit: [
        { _id: '507f1f77bcf86cd799439011' },
        { _id: 'aaa1f77bcf86cd799439022' },
      ],
    };

    await runProcess([selectComponent({ multiple: true })], data, async () => [refA, refB]);

    expect(data.fruit[0]._id).to.equal('507f1f77bcf86cd799439011');
    expect(data.fruit[0].form).to.equal('5692b920d1028f01000407e7');
    expect(data.fruit[1]._id).to.equal('aaa1f77bcf86cd799439022');
  });

  it('exposes only JSON-friendly references on scope.dereference', async function () {
    const refDoc = {
      _id: new FakeObjectId('507f1f77bcf86cd799439011'),
      form: new FakeObjectId('5692b920d1028f01000407e7'),
      data: { name: 'Apple' },
    };
    const data: any = { fruit: { _id: '507f1f77bcf86cd799439011' } };

    const ctx = await runProcess([selectComponent()], data, async () => [refDoc]);
    const cached = (ctx.scope as any).dereference.fruit;

    expect(cached).to.be.an('array').with.lengthOf(1);
    expect(cached[0]._id).to.equal('507f1f77bcf86cd799439011');
    expect(cached[0].form).to.equal('5692b920d1028f01000407e7');
  });
});
