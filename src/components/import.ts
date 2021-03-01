import { Components } from '../core';
import * as comps from './index';
for (let i in comps) {
    if (comps.hasOwnProperty(i)) {
        Components.importComponent((comps as any)[i]);
    }
}