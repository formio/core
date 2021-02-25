var jsdom = require('mocha-jsdom');
import { assert } from 'chai';
import { Components } from '../../core';
import { comp1, comp2 } from './fixtures';
const HTMLContainerComponent = Components.components.htmlcontainer;

describe('HTMLContainerComponent', () => {
    jsdom({
        url: "http://localhost"
    });
    it ('Should create an HTMLContainerComponent', () => {
        const comp = new HTMLContainerComponent(comp1);
        assert.equal(comp.render(), '<div ref="html" one="two" three="four" class="testing">' +
            '<span ref="html">Testing</span>' +
        '</div>')
    });

    it ('Should create nested HTML hiararchies', () => {
        const comp = new HTMLContainerComponent(comp2);
        assert.equal(comp.render(), '<div ref="html" one="two" three="four" class="testing">' +
            '<span ref="html">Testing</span>' +
            '<div ref="html">' +
                '<h3 ref="html"><script>alert("No XSS allowed!!!!");</script>This is a title</h3>' +
            '</div>' +
        '</div>');
    });

    it ('Should sanitize the output to ensure XSS does not occur.', () => {
        const comp = new HTMLContainerComponent(comp2);
        const parentElement = document.createElement('div');
        const element = document.createElement('div');
        parentElement.appendChild(element);
        comp.attach(element);
        assert.equal(parentElement.innerHTML, '<div class="testing" ref="html">' +
            '<span ref="html">Testing</span>' +
            '<div ref="html">' +
                '<h3 ref="html">This is a title</h3>' +
            '</div>' +
        '</div>');
    });
});