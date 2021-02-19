import * as React from "react";
import AssociationM2MEdit from "./AssociationM2MEdit";
import AssociationM2MBrowse from "./AssociationM2MBrowse";

import {
  registerReferenceScreenWithEditEntity,
  registerReferenceScreenWithList,
  registerRoute,
} from 'helpers/componentsRegistration';

const ENTITY_NAME = 'associationM2M';
const ROUTING_PATH = '/associationM2MManagement';

registerRoute(`${ROUTING_PATH}/:entityId?`, ROUTING_PATH, 'associationM2MManagement list', <AssociationM2MBrowse />, ENTITY_NAME);
registerReferenceScreenWithEditEntity(ENTITY_NAME, 'associationM2MManagement', <AssociationM2MEdit />);
registerReferenceScreenWithList(ENTITY_NAME, 'associationM2MManagement', <AssociationM2MBrowse />);
