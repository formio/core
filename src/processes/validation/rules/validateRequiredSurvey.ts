import _ from 'lodash';

import { FieldError, ValidatorError } from 'error';
import { SurveyComponent, RuleFn, ProcessType } from 'types';
import { getComponentErrorField } from '../util';

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
            const error = new FieldError({ component, errorKeyOrMessage: 'requiredSurvey', field: getComponentErrorField(component), context: { process: ProcessType.Validation } });        }
    }
    return null;
};
