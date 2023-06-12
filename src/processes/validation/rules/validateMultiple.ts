// import { RuleFn } from 'types/RuleFn';

// TODO: This is just a required validation?

// export const validateMultiple: RuleFn = async (component, data, config) => {
//     // Skip multiple validation if the component tells us to
//     if (!component.validateMultiple()) {
//         return true;
//     }

//     const shouldBeArray = boolValue(setting);
//     const canBeArray = Array.isArray(component.emptyValue);
//     const isArray = Array.isArray(value);
//     const isRequired = component.component.validate.required;

//     if (shouldBeArray) {
//         if (isArray) {
//             return isRequired ? !!value.length : true;
//         } else {
//             // Null/undefined is ok if this value isn't required; anything else should fail
//             return _.isNil(value) ? !isRequired : false;
//         }
//     } else {
//         return canBeArray || !isArray;
//     }
// };
