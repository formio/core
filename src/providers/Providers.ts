import storage from './storage';
import { merge } from '@formio/lodash';

export default class Providers {
  static providers: any = {
    storage,
  };

  static addProvider(type: string, name: string, provider: any) {
    Providers.providers[type] = Providers.providers[type] || {};
    Providers.providers[type][name] = provider;
  }

  static addProviders(type: string, providers: any) {
    Providers.providers[type] = merge(Providers.providers[type], providers);
  }

  static getProvider(type: string, name: string) {
    if (Providers.providers[type] && Providers.providers[type][name]) {
      return Providers.providers[type][name];
    }
  }

  static getProviders(type: string) {
    if (Providers.providers[type]) {
      return Providers.providers[type];
    }
  }
}
