import {Entity} from '../../../../common/model/cuba-model';

export interface BaseEntityScreenAnswers {
  entity: Entity;
  listShowIdAttr?: boolean;
  listIdAttrPos?: number;
  editIdAttrPos?: number;
  idAttrName?: string; // Will be asked for if not found in project model
}
