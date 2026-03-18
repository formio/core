import { assert } from 'chai';
import { HTMLContainerComponent } from '../test';
import { comp1, comp2 } from './fixtures';

describe('HTMLContainerComponent', function () {
  it('Should create an HTMLContainerComponent', function () {
    const comp = new HTMLContainerComponent(comp1);
    assert.equal(
      comp.render(),
      '<div ref="htmlcontainer" one="two" three="four" class="testing">' +
        `<span ref="html" data-within="${comp.id}">Testing</span>` +
        '</div>',
    );
  });

  it('Should create nested HTML hiararchies', function () {
    const comp = new HTMLContainerComponent(comp2);
    assert.equal(
      comp.render(),
      '<div ref="htmlcontainer" one="two" three="four" class="testing">' +
        `<span ref="html" data-within="${comp.id}">Testing</span>` +
        `<div ref="htmlcontainer" data-within="${comp.id}">` +
        `<h3 ref="html" data-within="${comp.components[1].id}"><script>alert("No XSS allowed!!!!");</script>This is a title</h3>` +
        '</div>' +
        '</div>',
    );
  });

  it('Should sanitize the output to ensure XSS does not occur.', function () {
    const comp = new HTMLContainerComponent(comp2);
    const parentElement = document.createElement('div');
    const element = document.createElement('div');
    parentElement.appendChild(element);
    comp.attach(element);
    const root = parentElement.firstElementChild!;
    assert.equal(root.getAttribute('class'), 'testing');
    assert.equal(root.getAttribute('ref'), 'htmlcontainer');

    const span = root.children[0];
    assert.equal(span.tagName, 'SPAN');
    assert.equal(span.getAttribute('data-within'), comp.id);
    assert.equal(span.getAttribute('ref'), 'html');
    assert.equal(span.textContent, 'Testing');

    const innerDiv = root.children[1];
    assert.equal(innerDiv.getAttribute('data-within'), comp.id);
    assert.equal(innerDiv.getAttribute('ref'), 'htmlcontainer');

    const h3 = innerDiv.children[0];
    assert.equal(h3.tagName, 'H3');
    assert.equal(h3.getAttribute('data-within'), comp.components[1].id);
    assert.equal(h3.getAttribute('ref'), 'html');
    assert.equal(h3.textContent, 'This is a title');
  });
});
