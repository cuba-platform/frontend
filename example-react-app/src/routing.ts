import { BoringStringIdManagementTable } from "./app/boring-string-id-management-table/BoringStringIdManagementTable";
import { WeirdStringIdMgtTableManagement } from "./app/weird-string-id-management-table/WeirdStringIdMgtTableManagement";
import { WeirdStringIdMgtListManagement } from "./app/weird-string-id-management-list/WeirdStringIdMgtListManagement";
import { WeirdStringIdMgtCardsManagement } from "./app/weird-string-id-management-cards/WeirdStringIdMgtCardsManagement";
import { StringIdMgtTableManagement } from "./app/string-id-management-table/StringIdMgtTableManagement";
import { StringIdMgtListManagement } from "./app/string-id-management-list/StringIdMgtListManagement";
import { StringIdMgtCardsManagement } from "./app/string-id-management-cards/StringIdMgtCardsManagement";
import { StringIdCards } from "./app/string-id-cards/StringIdCards";
import { IntIdentityIdMgtListManagement } from "./app/int-identity-id-management-list/IntIdentityIdMgtListManagement";
import { IntIdentityIdMgtCardsManagement } from "./app/int-identity-id-management-cards/IntIdentityIdMgtCardsManagement";
import { IntIdentityIdMgtTableManagement } from "./app/int-identity-id-management-table/IntIdentityIdMgtTableManagement";
import { IntIdManagementList } from "./app/int-id-management-list/IntIdManagementList";
import { IntIdManagementCards } from "./app/int-id-management-cards/IntIdManagementCards";
import { IntIdManagementTable } from "./app/int-id-management-table/IntIdManagementTable";
import { IntIdentityIdCards } from "./app/int-id-cards/IntIdentityIdCards";
import { DatatypesCards } from "./app/datatypes-test-cards/DatatypesCards";
import { Datatypes3Management } from "./app/datatypes3/Datatypes3Management";
import { Datatypes2Management } from "./app/datatypes2/Datatypes2Management";
import { CompositionO2MManagement } from "./app/compositionO2M/CompositionO2MManagement";
import { CompositionO2OManagement } from "./app/compositionO2O/CompositionO2OManagement";
import { AssociationM2MManagement } from "./app/associationM2M/AssociationM2MManagement";
import { AssociationM2OManagement } from "./app/associationM2O/AssociationM2OManagement";
import { AssociationO2MManagement } from "./app/associationO2M/AssociationO2MManagement";
import { AssociationO2OManagement } from "./app/associationO2O/AssociationO2OManagement";
import { HooksPOCManagement } from "./app/hooks-poc/HooksPOCManagement";
import { DatatypesManagement3 } from "./app/datatypes-test3/DatatypesManagement3";
import { DatatypesManagement2 } from "./app/datatypes-test2/DatatypesManagement2";
import { DatatypesManagement1 } from "./app/datatypes-test1/DatatypesManagement1";
import { CarManagement3 } from "./app/entity-management3/CarManagement3";
import { CarManagement2 } from "./app/entity-management2/CarManagement2";
import { CarManagement } from "./app/entity-management/CarManagement";
import { FavoriteCars } from "./app/entity-cards/FavoriteCars";
import { getMenuItems } from "@haulmont/jmix-react-core";

export const menuItems = getMenuItems();

// Code below demonstrates how we can create SubMenu section
// Remove '/*' '*/' comments and restart app to get this block in menu

/*
// This is RouteItem object that we want to see in User Settings sub menu
const backToHomeRouteItem = {
  pathPattern: "/backToHome",
  menuLink: "/",
  component: null,
  caption: "home"
};
// SubMenu object
const userSettingsSubMenu = {
  caption: 'UserSettings', // add router.UserSettings key to src/i18n/en.json for valid caption
  items: [backToHomeRouteItem]};
// Add sub menu item to menu config
menuItems.push(userSettingsSubMenu);
*/

menuItems.push({
  pathPattern: "/favoriteCars",
  menuLink: "/favoriteCars",
  component: FavoriteCars,
  caption: "FavoriteCars"
});

menuItems.push({
  pathPattern: "/carManagement/:entityId?",
  menuLink: "/carManagement",
  component: CarManagement,
  caption: "CarManagement"
});

menuItems.push({
  pathPattern: "/carManagement2/:entityId?",
  menuLink: "/carManagement2",
  component: CarManagement2,
  caption: "CarManagement2"
});

menuItems.push({
  pathPattern: "/carManagement3/:entityId?",
  menuLink: "/carManagement3",
  component: CarManagement3,
  caption: "CarManagement3"
});

menuItems.push({
  pathPattern: "/datatypesManagement1/:entityId?",
  menuLink: "/datatypesManagement1",
  component: DatatypesManagement1,
  caption: "DatatypesManagement1"
});

menuItems.push({
  pathPattern: "/datatypesManagement2/:entityId?",
  menuLink: "/datatypesManagement2",
  component: DatatypesManagement2,
  caption: "DatatypesManagement2"
});

menuItems.push({
  pathPattern: "/datatypesManagement3/:entityId?",
  menuLink: "/datatypesManagement3",
  component: DatatypesManagement3,
  caption: "DatatypesManagement3"
});

menuItems.push({
  pathPattern: "/hooksPOCManagement/:entityId?",
  menuLink: "/hooksPOCManagement",
  component: HooksPOCManagement,
  caption: "HooksPOCManagement"
});

