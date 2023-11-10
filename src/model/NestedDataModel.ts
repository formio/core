import get from 'lodash/get';
import set from 'lodash/set';
import { ModelInterface, ModelDecoratorInterface } from './Model';
import { NestedModel } from './NestedModel';
export function NestedDataModel(props: any = {}) : ModelDecoratorInterface {
    return function(BaseClass?: ModelInterface) : ModelInterface {
        return class BaseNestedDataModel extends NestedModel(props)(BaseClass) {
            get emptyValue(): any {
                return {};
            }
            get defaultValue() {
                return {};
            }

            /**
             * Get the component data.
             */
            componentData() {
                const compData: any = get(this.data, this.component.key, this.defaultValue);
                if (!Object.keys(compData).length) {
                    set(this.data, this.component.key, compData);
                }
                return compData;
            }

            public get dataValue() {
                return get(this.data, this.component.key);
            }

            public set dataValue(value: any) {
                this.eachComponentValue(value, (comp: any, val: any) => (comp.dataValue = val));
            }
        }
    };
};