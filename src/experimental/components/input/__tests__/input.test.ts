import { assert } from 'chai';
import { InputComponent, HTMLContainerComponent } from '../../test';
import { comp1, comp2 } from './fixtures';

describe('Input Component', function () {
  it('Should create a new input component', function () {
    const comp = new InputComponent(comp1);
    assert.equal(
      comp.render(),
      `<input ref="input" type="text" id="input-firstname" name="input-firstname" one="two" three="four"></input>`,
    );
  });

  it('Should create input of different types', function () {
    const comp = new InputComponent({ ...comp1, inputType: 'number' });
    assert.equal(
      comp.render(),
      `<input ref="input" type="number" id="input-firstname" name="input-firstname" one="two" three="four"></input>`,
    );
  });

  it('Should render a Form input with label and input', async function () {
    const comp = new HTMLContainerComponent(comp2);
    const parentElement = document.createElement('div');
    const element = document.createElement('div');
    parentElement.appendChild(element);
    await comp.attach(element);
    comp.setValue({
      firstName: 'Joe',
      lastName: 'Smith',
    });
    assert.equal(
      parentElement.innerHTML,
      '<span ref="htmlcontainer">' +
        `<label for="input-firstname" class="form-label" ref="html">First Name</label>` +
        `<input placeholder="Enter your first name" class="form-control" name="input-firstname" id="input-firstname" type="text" ref="input">` +
        `<label for="input-firstname" class="form-label" ref="html">Last Name</label>` +
        `<input placeholder="Enter your last name" class="form-control" name="input-lastname" id="input-lastname" type="text" ref="input">` +
        '</span>',
    );
    assert.deepEqual(comp.dataValue, {
      firstName: 'Joe',
      lastName: 'Smith',
    });

    await new Promise((resolve: any, reject: any) => {
      comp.on('change', () => {
        // Verify the data changed as well.
        try {
          assert.deepEqual(comp.dataValue, {
            firstName: 'Sally',
            lastName: 'Smith',
          });
        } catch (err) {
          return reject(err);
        }
        resolve();
      });

      // Trigger an input change.
      const firstName: any = comp.components[1].element;
      firstName.value = 'Sally';
      const evt = document.createEvent('Events');
      evt.initEvent('input', true, true);
      firstName.dispatchEvent(evt);
    });
  });
});
