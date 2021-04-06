import { Formio } from './Formio';
import './components/index';
/**
* Allows passing in plugins as multiple arguments or an array of plugins.
*
* Formio.plugins(plugin1, plugin2, etc);
* Formio.plugins([plugin1, plugin2, etc]);
*/
export declare function use(...plugins: any): void;
export { Formio };
