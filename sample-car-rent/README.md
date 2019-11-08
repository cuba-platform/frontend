# CUBA Sample Project - Car Rent
Sample CUBA project with non trivial model, which used as base for tests in 
[cuba-platform/front-generator](https://github.com/cuba-platform/front-generator). 

## Data
### Users
admin/admin<br>
mechanic/1

## Development
### Create Init Script With Data Already Added in App
* Setup and run Squirrel sql as described [here](https://doc.cuba-platform.com/manual-6.10/db_hsql_connect.html)
* Run sample-car-rent app
* Connect to hsql via squirrel used db settings from [context.xml](modules/core/web/META-INF/context.xml)
* In Squirrel 'Objects' tab find table that should be exported. Click right mouse button on table and run 
'Scripts' -> 'Create Data Script'
* Paste generated script to [30.create-db.sql](modules/core/db/init/hsql/30.create-db.sql) 
* Script will be executed when database will be created next time  