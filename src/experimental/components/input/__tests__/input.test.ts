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

    const root = parentElement.firstElementChild!;
    assert.equal(root.tagName, 'SPAN');
    assert.equal(root.getAttribute('ref'), 'htmlcontainer');

    const [label1, input1, label2, input2] = Array.from(root.children);

    assert.equal(label1.tagName, 'LABEL');
    assert.equal(label1.getAttribute('for'), 'input-firstname');
    assert.equal(label1.getAttribute('class'), 'form-label');
    assert.equal(label1.getAttribute('ref'), 'html');

    assert.equal(input1.tagName, 'INPUT');
    assert.equal(input1.getAttribute('placeholder'), 'Enter your first name');
    assert.equal(input1.getAttribute('class'), 'form-control');
    assert.equal(input1.getAttribute('name'), 'input-firstname');
    assert.equal(input1.getAttribute('id'), 'input-firstname');
    assert.equal(input1.getAttribute('type'), 'text');
    assert.equal(input1.getAttribute('ref'), 'input');

    assert.equal(label2.tagName, 'LABEL');
    assert.equal(label2.getAttribute('for'), 'input-firstname');
    assert.equal(label2.getAttribute('class'), 'form-label');
    assert.equal(label2.getAttribute('ref'), 'html');

    assert.equal(input2.tagName, 'INPUT');
    assert.equal(input2.getAttribute('placeholder'), 'Enter your last name');
    assert.equal(input2.getAttribute('class'), 'form-control');
    assert.equal(input2.getAttribute('name'), 'input-lastname');
    assert.equal(input2.getAttribute('id'), 'input-lastname');
    assert.equal(input2.getAttribute('type'), 'text');
    assert.equal(input2.getAttribute('ref'), 'input');

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
