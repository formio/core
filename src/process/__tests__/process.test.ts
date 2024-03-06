import { expect } from "chai";
import { processSync, ProcessTargets } from "../index";
const form1 = require('./fixtures/form1.json');
const data1a = require('./fixtures/data1a.json');
const subs = require('./fixtures/subs.json');
/*
describe('Process Tests', () => {
    it('Should perform the processes using the processReduced method.', async () => {
        const reduced: ReducerScope = process({
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
*/

describe('Process Tests', () => {
    it('Should process nested form data correctly', async () => {
        const submission = {
            data: {
                submit: true,
                child: {
                    data: {
                        input: "4",
                        output: 200,
                    },
                },
            },
            owner: "65df88d8a98df60a25008300",
            access: [
            ],
            metadata: {
                headers: {
                    "accept-language": "en-US,en",
                    "cache-control": "no-cache",
                    connection: "keep-alive",
                    origin: "http://localhost:3000",
                    pragma: "no-cache",
                    referer: "http://localhost:3000/",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "sec-gpc": "1",
                    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    accept: "application/json",
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Brave\";v=\"122\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    host: "localhost:3000",
                    "accept-encoding": "gzip, deflate, br",
                    "content-length": "172",
                },
            },
            form: "65e74c65ef4451c9ede341e3",
        };
        const form = {
            title: "Parent Form",
            name: "parentForm",
            path: "parentform",
            type: "form",
            display: "form",
            tags: [
            ],
            deleted: null,
            access: [
                {
                    type: "create_own",
                    roles: [
                    ],
                },
                {
                    type: "create_all",
                    roles: [
                    ],
                },
                {
                    type: "read_own",
                    roles: [
                    ],
                },
                {
                    type: "read_all",
                    roles: [
                        {
                        },
                        {
                        },
                        {
                        },
                    ],
                },
                {
                    type: "update_own",
                    roles: [
                    ],
                },
                {
                    type: "update_all",
                    roles: [
                    ],
                },
                {
                    type: "delete_own",
                    roles: [
                    ],
                },
                {
                    type: "delete_all",
                    roles: [
                    ],
                },
                {
                    type: "team_read",
                    roles: [
                    ],
                },
                {
                    type: "team_write",
                    roles: [
                    ],
                },
                {
                    type: "team_admin",
                    roles: [
                    ],
                },
            ],
            submissionAccess: [
                {
                    type: "create_own",
                    roles: [
                    ],
                },
                {
                    type: "create_all",
                    roles: [
                    ],
                },
                {
                    type: "read_own",
                    roles: [
                    ],
                },
                {
                    type: "read_all",
                    roles: [
                    ],
                },
                {
                    type: "update_own",
                    roles: [
                    ],
                },
                {
                    type: "update_all",
                    roles: [
                    ],
                },
                {
                    type: "delete_own",
                    roles: [
                    ],
                },
                {
                    type: "delete_all",
                    roles: [
                    ],
                },
                {
                    type: "team_read",
                    roles: [
                    ],
                },
                {
                    type: "team_write",
                    roles: [
                    ],
                },
                {
                    type: "team_admin",
                    roles: [
                    ],
                },
            ],
            owner: {
            },
            components: [
                {
                    label: "Child",
                    tableView: true,
                    form: "65e74c2aef4451c9ede34105",
                    useOriginalRevision: false,
                    reference: false,
                    key: "child",
                    type: "form",
                    input: true,
                    components: [
                        {
                            label: "Input",
                            applyMaskOn: "change",
                            tableView: true,
                            key: "input",
                            type: "textfield",
                            input: true,
                        },
                        {
                            label: "Output",
                            applyMaskOn: "change",
                            disabled: true,
                            tableView: true,
                            calculateValue: "value = parseInt(data.input) * 5;",
                            calculateServer: true,
                            key: "output",
                            type: "textfield",
                            input: true,
                        },
                        {
                            type: "button",
                            label: "Submit",
                            key: "submit",
                            disableOnInvalid: true,
                            input: true,
                            tableView: false,
                        },
                    ],
                },
                {
                    type: "button",
                    label: "Submit",
                    key: "submit",
                    disableOnInvalid: true,
                    input: true,
                    tableView: false,
                },
            ],
            settings: {
            },
            properties: {
            },
            project: {
            },
            controller: "",
            revisions: "",
            submissionRevisions: "",
            _vid: 0,
            created: "2024-03-05T16:46:29.859Z",
            modified: "2024-03-05T18:50:08.638Z",
            machineName: "tzcuqutdtlpgicr:parentForm",
            __v: 1,
            config: {
                appUrl: "http://localhost:3000/tzcuqutdtlpgicr",
            },
        };
        const context = {
            form,
            submission,
            data: submission.data,
            components: form.components,
            processors: ProcessTargets.evaluator,
            scope: {},
            config: {
                server: true
            }
        };
        processSync(context);
        expect(context.data.child.data.output).to.equal(20);
    });

    it('Should process data within a fieldset properly.', async () => {
        const submission = {
            data: {
                firstName: 'Joe',
                lastName: 'Smith'
            }
        };
        const form = {
            components: [
                {
                    type: 'fieldset',
                    key: 'name',
                    input: false,
                    components: [
                        {
                            type: 'textfield',
                            key: 'firstName',
                            input: true
                        },
                        {
                            type: 'textfield',
                            key: 'lastName',
                            input: true
                        }
                    ]
                }
            ]
        };
        const context = {
            form,
            submission,
            data: submission.data,
            components: form.components,
            processors: ProcessTargets.submission,
            scope: {},
            config: {
                server: true
            }
        };
        processSync(context);
        expect(context.data.firstName).to.equal('Joe');
        expect(context.data.lastName).to.equal('Smith');
    });
});