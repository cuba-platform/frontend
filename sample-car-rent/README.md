# CUBA Sample Project - Car Rent
Sample CUBA project with non trivial model, which used as base for tests in 
[@haulmont/jmix-front-generator](https://github.com/cuba-platform/frontend). 

## Data
### Users
admin/admin<br>
mechanic/1
manager/2

## Development
### Create Init Script With Data Already Added in App
* Export data from table <TABLE_NAME>
```bash
sudo -u postgres pg_dump --table=<TABLE_NAME> --data-only --column-inserts scr
```
* Paste generated script to [30.create-db.sql](modules/core/db/init/hsql/30.create-db.sql) 
* Script will be executed when database will be created next time  