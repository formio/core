import type { BaseComponent, Component } from 'types';

export const isParentHidden = (comp: Component) => {
  let parentComponent: BaseComponent | undefined = comp.parent;

  while (parentComponent) {
    if (parentComponent.hidden) {
      return true;
    }
    // Exit if there's a circular reference in 'parent' prop
    parentComponent = parentComponent === parentComponent.parent ? undefined : parentComponent.parent;
  }

  return false;
};
