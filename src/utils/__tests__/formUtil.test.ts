import { eachComponentDataAsync } from '../formUtil';

describe('eachComponentDataAsync', () => {
    it('Properly gets the correct path', async () => {
        const form = {
        display: "form",
        components: [
            {
            label: "Edit Grid",
            tableView: false,
            rowDrafts: true,
            key: "editGrid",
            type: "editgrid",
            displayAsTable: false,
            input: true,
            components: [
                {
                label: "First Name",
                applyMaskOn: "change",
                tableView: true,
                validate: {
                    required: true,
                },
                key: "firstName",
                type: "textfield",
                input: true,
                },
                {
                label: "Last Name",
                applyMaskOn: "change",
                tableView: true,
                key: "lastName",
                type: "textfield",
                input: true,
                },
            ],
            },
            {
            label: "Submit",
            showValidations: false,
            tableView: false,
            key: "submit",
            type: "button",
            input: true,
            saveOnEnter: false,
            },
        ],
        };

        const data = {
        editGrid: [
            {
            firstName: "",
            lastName: "Bond",
            },
        ],
        submit: true,
        };

        await eachComponentDataAsync(
            form.components,
            data,
            (component: any, data: any, path: string) => {
                console.log("Component:", component);
                console.log("Data:", data);
                console.log("Path:", path);
            }
        );
    });
})
