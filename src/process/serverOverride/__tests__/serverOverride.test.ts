import { expect } from 'chai';

import { ProcessorContext, ProcessorScope, TextFieldComponent } from 'types';
import { serverOverrideProcessSync } from '..';
import { generateProcessorContext } from '../../__tests__/fixtures/util';

describe('Server Override processor', function () {
  it('Should override initial component settings', async function () {
    const timeComp: TextFieldComponent = {
      label: 'Text Field',
      tableView: true,
      clearOnHide: false,
      serverOverride: {
        clearOnHide: true,
      },
      key: 'textField',
      type: 'textfield',
      input: true,
    };
    const context: ProcessorContext<ProcessorScope> = generateProcessorContext(timeComp, {});
    serverOverrideProcessSync(context);
    expect(context.component.clearOnHide).to.equal(true);
  });
});
