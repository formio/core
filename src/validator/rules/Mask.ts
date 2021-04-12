import { getInputMask, matchInputMask } from '@formio/utils';

import { Rule } from './Rule';
export class MaskRule extends Rule {
  defaultMessage = '{{field}} does not match the mask.';
  public async check(value: any = this.component.dataValue) {
    let inputMask;
    if (this.component.isMultipleMasksField) {
      const maskName = value ? value.maskName : undefined;
      const formioInputMask = this.component.getMaskByName(maskName);
      if (formioInputMask) {
        inputMask = getInputMask(formioInputMask);
      }
      value = value ? value.value : value;
    }
    else {
      inputMask = getInputMask(this.settings.mask);
    }
    if (value && inputMask) {
      return matchInputMask(value, inputMask);
    }
    return true;
  }
};
