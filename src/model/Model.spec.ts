import { assert } from 'chai';
import { Model } from './Model';
const BaseModel = Model()();
describe('Model', () => {
  it('new Model()', () => {
    const model = new BaseModel({
      key: 'firstName'
    }, {}, {
      firstName: 'Joe'
    });
    assert.equal(model.dataValue, 'Joe');
    model.dataValue = 'Sally';
    assert.equal(model.dataValue, 'Sally');
    assert.deepEqual(model.data, {firstName: 'Sally'});
  });
  
  it('Model.isEmpty', () => {
    const model = new BaseModel({
      key: 'firstName'
    }, {}, {
      firstName: 'Joe'
    });
    assert.equal(model.isEmpty(), false);
    model.dataValue = '';
    assert.equal(model.isEmpty(), true);
    model.dataValue = null;
    assert.equal(model.isEmpty(), true);
    model.dataValue = [];
    assert.equal(model.isEmpty(), true);
    model.dataValue = [null];
    assert.equal(model.isEmpty(), true);
    model.dataValue = [''];
    assert.equal(model.isEmpty(), false);
    model.dataValue = ['hello'];
    assert.equal(model.isEmpty(), false);
  });
});