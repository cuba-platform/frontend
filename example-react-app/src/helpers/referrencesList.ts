import React from 'react';

export interface IReferenceItem {
    entityList: {
        title: string;
        content: React.ReactNode;
    };
    entityItemEdit: {
        title: string;
        content: React.ReactNode;
    };
    entityItemNew: {
        title: string;
        content: React.ReactNode;
    };
}

export interface IReferenceList {
    [k: string]: IReferenceItem;
}

export const referencesListByEntityName: IReferenceList = {};
