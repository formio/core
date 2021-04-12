import templates from './templates';
import { HTMLComponent } from './html/html';
import { HTMLContainerComponent } from './htmlcontainer/htmlcontainer';
import { DataTableComponent } from './datatable/datatable';
import { DataValueComponent } from './datavalue/datavalue';
import { InputComponent } from './input/input';
export { HTML, HTMLComponent } from './html/html';
export { HTMLContainer, HTMLContainerComponent } from './htmlcontainer/htmlcontainer';
export { DataTable, DataTableComponent } from './datatable/datatable';
export { DataValueComponent } from './datavalue/datavalue';
export { Input, InputComponent } from './input/input';
export default {
    components: {
        html: HTMLComponent,
        htmlcontainer: HTMLContainerComponent,
        datatable: DataTableComponent,
        datavalue: DataValueComponent,
        input: InputComponent
    },
    templates
};