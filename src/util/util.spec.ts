import * as _ from './util';
import { assert } from 'chai';

describe('Utilities', () => {
    it('_.get', () => {
        assert.equal(_.get({
            a: {b: {c: [null, null, {d: 'hello'}]}}
        }, 'a.b.c[2].d'), 'hello');
    });
    it('_.set', () => {
        assert.equal(_.set({}, 'a.b.c', 'hello').a.b.c, 'hello');
        assert.equal(_.set({}, 'a[2].b.c', 'hello').a[2].b.c, 'hello');
        assert.equal(_.set({}, 'a[2][1].b[3].c', 'hello').a[2][1].b[3].c, 'hello');
    });
    it('_.each(array)', () => {
        let i = 0;
        const arr = [
            {a: 'A'},
            {b: 'B'}
        ];
        _.each(arr, (obj: any, index:any) => {
            assert.strictEqual(index, i);
            assert.deepEqual(obj, arr[i]);
            i++;
        });
        assert.strictEqual(i, 2);
    });
    it('_.each(array): Break Early', () => {
        let i = 0;
        const arr = [
            {a: 'A'},
            {b: 'B'}
        ];
        _.each(arr, (obj: any, index:any) => {
            assert.strictEqual(index, i);
            assert.deepEqual(obj, arr[i]);
            i++;
            return true;
        });
        assert.strictEqual(i, 1);
    });
    it('_.each(object)', () => {
        let i = 0;
        const arr = {
            a: 'A',
            b: 'B',
            c: 'C'
        };
        const keys = Object.keys(arr);
        const values = Object.values(arr);
        _.each(arr, (obj: any, index:any) => {
            assert.strictEqual(index, keys[i]);
            assert.deepEqual(obj, values[i]);
            i++;
        });
        assert.strictEqual(i, 3);
    });
    it('_.each(object): Break Early', () => {
        let i = 0;
        const arr = {
            a: 'A',
            b: 'B',
            c: 'C'
        };
        const keys = Object.keys(arr);
        const values = Object.values(arr);
        _.each(arr, (obj: any, index:any) => {
            assert.strictEqual(index, keys[i]);
            assert.deepEqual(obj, values[i]);
            i++;
            return true;
        });
        assert.strictEqual(i, 1);
    });
});