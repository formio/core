import { BaseComponent, Component } from 'types';

export const isParentHidden = (comp: Component) => {
  let parentComponent: BaseComponent | undefined = comp.parent;

  while (parentComponent) {
    if (parentComponent.hidden) {
      return true;
    }
    parentComponent = parentComponent.parent;
  }

  return false;
};
