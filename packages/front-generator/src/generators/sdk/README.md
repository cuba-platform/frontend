# TypeScript SDK

Framework-agnostic TypeScript SDK containing CUBA data model  
([entities and enums](https://doc.cuba-platform.com/manual-latest/data_model.html)), 
rest [services](https://doc.cuba-platform.com/manual-latest/rest_api_v2_services_config.html) 
and [queries](https://doc.cuba-platform.com/manual-latest/rest_api_v2_queries_config.html) 
as TypeScript classes.

It's possible to generate the following configurations of sdk depending on your needs (see [usage instruction](https://github.com/cuba-platform/front-generator/#using-via-command-line)):

- ```gen-cuba-front sdk:model``` - generates entities and enums<br>
- ```gen-cuba-front sdk:all``` - generates all toolkit - entities, enums, queries and services<br>

SDK can be used for front-end clients and Node.js-based BFF (Backend for Frontend) development.

## Entities

### Persistent entities

Consider the `Role` entity class of CUBA Framework generated in TypeScript:

`src/cuba/entities/base/sec$Role.ts`
```typescript
export class Role extends StandardEntity {
    static NAME = "sec$Role";
    name?: string | null;
    locName?: string | null;
    description?: string | null;
    type?: any | null;
    defaultRole?: boolean | null;
    permissions?: Permission[] | null;
}
```

* you can easily access entity name by static `NAME` property: `Role.NAME`,
* class contains all properties of domain model entity including from class hierarchy,
reference fields have corresponding types as well so that you can work with them in a type-safe manner:  

```typescript
function changeRole(role: Role) {
  role.defaultRole = true;   // ok
  role.defaultRole = 'foo';  // compilation fails  
}
```

### Non-persistent entities
CUBA Platform supports non-persistent entities in model.  Entity class should be annotated with ```com.haulmont.chile.core.annotations.MetaClass```, 
and extended from ```com.haulmont.cuba.core.entity.BaseUuidEntity```. Class properties 
annotated with ```com.haulmont.chile.core.annotations.MetaProperty``` will be included in generated model.

#### Source
```java
package com.company;

import com.haulmont.chile.core.annotations.MetaClass;
import com.haulmont.chile.core.annotations.MetaProperty;
import com.haulmont.cuba.core.entity.BaseUuidEntity;

@MetaClass(name = "SampleUserInfo")
public class SampleUserInfo extends BaseUuidEntity {

    @MetaProperty
    public String firstName;

    @MetaProperty
    public String lastName;
    
    }
``` 

#### Generated 
```typescript
export class SampleUserInfo {
    static NAME = "SampleUserInfo";
    firstName?: string | null;
    lastName?: string | null;
}
```

## Enums
CUBA REST API module uses enum’s constant name in client-server communication. SDK contains generated string 
enums e.g.: 
```typescript
export enum CarType {
    SEDAN = "SEDAN",
    HATCHBACK = "HATCHBACK"
}
```

In order to get enum id and localized caption, you can query full information about enums in runtime using `loadEnums` method
of cuba-rest-js: 

```typescript
import {EnumInfo, initializeApp} from "@cuba-platform/rest";

const cubaREST = initializeApp();
cubaREST.loadEnums()
    .then(((enums: EnumInfo[]) => {
        console.log('enums', enums)
    }));

```

Response example:

```json
[{
    "name": "com.company.mpg.entity.CarType",
    "values": [
      {
        "name": "SEDAN",
        "id": "SEDAN",
        "caption": "Sedan"
      },
      {
        "name": "HATCHBACK",
        "id": "HATCHBACK",
        "caption": "Hatchback"
      }
    ]
  }]
```