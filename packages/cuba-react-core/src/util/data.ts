import {getCubaREST} from '..';
import {View, ViewProperty} from '@cuba-platform/rest';

export const loadViewPropertyNames = (entityName: string, viewName: string) => {
  return getCubaREST()?.loadEntityView(entityName, viewName)
    .then((view: View) => {
      return view.properties.map((viewProperty: ViewProperty) => {
        return (typeof viewProperty === 'string') ? viewProperty : viewProperty.name;
      });
    });
};
