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
declare const _default: {
    components: {
        html: typeof HTMLComponent;
        htmlcontainer: typeof HTMLContainerComponent;
        datatable: typeof DataTableComponent;
        datavalue: typeof DataValueComponent;
        input: typeof InputComponent;
    };
    templates: {
        bootstrap: typeof import("./templates/bootstrap");
    };
};
export default _default;
