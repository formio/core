import { MinRule } from './Min';
import { Component as ComponentBase } from '@formio/base';
const Component = ComponentBase()();
import { assert } from 'chai';
describe('MinRule', () => {
  const component = new Component({
    key: 'data'
  });
  const min = new MinRule(component, 5);
  it ('Should validate a default component', async () => {
    assert.equal(await min.check(), true);
  });
  it ('Should pass if value is not a number.', async () => {
    component.dataValue = 'twentyone';
    assert.equal(await min.check(), true);
  });
  it ('Should fail if value is less than the limit.', async () => {
    component.dataValue = 2;
    assert.equal(await min.check(), false);
  });
  it ('Should pass if value is equal to the limit.', async () => {
    component.dataValue = 5;
    assert.equal(await min.check(), true);
  });
  it ('Should pass if value is over the limit.', async () => {
    component.dataValue = 6;
    assert.equal(await min.check(), true);
  });
  it ('Should allow custom values.', async () => {
    component.dataValue = 2;
    assert.equal(await min.check(5), true);
  });
});