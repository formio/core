import { MaxRule } from './Max';
import { Component as ComponentBase } from '@formio/base';
const Component = ComponentBase()();
import { assert } from 'chai';
describe('MaxRule', () => {
  const component = new Component({
    key: 'data'
  });
  const max = new MaxRule(component, 5);
  it ('Should validate a default component', async () => {
    assert.equal(await max.check(), true);
  });
  it ('Should pass if value is not a number.', async () => {
    component.dataValue = 'one';
    assert.equal(await max.check(), true);
  });
  it ('Should pass if value is less than the limit.', async () => {
    component.dataValue = 2;
    assert.equal(await max.check(), true);
  });
  it ('Should pass if value is equal to the limit.', async () => {
    component.dataValue = 5;
    assert.equal(await max.check(), true);
  });
  it ('Should fail if value is over the limit.', async () => {
    component.dataValue = 6;
    assert.equal(await max.check(), false);
  });
  it ('Should allow custom values.', async () => {
    component.dataValue = 6;
    assert.equal(await max.check(5), true);
  });
});