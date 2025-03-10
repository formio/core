import enTranslation from './translations/en';
import { fastCloneDeep } from '../utils/fastCloneDeep';
import { isEmpty } from 'lodash';
import { Evaluator } from './Evaluator';

export const coreEnTranslation = enTranslation;

export const i18nConfig: any = {
  lng: 'en',
  nsSeparator: '::',
  keySeparator: '.|.',
  pluralSeparator: '._.',
  contextSeparator: '._.',
  resources: {
    en: {
      translation: fastCloneDeep(enTranslation),
    },
  },
};

const i18Defaults: any = {};
for (const lang in i18nConfig.resources) {
  if (i18nConfig.resources.hasOwnProperty(lang)) {
    i18Defaults[lang] = i18nConfig.resources[lang].translation;
  }
}

/**
 * This file is used to mimic the i18n library interface.
 */
export class I18n {
  static languages = i18Defaults;
  languages = fastCloneDeep(I18n.languages || {});
  defaultKeys = I18n.languages?.en || {};
  language = 'en';
  currentLanguage = i18Defaults.en;

  constructor(languages = {}) {
    this.setLanguages(languages, undefined);
    this.changeLanguage(this.language);
  }

  static setDefaultTranslations(languages: any) {
    if (isEmpty(languages)) {
      return;
    }
    for (const lang in languages) {
      if (lang !== 'language' && languages.hasOwnProperty(lang)) {
        if (!this.languages[lang]) {
          (this.languages as any)[lang] = {};
        }
        this.languages[lang] = { ...languages[lang], ...this.languages[lang] };
      }
    }
  }

  setLanguages(languages: any, noDefaultOverride: any) {
    if (languages.resources) {
      for (const lang in languages.resources) {
        if (languages.resources.hasOwnProperty(lang)) {
          languages[lang] = languages.resources[lang].translation;
        }
      }
      delete languages.resources;
    }
    if (languages.lng) {
      languages.language = languages.lng;
      delete languages.lng;
    }
    // Do not use these configurations.
    delete languages.nsSeparator;
    delete languages.keySeparator;
    delete languages.pluralSeparator;
    delete languages.contextSeparator;

    // Now establish the languages default.
    if (languages.language) {
      this.language = languages.language;
    }
    for (const lang in languages) {
      if (lang !== 'language' && languages.hasOwnProperty(lang)) {
        if (!this.languages[lang]) {
          this.languages[lang] = {};
        }
        this.languages[lang] = noDefaultOverride
          ? { ...languages[lang], ...this.languages[lang] }
          : { ...this.languages[lang], ...languages[lang] };
      }
    }
  }

  static init(languages = {}) {
    return new I18n(languages);
  }

  dir(lang = '') {
    lang = lang || this.language;
    const rtls = ['ar', 'he', 'fa', 'ps', 'ur'];
    return rtls.includes(lang) ? 'rtl' : 'ltr';
  }

  static createInstance() {
    return new I18n();
  }

  changeLanguage(language: any, ready: any = null) {
    if (!this.languages[language]) {
      language = 'en';
    }
    this.language = language;
    this.currentLanguage = this.languages[language] ? this.languages[language] : {};
    if (ready) {
      ready();
    }
  }

  addResourceBundle(language: any, type: any, strings: any) {
    this.languages[language] = strings;
  }

  t(text: any, data: any, ...args: any[]) {
    let currentTranslation = this.currentLanguage[text];
    // provide compatibility with cases where the entire phrase is used as a key
    // get the phrase that is possibly being used as a key
    const defaultKey = this.defaultKeys[text];
    if (defaultKey && this.currentLanguage[defaultKey]) {
      // get translation using the phrase as a key
      currentTranslation = this.currentLanguage[defaultKey];
    }

    if (currentTranslation) {
      const customTranslationFieldName = data?.field;
      if (customTranslationFieldName && this.currentLanguage[customTranslationFieldName]) {
        data.field = this.currentLanguage[customTranslationFieldName];
      }
      return Evaluator.interpolateString(currentTranslation, data, ...args);
    }
    return Evaluator.interpolateString(text, data, ...args);
  }
}
