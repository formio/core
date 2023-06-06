import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { ValidatorError } from '../../error/ValidatorError';
import { SurveyComponent } from '../../types/Component';
import { RuleFn } from '../../types/RuleFn';
import { getErrorMessage } from '../util';

type SurveyDataObject = Record<string, string>;

const isValidatableSurveyDataObject = (obj: any): obj is SurveyDataObject => {
    return Object.entries(obj).every(
        ([key, value]) => typeof key === 'string' && typeof value === 'string'
    );
};

const isValidatableSurveyComponent = (component: any): component is SurveyComponent => {
    return component && component.type === 'survey' && component.validate?.required;
};

export const validateRequiredSurvey: RuleFn = async (component, data) => {
    if (!isValidatableSurveyComponent(component)) {
        return null;
    }
    const value = _.get(data, component.key);
    // if value is nullish, this should get caught by regular old required validation
    if (!value) {
        return null;
    }
    if (!isValidatableSurveyDataObject(value)) {
        throw new ValidatorError(`Cannot validate survey component because ${data} is not valid`);
    }
    for (const question of component.questions) {
        if (!value[question.value]) {
            return new FieldError(component, getErrorMessage(component, 'is required'));
        }
    }
    return null;
};
