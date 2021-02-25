import { assert } from 'chai';
import { Components } from '../../core';
const DataTableComponent = Components.components.datatable;

describe('DataTable', () => {
    it ('Should create a DataTable component', () => {
        const trimHtml = (html: string) => {
            return html.replace(/\n/g, "")
            .replace(/[\t ]+\</g, "<")
            .replace(/\>[\t ]+\</g, "><")
            .replace(/\>[\t ]+$/g, ">");
        }
        const dataTable = new DataTableComponent({
            type: 'datatable',
            key: 'customers',
            components: [
                {
                    type: 'datavalue',
                    key: 'firstName',
                    label: 'First Name'
                },
                {
                    type: 'datavalue',
                    key: 'lastName',
                    label: 'First Name'
                }
            ]
        }, {}, {
            customers: [
                {firstName: 'Joe', lastName: 'Smith'},
                {firstName: 'Sally', lastName: 'Thompson'},
                {firstName: 'Mary', lastName: 'Bono'}
            ]
        });
        assert.equal(trimHtml(dataTable.render()), trimHtml(`
        <table class="table table-bordered table-hover table-condensed">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>First Name</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Joe</td>
                    <td>Smith</td>
                </tr>
                <tr>
                    <td>Sally</td>
                    <td>Thompson</td>
                </tr>
                <tr>
                    <td>Mary</td>
                    <td>Bono</td>
                </tr>
            </tbody>
        </table>`));
    });
});