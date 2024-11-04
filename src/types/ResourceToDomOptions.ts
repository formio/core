import { Formio } from 'sdk';

export type ResourceToDomOptions = {
  name: string;
  src: string | Array<string>;
  formio: typeof Formio;
  onload?: (ready: Promise<any>) => void;
  rootElement?: HTMLElement;
};
