import templates from './templates';
import { HTMLComponent } from './html';
import { HTMLContainerComponent } from './htmlcontainer';
import { DataTableComponent } from './datatable';
import { DataValueComponent } from './datavalue';
import { InputComponent } from './input/input';
export { HTML, HTMLComponent } from './html';
export { HTMLContainer, HTMLContainerComponent } from './htmlcontainer';
export { DataTable, DataTableComponent } from './datatable';
export { DataValueComponent } from './datavalue';
export { Input, InputComponent } from './input/input';
export default {
  components: {
    html: HTMLComponent,
    htmlcontainer: HTMLContainerComponent,
    datatable: DataTableComponent,
    datavalue: DataValueComponent,
    input: InputComponent,
  },
  templates,
};
