import { MaskRule } from './Mask';
import { Component as ComponentBase } from '@formio/base';
const Component = ComponentBase()();
import { assert } from 'chai';
describe('MaskRule', () => {
  const component = new Component({
    key: 'data'
  });
  const mask = new MaskRule(component, '(999) 999-9999');
  it ('Should validate a default component', async () => {
    assert.equal(await mask.check(), true);
  });
  it ('Should fail if value is not a number.', async () => {
    component.dataValue = 'one';
    assert.equal(await mask.check(), false);
  });
  it ('Should pass if value matches mask.', async () => {
    component.dataValue = '(123) 234-6435';
    assert.equal(await mask.check(), true);
  });
  it ('Should fail if the value does not match mask.', async () => {
    component.dataValue = '1234567890';
    assert.equal(await mask.check(), false);
  });
  it ('Should allow complex mask.', async () => {
    mask.settings = '999-aaa-****';
    component.dataValue = '123-abc-1cD4';
    assert.equal(await mask.check(), true);
  });
  it ('Should fail when complex mask is not correct.', async () => {
    component.dataValue = '123-abc-1cD&';
    assert.equal(await mask.check(), false);
  });
  it ('Should fail when not enough characters are provided.', async () => {
    component.dataValue = '123-ab-1cD&';
    assert.equal(await mask.check(), false);
  });
});