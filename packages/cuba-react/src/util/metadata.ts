import {MetaClassInfo, MetaPropertyInfo} from "@cuba-platform/rest";

export function getPropertyInfo(metadata: MetaClassInfo[], entityName: string, propertyName: string): MetaPropertyInfo | null {
    const metaClass = metadata.find(mci => mci.entityName === entityName);
    if (metaClass == null) {
        return null;
    }
    const propInfo = metaClass.properties.find(prop => prop.name === propertyName);
    return propInfo || null
}


export type WithId = {id?: string};