import { Component as ComponentBase } from './Component';
var jsdom = require('mocha-jsdom');
import { assert } from 'chai';
const Component = ComponentBase()();

describe('Component', () => {
    jsdom({
        url: "http://localhost"
    });
    it('Should create a new Component component', () => {
        // Default to an empty object.
        const comp = new Component({
            type: 'textfield',
            key: 'firstName'
        });
        assert.equal(comp.options.language, 'en');
        assert.equal(comp.options.namespace, 'formio');
        assert.deepEqual(comp.component, {
            type: 'textfield',
            key: 'firstName',
            protected: false,
            persistent: true
        });
    });

    it('init hook should be called.', (done) => {
        new Component({
            type: 'textfield',
            key: 'lastName'
        }, {
            hooks: {
                init: function() {
                    // Init method must be called.
                    assert(this instanceof Component, `'this' must be an instance of Component`);
                    done();
                }
            }
        })
    });

    it('Should render a component', () => {
        const parent = document.createElement('div');
        const element = document.createElement('div');
        parent.appendChild(element);
        const comp = new Component({
            type: 'html',
            key: 'html'
        });
        comp.attach(element);
    });

    it ('Should validate a component', async () => {
        const comp = new Component({
            type: 'textfield',
            key: 'firstName',
            validate: {
                required: true
            }
        });
        assert.equal(await comp.checkValidity(), false);
        comp.dataValue = 'testing';
        assert.equal(await comp.checkValidity(), true);
    });
});