menuItems.push({
  pathPattern: "/associationO2OManagement/:entityId?",
  menuLink: "/associationO2OManagement",
  component: AssociationO2OManagement,
  caption: "AssociationO2OManagement"
});

menuItems.push({
  pathPattern: "/associationO2MManagement/:entityId?",
  menuLink: "/associationO2MManagement",
  component: AssociationO2MManagement,
  caption: "AssociationO2MManagement"
});

menuItems.push({
  pathPattern: "/associationM2OManagement/:entityId?",
  menuLink: "/associationM2OManagement",
  component: AssociationM2OManagement,
  caption: "AssociationM2OManagement"
});

menuItems.push({
  pathPattern: "/associationM2MManagement/:entityId?",
  menuLink: "/associationM2MManagement",
  component: AssociationM2MManagement,
  caption: "AssociationM2MManagement"
});

menuItems.push({
  pathPattern: "/compositionO2OManagement/:entityId?",
  menuLink: "/compositionO2OManagement",
  component: CompositionO2OManagement,
  caption: "CompositionO2OManagement"
});

menuItems.push({
  pathPattern: "/compositionO2MManagement/:entityId?",
  menuLink: "/compositionO2MManagement",
  component: CompositionO2MManagement,
  caption: "CompositionO2MManagement"
});

menuItems.push({
  pathPattern: "/datatypes2Management/:entityId?",
  menuLink: "/datatypes2Management",
  component: Datatypes2Management,
  caption: "Datatypes2Management"
});

menuItems.push({
  pathPattern: "/datatypes3Management/:entityId?",
  menuLink: "/datatypes3Management",
  component: Datatypes3Management,
  caption: "Datatypes3Management"
});

menuItems.push({
  pathPattern: "/datatypesCards",
  menuLink: "/datatypesCards",
  component: DatatypesCards,
  caption: "DatatypesCards"
});

menuItems.push({
  pathPattern: "/intIdentityIdCards",
  menuLink: "/intIdentityIdCards",
  component: IntIdentityIdCards,
  caption: "IntIdentityIdCards"
});

menuItems.push({
  pathPattern: "/intIdManagementTable/:entityId?",
  menuLink: "/intIdManagementTable",
  component: IntIdManagementTable,
  caption: "IntIdManagementTable"
});

menuItems.push({
  pathPattern: "/intIdManagementCards/:entityId?",
  menuLink: "/intIdManagementCards",
  component: IntIdManagementCards,
  caption: "IntIdManagementCards"
});

menuItems.push({
  pathPattern: "/intIdManagementList/:entityId?",
  menuLink: "/intIdManagementList",
  component: IntIdManagementList,
  caption: "IntIdManagementList"
});

menuItems.push({
  pathPattern: "/intIdentityIdMgtTableManagement/:entityId?",
  menuLink: "/intIdentityIdMgtTableManagement",
  component: IntIdentityIdMgtTableManagement,
  caption: "IntIdentityIdMgtTableManagement"
});

menuItems.push({
  pathPattern: "/intIdentityIdMgtCardsManagement/:entityId?",
  menuLink: "/intIdentityIdMgtCardsManagement",
  component: IntIdentityIdMgtCardsManagement,
  caption: "IntIdentityIdMgtCardsManagement"
});

menuItems.push({
  pathPattern: "/intIdentityIdMgtListManagement/:entityId?",
  menuLink: "/intIdentityIdMgtListManagement",
  component: IntIdentityIdMgtListManagement,
  caption: "IntIdentityIdMgtListManagement"
});

menuItems.push({
  pathPattern: "/stringIdCards",
  menuLink: "/stringIdCards",
  component: StringIdCards,
  caption: "StringIdCards"
});

menuItems.push({
  pathPattern: "/stringIdMgtCardsManagement/:entityId?",
  menuLink: "/stringIdMgtCardsManagement",
  component: StringIdMgtCardsManagement,
  caption: "StringIdMgtCardsManagement"
});

menuItems.push({
  pathPattern: "/stringIdMgtListManagement/:entityId?",
  menuLink: "/stringIdMgtListManagement",
  component: StringIdMgtListManagement,
  caption: "StringIdMgtListManagement"
});

menuItems.push({
  pathPattern: "/stringIdMgtTableManagement/:entityId?",
  menuLink: "/stringIdMgtTableManagement",
  component: StringIdMgtTableManagement,
  caption: "StringIdMgtTableManagement"
});

menuItems.push({
  pathPattern: "/weirdStringIdMgtCardsManagement/:entityId?",
  menuLink: "/weirdStringIdMgtCardsManagement",
  component: WeirdStringIdMgtCardsManagement,
  caption: "WeirdStringIdMgtCardsManagement"
});

menuItems.push({
  pathPattern: "/weirdStringIdMgtListManagement/:entityId?",
  menuLink: "/weirdStringIdMgtListManagement",
  component: WeirdStringIdMgtListManagement,
  caption: "WeirdStringIdMgtListManagement"
});

menuItems.push({
  pathPattern: "/weirdStringIdMgtTableManagement/:entityId?",
  menuLink: "/weirdStringIdMgtTableManagement",
  component: WeirdStringIdMgtTableManagement,
  caption: "WeirdStringIdMgtTableManagement"
});

menuItems.push({
  pathPattern: "/boringStringIdManagementTable/:entityId?",
  menuLink: "/boringStringIdManagementTable",
  component: BoringStringIdManagementTable,
  caption: "BoringStringIdManagementTable"
});
