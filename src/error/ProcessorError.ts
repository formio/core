import { ProcessorContext } from 'types';
export class ProcessorError extends Error {
  context: Omit<ProcessorContext<any>, 'scope'>;
  constructor(message: string, context: ProcessorContext<any>, processor: string = 'unknown') {
    super(message);
    this.message = `${message}\nin ${processor} at ${context.path}`;
    const { component, path, data, row } = context;
    this.context = { component, path, data, row };
  }
}
