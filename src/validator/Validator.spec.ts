import { assert } from 'chai';
import { Validator } from './index';
import { Component as ComponentBase } from '@formio/base';
const Component = ComponentBase()();
describe('Validator', () => {
  const component = new Component({
    label: 'Test Component',
    key: 'data'
  });
  const validator = new Validator(component, {
    required: true,
    minLength: 10,
    maxLength: 20
  });
  it('Should validate required, minLength, and maxLength as false.', async () => {
    component.dataValue = 'hello';
    assert.equal(await validator.check(), false);
    assert.deepEqual(validator.errors, [
      {
        type: 'minLength',
        settings: 10,
        message: 'Test Component must have no more than 10 characters.'
      }
    ]);
  });
  it('Should validate required, minLength, and maxLength as true.', async () => {
    component.dataValue = 'hellothere';
    assert.equal(await validator.check(), true);
    assert.deepEqual(validator.errors, []);
  });
  it('Should validate maxLength', async () => {
    component.dataValue = 'hello there how are you today?';
    assert.equal(await validator.check(), false);
    assert.deepEqual(validator.errors, [
      {
        type: 'maxLength',
        settings: 20,
        message: 'Test Component must have no more than 20 characters.'
      }
    ]);
  });
  it('Should validate required message.', async () => {
    component.dataValue = '';
    assert.equal(await validator.check(), false);
    assert.deepEqual(validator.errors, [
      {
        type: 'required',
        settings: true,
        message: 'Test Component is required'
      }
    ]);
  });
  it('Should validate more than one rule', async () => {
    validator.addRule('pattern', '[0-9]+');
    component.dataValue = '0123456789';
    assert.equal(await validator.check(), true);
    assert.deepEqual(validator.errors, []);
  });
  it('Should show more than one error if more than one validation fails.', async () => {
    component.dataValue = 'test';
    assert.equal(await validator.check(), false);
    assert.deepEqual(validator.errors, [
      {
        type: 'minLength',
        settings: 10,
        message: 'Test Component must have no more than 10 characters.'
      },
      {
        type: 'pattern',
        settings: '[0-9]+',
        message: 'Test Component does not match the pattern [0-9]+'
      }
    ]);
  });
  it ('Should pass if value has been redacted', async () => {
    component.component.protected = true;
    component.dataValue = 'test';
    assert.equal(await validator.check(), true);
  });
  it ('Should pass if the value is not persistent', async () => {
    component.component.protected = false;
    component.component.persistent = false;
    component.dataValue = 'test';
    assert.equal(await validator.check(), true);
  });
  it ('Should fail if the value is persistent', async () => {
    component.component.protected = false;
    component.component.persistent = true;
    component.dataValue = 'test';
    assert.equal(await validator.check(), false);
  });
  it ('Should pass if the persistence is "client-only"', async () => {
    component.component.protected = false;
    component.component.persistent = 'client-only';
    component.dataValue = 'test';
    assert.equal(await validator.check(), true);
  });
});