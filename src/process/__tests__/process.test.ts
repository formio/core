import { expect } from "chai";
const form1 = require('./fixtures/form1.json');
const data1a = require('./fixtures/data1a.json');
const subs = require('./fixtures/subs.json');
import { processReduce, processReduced, processReduceTargets } from "../index";
import { ReducerScope } from "types";
describe('Process Tests', () => {
    it('Should perform a reduction on the tests to be performed with a form.', () => {
        const reduced: ReducerScope = processReduce({
            components: form1.components,
            data: data1a.data,
            scope: {
                processes: {}
            }
        });
        expect(reduced.processes.calculate.length).to.equal(6);
        expect(reduced.processes.fetch.length).to.equal(1);
        expect(reduced.processes.validate.length).to.equal(28);
        expect(reduced.processes.conditions.length).to.equal(1);
        expect(reduced.processes.defaultValue.length).to.equal(6);
    });

    it('Should perform the processes using the processReduced method.', async () => {
        const reduced: ReducerScope = processReduce({
            components: form1.components,
            data: data1a.data,
            scope: {
                processes: {}
            }
        });
        const targets = processReduceTargets(reduced.processes);
        expect(targets.length).to.equal(5);
        expect(targets[0].target).to.equal('server');
        expect(Object.keys(targets[0].processes).length).to.equal(1);
        expect(targets[0].processes.defaultValue.length).to.equal(6);
        expect(targets[1].target).to.equal('custom');
        expect(Object.keys(targets[1].processes).length).to.equal(1);
        expect(targets[1].processes.customDefaultValue.length).to.equal(1);
        expect(targets[2].target).to.equal('server');
        expect(Object.keys(targets[2].processes).length).to.equal(1);
        expect(targets[2].processes.fetch.length).to.equal(1);
        expect(targets[3].target).to.equal('custom');
        expect(Object.keys(targets[3].processes).length).to.equal(1);
        expect(targets[3].processes.calculate.length).to.equal(6);
        expect(targets[4].target).to.equal('server');
        expect(Object.keys(targets[4].processes).length).to.equal(2);
        expect(targets[4].processes.conditions.length).to.equal(1);
        expect(targets[4].processes.validate.length).to.equal(28);
        const scope = {errors: []};

        // Reset all values that will be calculated.
        reduced.data.subtotal = 0;
        reduced.data.taxes = 0;
        reduced.data.total = 0;
        reduced.data.cart.forEach((item: any) => {
            item.price = 0;
        });
        for (let i = 0; i < targets.length; i++) {
            await processReduced({
                components: form1.components,
                data: reduced.data,
                processes: targets[i].processes,
                fetch: (url: string, options?: RequestInit | undefined): Promise<Response> => {
                    return Promise.resolve({
                        json: () => {
                            return Promise.resolve(subs);
                        }
                    } as Response);
                },
                scope
            });
        }
        expect(reduced.data.subtotal).to.equal(100);
        expect(reduced.data.taxes).to.equal(8);
        expect(reduced.data.total).to.equal(108);
        expect(reduced.data.cart[0].price).to.equal(30);
        expect(reduced.data.cart[1].price).to.equal(20);
        expect(reduced.data.cart[2].price).to.equal(10);
    });
});