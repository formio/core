import { expect } from "chai";
const form1 = require('./fixtures/form1.json');
const data1a = require('./fixtures/data1a.json');
import { processReduce } from "../index";
describe('Process Tests', () => {
    it('Should perform a reduction on the tests to be performed with a form.', () => {
        const reduced = processReduce({
            components: form1.components,
            data: data1a.data,
            scope: {
                processes: {}
            }
        });
        console.log(reduced);
    });
});