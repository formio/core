import { expect } from "chai";
import { processSync, ProcessTargets } from "../index";
const assert = require('assert');
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

    it('Should process nested data correctly.', async () => {
        const form = {
            _id: {
            },
            title: "parent",
            name: "parent",
            path: "parent",
            type: "form",
            display: "form",
            tags: [
            ],
            deleted: null,
            access: [
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
            ],
            submissionAccess: [
            ],
            owner: {
            },
            components: [
                {
                    type: "checkbox",
                    label: "Show A",
                    key: "showA",
                    input: true,
                },
                {
                    type: "checkbox",
                    label: "Show B",
                    key: "showB",
                    input: true,
                },
                {
                    type: "checkbox",
                    label: "Show C",
                    key: "showC",
                    input: true,
                },
                {
                    type: "form",
                    form: "65e8786fc5dacf667eef12d2",
                    label: "Child A",
                    key: "childA",
                    input: true,
                    conditional: {
                        show: true,
                        when: "showA",
                        eq: true,
                    },
                    components: [
                        {
                            type: "textfield",
                            label: "A",
                            key: "a",
                            validate: {
                                required: true,
                            },
                            input: true,
                        },
                        {
                            type: "textfield",
                            label: "B",
                            key: "b",
                            input: true,
                        },
                    ],
                },
                {
                    type: "form",
                    form: "65e8786fc5dacf667eef12e0",
                    label: "Child B",
                    key: "childB",
                    input: true,
                    conditional: {
                        show: true,
                        when: "showB",
                        eq: true,
                    },
                    components: [
                        {
                            type: "textfield",
                            label: "C",
                            key: "c",
                            input: true,
                            validate: {
                                required: true,
                            },
                        },
                        {
                            type: "textfield",
                            label: "D",
                            key: "d",
                            input: true,
                        },
                    ],
                },
                {
                    type: "form",
                    form: "65e8786fc5dacf667eef12ee",
                    label: "Child C",
                    key: "childC",
                    conditional: {
                        show: true,
                        when: "showC",
                        eq: true,
                    },
                    input: true,
                    components: [
                        {
                            type: "textfield",
                            label: "E",
                            key: "e",
                            input: true,
                            validate: {
                                required: true,
                            },
                        },
                        {
                            type: "textfield",
                            label: "F",
                            key: "f",
                            input: true,
                        },
                    ],
                },
            ],
            created: "2024-03-06T14:06:39.724Z",
            modified: "2024-03-06T14:06:39.726Z",
            machineName: "parent",
            __v: 0,
        };
        const submission = {
            data: {
                showA: true,
                showB: true,
                showC: true,
                childA: {
                    data: {
                        a: "One",
                        b: "Two",
                    },
                },
                childB: {
                    data: {
                        c: "Three",
                        d: "Four",
                    },
                },
                childC: {
                    data: {
                        e: "Five",
                        f: "Six",
                    },
                },
            },
            owner: "65e87843c5dacf667eeeecc1",
            access: [
            ],
            metadata: {
                headers: {
                    host: "127.0.0.1:64851",
                    "accept-encoding": "gzip, deflate",
                    "content-type": "application/json",
                    "content-length": "173",
                    connection: "close",
                },
            },
            form: "65e8786fc5dacf667eef12fc",
        };

        const errors: any = [];
        const context = {
            form,
            submission,
            data: submission.data,
            components: form.components,
            processors: ProcessTargets.submission,
            scope: { errors },
            config: {
                server: true
            }
        };
        processSync(context);
        submission.data = context.data;
        context.processors = ProcessTargets.evaluator;
        processSync(context);
        assert.equal(context.scope.errors.length, 0);
        assert.equal(context.data.showA, true);
        assert.equal(context.data.showB, true);
        assert.equal(context.data.showC, true);
        assert.deepEqual(context.data.childA.data, {
            a: 'One',
            b: 'Two'
        });
        assert.deepEqual(context.data.childB.data, {
            c: 'Three',
            d: 'Four'
        });
        assert.deepEqual(context.data.childC.data, {
            e: 'Five',
            f: 'Six'
        });
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

    it('Requires a conditionally visible field', async () => {
        const form = {
            components: [
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "radio",
                    "label": "Selector",
                    "key": "selector",
                    "values": [
                        {
                            "value": "one",
                            "label": "One"
                        },
                        {
                            "value": "two",
                            "label": "Two"
                        }
                    ],
                    "defaultValue": "",
                    "protected": false,
                    "persistent": true,
                    "validate": {
                        "required": false,
                        "custom": "",
                        "customPrivate": false
                    },
                    "type": "radio",
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    }
                },
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "text",
                    "inputMask": "",
                    "label": "Required Field",
                    "key": "requiredField",
                    "placeholder": "",
                    "prefix": "",
                    "suffix": "",
                    "multiple": false,
                    "defaultValue": "",
                    "protected": false,
                    "unique": false,
                    "persistent": true,
                    "validate": {
                        "required": true,
                        "minLength": "",
                        "maxLength": "",
                        "pattern": "",
                        "custom": "",
                        "customPrivate": false
                    },
                    "conditional": {
                        "show": "true",
                        "when": "selector",
                        "eq": "two"
                    },
                    "type": "textfield"
                }
            ]
        }

        const submission = { data: { selector: 'two' } }
        const errors: any = [];
        const context = {
            form,
            submission,
            data: submission.data,
            components: form.components,
            processors: ProcessTargets.evaluator,
            scope: { errors },
            config: {
                server: true
            }
        };
        processSync(context);
        assert.equal(context.scope.errors.length, 1);
        assert.equal(context.scope.errors[0].errorKeyOrMessage, 'required');
        assert.equal(context.scope.errors[0].context.path, 'requiredField');
    });

    it('Doesn\'t require a conditionally hidden field', async () => {
        const form = {
            components: [
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "radio",
                    "label": "Selector",
                    "key": "selector",
                    "values": [
                        {
                            "value": "one",
                            "label": "One"
                        },
                        {
                            "value": "two",
                            "label": "Two"
                        }
                    ],
                    "defaultValue": "",
                    "protected": false,
                    "persistent": true,
                    "validate": {
                        "required": false,
                        "custom": "",
                        "customPrivate": false
                    },
                    "type": "radio",
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    }
                },
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "text",
                    "inputMask": "",
                    "label": "Required Field",
                    "key": "requiredField",
                    "placeholder": "",
                    "prefix": "",
                    "suffix": "",
                    "multiple": false,
                    "defaultValue": "",
                    "protected": false,
                    "unique": false,
                    "persistent": true,
                    "validate": {
                        "required": true,
                        "minLength": "",
                        "maxLength": "",
                        "pattern": "",
                        "custom": "",
                        "customPrivate": false
                    },
                    "conditional": {
                        "show": "true",
                        "when": "selector",
                        "eq": "two"
                    },
                    "type": "textfield"
                }
            ]
        };

        const submission = {
            data: {
                selector: 'one'
            }
        };

        const errors: any = [];
        const context = {
            form,
            submission,
            data: submission.data,
            components: form.components,
            processors: ProcessTargets.evaluator,
            scope: { errors },
            config: {
                server: true
            }
        };
        processSync(context);
        assert.equal(context.scope.errors.length, 0);
    });

    it('Allows a conditionally required field', async () => {
        const form = {
            components: [
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "radio",
                    "label": "Selector",
                    "key": "selector",
                    "values": [
                        {
                            "value": "one",
                            "label": "One"
                        },
                        {
                            "value": "two",
                            "label": "Two"
                        }
                    ],
                    "defaultValue": "",
                    "protected": false,
                    "persistent": true,
                    "validate": {
                        "required": false,
                        "custom": "",
                        "customPrivate": false
                    },
                    "type": "radio",
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    }
                },
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "text",
                    "inputMask": "",
                    "label": "Required Field",
                    "key": "requiredField",
                    "placeholder": "",
                    "prefix": "",
                    "suffix": "",
                    "multiple": false,
                    "defaultValue": "",
                    "protected": false,
                    "unique": false,
                    "persistent": true,
                    "validate": {
                        "required": true,
                        "minLength": "",
                        "maxLength": "",
                        "pattern": "",
                        "custom": "",
                        "customPrivate": false
                    },
                    "conditional": {
                        "show": "true",
                        "when": "selector",
                        "eq": "two"
                    },
                    "type": "textfield"
                }
            ]
        };

        const submission = {
            data: {
                selector: 'two',
                requiredField: 'Has a value'
            }
        };

        const errors: any = [];
        const context = {
            form,
            submission,
            data: submission.data,
            components: form.components,
            processors: ProcessTargets.evaluator,
            scope: { errors },
            config: {
                server: true
            }
        };
        processSync(context);
        assert.equal(context.scope.errors.length, 0);
    });

    it('Ignores conditionally hidden fields', async () => {
        const form = {
            components: [
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "radio",
                    "label": "Selector",
                    "key": "selector",
                    "values": [
                        {
                            "value": "one",
                            "label": "One"
                        },
                        {
                            "value": "two",
                            "label": "Two"
                        }
                    ],
                    "defaultValue": "",
                    "protected": false,
                    "persistent": true,
                    "validate": {
                        "required": false,
                        "custom": "",
                        "customPrivate": false
                    },
                    "type": "radio",
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    }
                },
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "text",
                    "inputMask": "",
                    "label": "Required Field",
                    "key": "requiredField",
                    "placeholder": "",
                    "prefix": "",
                    "suffix": "",
                    "multiple": false,
                    "defaultValue": "",
                    "protected": false,
                    "unique": false,
                    "persistent": true,
                    "validate": {
                        "required": true,
                        "minLength": "",
                        "maxLength": "",
                        "pattern": "",
                        "custom": "",
                        "customPrivate": false
                    },
                    "conditional": {
                        "show": "true",
                        "when": "selector",
                        "eq": "two"
                    },
                    "type": "textfield"
                }
            ]
        };

        const submission = {
            data: {
                selector: 'one',
                requiredField: 'Has a value'
            }
        };

        const errors: any = [];
        const context = {
            form,
            submission,
            data: submission.data,
            components: form.components,
            processors: ProcessTargets.evaluator,
            scope: { errors },
            config: {
                server: true
            }
        };
        processSync(context);
        assert.deepEqual(context.data, { selector: 'one' });
        assert.equal(context.scope.errors.length, 0);
    });

    it('Requires a conditionally visible field in a panel', async () => {
        const form = {
            components: [
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "radio",
                    "label": "Selector",
                    "key": "selector",
                    "values": [
                        {
                            "value": "one",
                            "label": "One"
                        },
                        {
                            "value": "two",
                            "label": "Two"
                        }
                    ],
                    "defaultValue": "",
                    "protected": false,
                    "persistent": true,
                    "validate": {
                        "required": false,
                        "custom": "",
                        "customPrivate": false
                    },
                    "type": "radio",
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    }
                },
                {
                    "input": false,
                    "title": "Panel",
                    "theme": "default",
                    "components": [
                        {
                            "input": true,
                            "tableView": true,
                            "inputType": "text",
                            "inputMask": "",
                            "label": "Required Field",
                            "key": "requiredField",
                            "placeholder": "",
                            "prefix": "",
                            "suffix": "",
                            "multiple": false,
                            "defaultValue": "",
                            "protected": false,
                            "unique": false,
                            "persistent": true,
                            "validate": {
                                "required": true,
                                "minLength": "",
                                "maxLength": "",
                                "pattern": "",
                                "custom": "",
                                "customPrivate": false
                            },
                            "conditional": {
                                "show": null,
                                "when": null,
                                "eq": ""
                            },
                            "type": "textfield"
                        }
                    ],
                    "type": "panel",
                    "key": "panel",
                    "conditional": {
                        "show": "true",
                        "when": "selector",
                        "eq": "two"
                    }
                }
            ]
        };

        const submission = {
            data: {
                selector: 'two'
            }
        };

        const errors: any = [];
        const context = {
            form,
            submission,
            data: submission.data,
            components: form.components,
            processors: ProcessTargets.evaluator,
            scope: { errors },
            config: {
                server: true
            }
        };
        processSync(context);
        assert.equal(context.scope.errors.length, 1);
        assert.equal(context.scope.errors[0].errorKeyOrMessage, 'required');
        assert.equal(context.scope.errors[0].context.path, 'requiredField');
    });

    it('Doesn\'t require a conditionally hidden field in a panel', async () => {
        const form = {
            components: [
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "radio",
                    "label": "Selector",
                    "key": "selector",
                    "values": [
                        {
                            "value": "one",
                            "label": "One"
                        },
                        {
                            "value": "two",
                            "label": "Two"
                        }
                    ],
                    "defaultValue": "",
                    "protected": false,
                    "persistent": true,
                    "validate": {
                        "required": false,
                        "custom": "",
                        "customPrivate": false
                    },
                    "type": "radio",
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    }
                },
                {
                    "input": false,
                    "title": "Panel",
                    "theme": "default",
                    "components": [
                        {
                            "input": true,
                            "tableView": true,
                            "inputType": "text",
                            "inputMask": "",
                            "label": "Required Field",
                            "key": "requiredField",
                            "placeholder": "",
                            "prefix": "",
                            "suffix": "",
                            "multiple": false,
                            "defaultValue": "",
                            "protected": false,
                            "unique": false,
                            "persistent": true,
                            "validate": {
                                "required": true,
                                "minLength": "",
                                "maxLength": "",
                                "pattern": "",
                                "custom": "",
                                "customPrivate": false
                            },
                            "conditional": {
                                "show": null,
                                "when": null,
                                "eq": ""
                            },
                            "type": "textfield"
                        }
                    ],
                    "type": "panel",
                    "key": "panel",
                    "conditional": {
                        "show": "true",
                        "when": "selector",
                        "eq": "two"
                    }
                }
            ]
        };

        const submission = {
            data: {
                selector: 'one'
            }
        };

        const errors: any = [];
        const context = {
            form,
            submission,
            data: submission.data,
            components: form.components,
            processors: ProcessTargets.evaluator,
            scope: { errors },
            config: {
                server: true
            }
        };
        processSync(context);
        assert.equal(context.scope.errors.length, 0);

    });

    it('Allows a conditionally required field in a panel', async () => {
        const form = {
            components: [
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "radio",
                    "label": "Selector",
                    "key": "selector",
                    "values": [
                        {
                            "value": "one",
                            "label": "One"
                        },
                        {
                            "value": "two",
                            "label": "Two"
                        }
                    ],
                    "defaultValue": "",
                    "protected": false,
                    "persistent": true,
                    "validate": {
                        "required": false,
                        "custom": "",
                        "customPrivate": false
                    },
                    "type": "radio",
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    }
                },
                {
                    "input": false,
                    "title": "Panel",
                    "theme": "default",
                    "components": [
                        {
                            "input": true,
                            "tableView": true,
                            "inputType": "text",
                            "inputMask": "",
                            "label": "Required Field",
                            "key": "requiredField",
                            "placeholder": "",
                            "prefix": "",
                            "suffix": "",
                            "multiple": false,
                            "defaultValue": "",
                            "protected": false,
                            "unique": false,
                            "persistent": true,
                            "validate": {
                                "required": true,
                                "minLength": "",
                                "maxLength": "",
                                "pattern": "",
                                "custom": "",
                                "customPrivate": false
                            },
                            "conditional": {
                                "show": null,
                                "when": null,
                                "eq": ""
                            },
                            "type": "textfield"
                        }
                    ],
                    "type": "panel",
                    "key": "panel",
                    "conditional": {
                        "show": "true",
                        "when": "selector",
                        "eq": "two"
                    }
                }
            ]
        };

        const submission = {
            data: {
                selector: 'two',
                requiredField: 'Has a value'
            }
        };

        const errors: any = [];
        const context = {
            form,
            submission,
            data: submission.data,
            components: form.components,
            processors: ProcessTargets.evaluator,
            scope: { errors },
            config: {
                server: true
            }
        };
        processSync(context);
        assert.equal(context.scope.errors.length, 0);

    });

    it('Ignores conditionally hidden fields in a panel', async () => {
        const form = {
            components: [
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "radio",
                    "label": "Selector",
                    "key": "selector",
                    "values": [
                        {
                            "value": "one",
                            "label": "One"
                        },
                        {
                            "value": "two",
                            "label": "Two"
                        }
                    ],
                    "defaultValue": "",
                    "protected": false,
                    "persistent": true,
                    "validate": {
                        "required": false,
                        "custom": "",
                        "customPrivate": false
                    },
                    "type": "radio",
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    }
                },
                {
                    "input": false,
                    "title": "Panel",
                    "theme": "default",
                    "components": [
                        {
                            "input": true,
                            "tableView": true,
                            "inputType": "text",
                            "inputMask": "",
                            "label": "Required Field",
                            "key": "requiredField",
                            "placeholder": "",
                            "prefix": "",
                            "suffix": "",
                            "multiple": false,
                            "defaultValue": "",
                            "protected": false,
                            "unique": false,
                            "persistent": true,
                            "validate": {
                                "required": true,
                                "minLength": "",
                                "maxLength": "",
                                "pattern": "",
                                "custom": "",
                                "customPrivate": false
                            },
                            "conditional": {
                                "show": null,
                                "when": null,
                                "eq": ""
                            },
                            "type": "textfield"
                        }
                    ],
                    "type": "panel",
                    "key": "panel",
                    "conditional": {
                        "show": "true",
                        "when": "selector",
                        "eq": "two"
                    }
                }
            ]
        };

        const submission = {
            data: {
                selector: 'one',
                requiredField: 'Has a value'
            }
        };

        const errors: any = [];
        const context = {
            form,
            submission,
            data: submission.data,
            components: form.components,
            processors: ProcessTargets.evaluator,
            scope: { errors },
            config: {
                server: true
            }
        };
        processSync(context);
        assert.deepEqual(context.data, { selector: 'one' });
        assert.equal(context.scope.errors.length, 0);
    });
    /*
          it('Should not clearOnHide when set to false', async () => {
            var components = [
              {
                "input": true,
                "tableView": true,
                "inputType": "radio",
                "label": "Selector",
                "key": "selector",
                "values": [
                  {
                    "value": "one",
                    "label": "One"
                  },
                  {
                    "value": "two",
                    "label": "Two"
                  }
                ],
                "defaultValue": "",
                "protected": false,
                "persistent": true,
                "validate": {
                  "required": false,
                  "custom": "",
                  "customPrivate": false
                },
                "type": "radio",
                "conditional": {
                  "show": "",
                  "when": null,
                  "eq": ""
                }
              },
              {
                "input": false,
                "title": "Panel",
                "theme": "default",
                "components": [
                  {
                    "input": true,
                    "tableView": true,
                    "inputType": "text",
                    "inputMask": "",
                    "label": "No Clear Field",
                    "key": "noClear",
                    "placeholder": "",
                    "prefix": "",
                    "suffix": "",
                    "multiple": false,
                    "defaultValue": "",
                    "protected": false,
                    "unique": false,
                    "persistent": true,
                    "clearOnHide": false,
                    "validate": {
                      "required": false,
                      "minLength": "",
                      "maxLength": "",
                      "pattern": "",
                      "custom": "",
                      "customPrivate": false
                    },
                    "conditional": {
                      "show": null,
                      "when": null,
                      "eq": ""
                    },
                    "type": "textfield"
                  }
                ],
                "type": "panel",
                "key": "panel",
                "conditional": {
                  "show": "true",
                  "when": "selector",
                  "eq": "two"
                }
              }
            ];
    
            helper
              .form('test', components)
              .submission({
                selector: 'one',
                noClear: 'testing'
              })
              .execute(function(err) {
                if (err) {
                  return done(err);
                }
    
                var submission = helper.getLastSubmission();
                assert.deepEqual({selector: 'one', noClear: 'testing'}, submission.data);
                done();
              });
          });
    
          it('Should clearOnHide when set to true', async () => {
            var components = [
              {
                "input": true,
                "tableView": true,
                "inputType": "radio",
                "label": "Selector",
                "key": "selector",
                "values": [
                  {
                    "value": "one",
                    "label": "One"
                  },
                  {
                    "value": "two",
                    "label": "Two"
                  }
                ],
                "defaultValue": "",
                "protected": false,
                "persistent": true,
                "validate": {
                  "required": false,
                  "custom": "",
                  "customPrivate": false
                },
                "type": "radio",
                "conditional": {
                  "show": "",
                  "when": null,
                  "eq": ""
                }
              },
              {
                "input": false,
                "title": "Panel",
                "theme": "default",
                "components": [
                  {
                    "input": true,
                    "tableView": true,
                    "inputType": "text",
                    "inputMask": "",
                    "label": "Clear Me",
                    "key": "clearMe",
                    "placeholder": "",
                    "prefix": "",
                    "suffix": "",
                    "multiple": false,
                    "defaultValue": "",
                    "protected": false,
                    "unique": false,
                    "persistent": true,
                    "clearOnHide": true,
                    "validate": {
                      "required": false,
                      "minLength": "",
                      "maxLength": "",
                      "pattern": "",
                      "custom": "",
                      "customPrivate": false
                    },
                    "conditional": {
                      "show": null,
                      "when": null,
                      "eq": ""
                    },
                    "type": "textfield"
                  }
                ],
                "type": "panel",
                "key": "panel",
                "conditional": {
                  "show": "true",
                  "when": "selector",
                  "eq": "two"
                }
              }
            ];
    
            helper
              .form('test', components)
              .submission({
                selector: 'one',
                clearMe: 'Clear Me!!!!'
              })
              .execute(function(err) {
                if (err) {
                  return done(err);
                }
    
                var submission = helper.getLastSubmission();
                assert.deepEqual({selector: 'one'}, submission.data);
                done();
              });
          });
    */
});