import React, { useState } from 'react';
import { referencesListByEntityName } from './referrencesList';
import { MultiScreen } from 'components/MultiScreen';
import { getMenuItems } from "@haulmont/jmix-react-core";
import { observer } from 'mobx-react';
import { currentRootPageData } from 'globalState/currentRootPageData';
import { multiScreenState } from 'globalState/multiScreen';
import { sleep } from 'helpers/misc';

export const menuItems = getMenuItems();

export const routerData = {
    history: null as any,
    location: null as any,
    match: null as any,
}


function getRefItem(entityName: string) {
    if (!referencesListByEntityName[entityName]) {
        referencesListByEntityName[entityName] = {
            entityItemEdit: {
                title: '',
                content: null,
            },
            entityItemNew: {
                title: '',
                content: null,
            },
            entityList: {
                title: '',
                content: null,
            },
        }
    }

    return referencesListByEntityName[entityName];
}

export function registerReferenceScreenWithList(entityName: string, title: string, component: React.ReactNode) {
    const refItem = getRefItem(entityName);
    refItem.entityList.title = title;
    refItem.entityList.content = component;
}

export function registerReferenceScreenWithAddEntity(entityName: string, title: string, component: React.ReactNode) {
    const refItem = getRefItem(entityName);
    refItem.entityItemNew.title = title;
    refItem.entityItemNew.content = component;
}

export function registerReferenceScreenWithEditEntity(entityName: string, title: string, component: React.ReactNode) {
    const refItem = getRefItem(entityName);
    refItem.entityItemEdit.title = title;
    refItem.entityItemEdit.content = component;

    // Add new item component doesn't register yet
    if (refItem.entityItemNew.content === null) {
        refItem.entityItemNew.title = title;
        refItem.entityItemNew.content = component;
    }
}

export function registerRoute(routePath: string, menuPath: string, title: string, component: React.ReactChild, entityName: string) {
    const Comp = observer((props: any) => {
        currentRootPageData.title = title;
        useState(() => {
            routerData.history = props.history;
            routerData.location = props.location;
            routerData.match = props.matchl

            const entityId = props?.match?.params?.entityId;
            if (entityId) {
                (async () => {
                    await sleep();
                    const registeredReferral = referencesListByEntityName[entityName];

                    multiScreenState.pushScreen({
                        title: registeredReferral.entityItemEdit.title,
                        content: registeredReferral.entityItemEdit.content,
                        params: {
                            entityId: entityId,
                        }
                    });
                })();
            }
        });

        return <MultiScreen>{component}</MultiScreen>;
    });

    menuItems.push({
        pathPattern: routePath,
        menuLink: menuPath,
        component: Comp,
        caption: title
    });
}
