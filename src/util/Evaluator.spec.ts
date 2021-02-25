import { Evaluator } from './Evaluator';
import { assert } from 'chai';

describe('Evaluator', () => {
    it('Should be able to interpolate a string with Evaluator', () => {
        assert.equal(Evaluator.interpolate(`<span>{{ data.firstName }}</span>`, {
            data: {
                firstName: 'Travis'
            }
        }), '<span>Travis</span>');
        assert.equal(Evaluator.interpolate(`<span>{{data.firstName }}</span>`, {
            data: {
                firstName: 'Travis'
            }
        }), '<span>Travis</span>');
        assert.equal(Evaluator.interpolate(`<span>{{data.firstName}}</span>`, {
            data: {
                firstName: 'Travis'
            }
        }), '<span>Travis</span>');
        assert.equal(Evaluator.interpolate(`<span>{{  data.firstName }}</span>`, {
            data: {
                firstName: 'Travis'
            }
        }), '<span>Travis</span>');
        assert.equal(Evaluator.interpolate(`<span>{{  data.firstName    }}</span>`, {
            data: {
                firstName: 'Travis'
            }
        }), '<span>Travis</span>');
    });
});