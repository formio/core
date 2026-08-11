import { expect } from 'chai';
import { setMergeComponentSchema } from '../logic';
import type { LogicContext } from 'types/process/logic/LogicContext';
import type { LogicActionMergeComponentSchema } from 'types/AdvancedLogic';

describe('setMergeComponentSchema', () => {
  it('HTML-escapes submission data used when merging schema so labels cannot inject HTML', () => {
    const payload = '<img src=x onerror=alert(1)>';
    const component: any = {
      key: 'checkbox',
      type: 'checkbox',
      label: 'Original',
    };
    const data: Record<string, unknown> = {
      textField: payload,
    };
    const scope = {} as LogicContext['scope'];
    const context = {
      component,
      data,
      row: data,
      path: 'checkbox',
      scope,
    } as LogicContext;

    const action: LogicActionMergeComponentSchema = {
      type: 'mergeComponentSchema',
      schemaDefinition: `schema = { label: data.textField };`,
    };

    setMergeComponentSchema(context, action);

    expect(component.label).to.not.include('<img');
    expect(String(component.label)).to.include('&lt;');
    expect(String(component.label)).to.not.equal(payload);
  });
});
