import { assert } from 'chai';
import { Components } from '../../core';
const HTMLComponent = Components.components.html;

describe('HTML Component', () => {
    it ('Should create an HTML Component', () => {
        const comp = new HTMLComponent({
            tag: 'span',
            className: 'testing',
            content: 'Testing',
            attrs: [
                {attr: 'one', value: 'two'},
                {attr: 'three', value: 'four'}
            ]
        });
        assert.equal(comp.render(), '<span ref="html" one="two" three="four" class="testing">Testing</span>');
    });

    it ('Should also allow for key-value pair attributes', () => {
        const comp = new HTMLComponent({
            tag: 'span',
            className: 'testing',
            content: 'Testing',
            attrs: {
                one: 'two',
                three: 'four'
            }
        });
        assert.equal(comp.render(), '<span ref="html" one="two" three="four" class="testing">Testing</span>');
    });
});