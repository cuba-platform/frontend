# SDK

Framework agnostic sdk generates CUBA data model  
([entities and enums](https://doc.cuba-platform.com/manual-latest/data_model.html)), 
rest [services](https://doc.cuba-platform.com/manual-latest/rest_api_v2_services_config.html) 
and [queries](https://doc.cuba-platform.com/manual-latest/rest_api_v2_queries_config.html) 
as Typescript classes.

It's possible to generate the following configurations of sdk depending on your needs:

```gen-cuba-front sdk:model``` generates entities and enums<br>
```gen-cuba-front sdk:all``` generates all toolkit - entities, enums, queries and services<br>

## Entities

### Non persistent entities
CUBA Studio provides ability to add non-persistent entities in model. 
Backend entity class should be annotated with ```com.haulmont.chile.core.annotations.MetaClass```, 
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
As [mentioned here](https://www.cuba-platform.com/discuss/t/rest-v2-enums/1414) CUBA Rest module used 
enum’s constant name as parameters and in returned objects. In this case SDK enums looks like
```typescript
export enum CarType {
    SEDAN = "SEDAN",
    HATCHBACK = "HATCHBACK"
}
```
and backend enum name is used both in key and in value as string.

If you, for some reason, need enum id and localized enum caption, 
you can use CUBA rest method to load full enum info. 

Method invocation example, that returns all enums

```typescript
import {EnumInfo, initializeApp} from "@cuba-platform/rest";

const cubaREST = initializeApp();
cubaREST.loadEnums()
    .then(((enums: EnumInfo[]) => {
        console.log('enums', enums)
    }));

```

And result looks like

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