import { Component as ComponentBase } from '../Component';
import { assert } from 'chai';
const Component = ComponentBase()();

describe('Component', function () {
  it('Should create a new Component component', function () {
    // Default to an empty object.
    const comp = new Component({
      type: 'textfield',
      key: 'firstName',
    });
    assert.equal(comp.options.language, 'en');
    assert.equal(comp.options.namespace, 'formio');
    assert.deepEqual(comp.component, {
      type: 'textfield',
      key: 'firstName',
      protected: false,
      persistent: true,
    });
  });

  it('init hook should be called.', function (done) {
    new Component(
      {
        type: 'textfield',
        key: 'lastName',
      },
      {
        hooks: {
          init: function () {
            // Init method must be called.
            assert(this instanceof Component, `'this' must be an instance of Component`);
            done();
          },
        },
      },
    );
  });

  it('Should render a component', function () {
    const parent = document.createElement('div');
    const element = document.createElement('div');
    parent.appendChild(element);
    const comp = new Component({
      type: 'html',
      key: 'html',
    });
    comp.attach(element);
  });

  // xit ('Should validate a component', async () => {
  //     const comp = new Component({
  //         type: 'textfield',
  //         key: 'firstName',
  //         validate: {
  //             required: true
  //         }
  //     }, {
  //         validator: Validator
  //     });
  //     assert.equal(await comp.checkValidity(), false);
  //     comp.dataValue = 'testing';
  //     assert.equal(await comp.checkValidity(), true);
  // });

  it('Should clear attachedListeners array after detach', function () {
    const element = document.createElement('div');
    const comp = new Component({
      type: 'textfield',
      key: 'firstName',
    });
    comp.attach(element);
    assert.deepEqual(comp.attachedListeners, []);
    const listenerObj = { obj: element, type: 'click', func: () => {} };
    comp.attachedListeners.push(listenerObj);
    assert.deepEqual(comp.attachedListeners, [listenerObj]);
    comp.detach();
    assert.deepEqual(comp.attachedListeners, []);
  });
});
