import { Components } from './core';
import { Template } from './templates/Template';
import './components/import';
export const render = Components.render;
export { Components };
export * as Util from './util';
export { Evaluator } from './util/Evaluator';

// Alias Template as Templates
export { Template as Templates };
export { Template };