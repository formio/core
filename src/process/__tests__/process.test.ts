import { expect } from "chai";
import form1 from './fixutures/form1.json';
import { processReduce } from "processes/process";
describe('Process Tests', () => {
    it('Should perform a reduction on the tests to be performed with a form.', () => {
        const reduced = processReduce(form1.components, {});
        console.log(reduced);
    });
});