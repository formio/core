export class Models {
    public static models: any = {};
    public static getModelType(component: any) {
        switch (component.type) {
            case 'datagrid':
            case 'editgrid':
                return 'array';
            case 'datamap':
            case 'container':
                return 'map';
            case 'form':
                return 'form';
            case 'number':
            case 'currency':
                return 'number';
            default:
                return component.hasOwnProperty('components') ? 'none' : 'value';
        }
    }

    public static create(component: any, data: any) {
        const type = Models.getModelType(component);
        if (Models.models.hasOwnProperty(type)) {
            return new Models.models[type](component, data);
        }
        else {
            return new Models.models.value(component, data);
        }
    }
}