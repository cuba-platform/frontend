-- begin SCR_CAR
create table SCR_CAR (
    ID varchar(36) not null,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    MANUFACTURER varchar(255) not null,
    MODEL varchar(255),
    REG_NUMBER varchar(5),
    PURCHASE_DATE date,
    MANUFACTURE_DATE timestamp,
    WHEEL_ON_RIGHT boolean,
    CAR_TYPE varchar(50) not null,
    ECO_RANK integer,
    GARAGE_ID varchar(36),
    MAX_PASSENGERS integer,
    PRICE decimal(19, 2),
    MILEAGE double precision,
    TECHNICAL_CERTIFICATE_ID varchar(36),
    PHOTO_ID varchar(36),
    --
    primary key (ID)
)^
-- end SCR_CAR
-- begin SCR_GARAGE
create table SCR_GARAGE (
    ID varchar(36) not null,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    NAME varchar(255) not null,
    CAPACITY integer,
    --
    primary key (ID)
)^
-- end SCR_GARAGE
-- begin SCR_FAVORITE_CAR
create table SCR_FAVORITE_CAR (
    ID varchar(36) not null,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    CAR_ID varchar(36) not null,
    USER_ID varchar(36) not null,
    NOTES varchar(255),
    --
    primary key (ID)
)^
-- end SCR_FAVORITE_CAR
-- begin SCR_CAR_RENT
create table SCR_CAR_RENT (
    ID varchar(36) not null,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    CAR_ID varchar(36) not null,
    FROM_DATE date,
    FROM_TIME time,
    FROM_DATE_TIME timestamp,
    --
    primary key (ID)
)^
-- end SCR_CAR_RENT
-- begin SCR_TECHNICAL_CERTIFICATE
create table SCR_TECHNICAL_CERTIFICATE (
    ID varchar(36) not null,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    CERT_NUMBER varchar(255),
    --
    primary key (ID)
)^
-- end SCR_TECHNICAL_CERTIFICATE
-- begin SCR_SPARE_PART
create table SCR_SPARE_PART (
    ID varchar(36) not null,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    NAME varchar(255),
    SPARE_PARTS_ID varchar(36),
    --
    primary key (ID)
)^
-- end SCR_SPARE_PART
-- begin SEC_USER
alter table SEC_USER add column PHONE varchar(255) ^
alter table SEC_USER add column DTYPE varchar(100) ^
update SEC_USER set DTYPE = 'scr$User' where DTYPE is null ^
-- end SEC_USER
