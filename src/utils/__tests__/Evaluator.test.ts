import { Evaluator } from '../Evaluator';
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
        assert.equal(Evaluator.interpolate(`<span>{{ data.person?.firstName }}</span>`, {
            data: {
                person: {
                    firstName: 'Travis'
                }
            }
        }), '<span>Travis</span>');
        assert.equal(Evaluator.interpolate(`<span>{{ data.person?.details?.bio }}</span>`, {
            data: {
                person: {
                    firstName: 'Travis',
                    details: {
                        bio: 'Developer',
                    }
                }
            }
        }), '<span>Developer</span>');
    });

    it('Should be able to evaluate an expression.', () => {
        assert.equal(Evaluator.evaluate('value = data.a + data.b', {
            value: 0,
            data: {
                a: 5,
                b: 5
            }
        }, 'value', true), 10);
    });

    it('Should work with conditional operators within it.', () => {
        assert.equal(Evaluator.interpolate(`<span>{{  data.firstName || data.lastName    }}</span>`, {
            data: {
                firstName: '',
                lastName: 'Tidwell'
            }
        }), '<span>Tidwell</span>');
        assert.equal(Evaluator.interpolate(`<span>{{  data.firstName || data.lastName || data.middleName    }}</span>`, {
            data: {
                firstName: '',
                lastName: '',
                middleName: 'Joe'
            }
        }), '<span>Joe</span>');
        assert.equal(Evaluator.interpolate(`<span>{{  data.firstName || data.lastName || data.middleName    }}</span>`, {
            data: {
                firstName: 'Travis',
                lastName: '',
                middleName: ''
            }
        }), '<span>Travis</span>');
        assert.equal(Evaluator.interpolate(`<span>{{data.firstName||data.lastName||data.middleName}}</span>`, {
            data: {
                firstName: '',
                lastName: 'Tidwell',
                middleName: ''
            }
        }), '<span>Tidwell</span>');
    });

    it('Should work with functions', () => {
        assert.equal(Evaluator.interpolate(`<span>{{ printValue("firstName") }}</span>`, {
            printValue(name: string) {
                return this.data[name];
            },
            data: {
                firstName: 'Travis'
            }
        }), '<span>Travis</span>');
        assert.equal(Evaluator.interpolate(`<span>{{printValue("firstName")}}</span>`, {
            printValue(name: string) {
                return this.data[name];
            },
            data: {
                firstName: 'Travis'
            }
        }), '<span>Travis</span>');
        assert.equal(Evaluator.interpolate(`<span>{{ printValue( "firstName" ) }}</span>`, {
            printValue(name: string) {
                return this.data[name];
            },
            data: {
                firstName: 'Travis'
            }
        }), '<span>Travis</span>');
        assert.equal(Evaluator.interpolate(`<span>{{ printValue( "firstName"); }}</span>`, {
            printValue(name: string) {
                return this.data[name];
            },
            data: {
                firstName: 'Travis'
            }
        }), '<span>Travis</span>');
        assert.equal(Evaluator.interpolate(`<span>{{ printValue( data.prop); }}</span>`, {
            printValue(name: string) {
                return this.data[name];
            },
            data: {
                prop: 'firstName',
                firstName: 'Travis'
            }
        }), '<span>Travis</span>');
        assert.equal(Evaluator.interpolate(`<span>{{ concat( data.prop, "lastName"); }}</span>`, {
            concat(a: string, b: string) {
                return this.data[a] + ' ' + this.data[b];
            },
            data: {
                prop: 'firstName',
                firstName: 'Travis',
                lastName: 'Tidwell'
            }
        }), '<span>Travis Tidwell</span>');
        assert.equal(Evaluator.interpolate(`<span>{{funcs.concat( data.a, data.b)}}</span>`, {
            funcs: {
                concat(a: string, b: string) {
                    return this.data[a] + ' ' + this.data[b];
                }
            },
            data: {
                a: 'firstName',
                b: 'lastName',
                firstName: 'Travis',
                lastName: 'Tidwell'
            }
        }), '<span>Travis Tidwell</span>');
        assert.equal(Evaluator.interpolate(`<span>{{ getUTCDate(date) }}</span>`, {
            date: '2021-05-02T21:00Z',
            getUTCDate: (date: string) => (new Date(date)).toUTCString(),
        }), '<span>Sun, 02 May 2021 21:00:00 GMT</span>');
    });
});
