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

create table SCR_ASSOCIATION_M2M_TEST_ENTITY (
    ID uuid,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    NAME varchar(255),
    --
    primary key (ID)
)^
create table SCR_ASSOCIATION_M2O_TEST_ENTITY (
    ID uuid,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    NAME varchar(255),
    --
    primary key (ID)
)^
create table SCR_ASSOCIATION_O2M_TEST_ENTITY (
    ID uuid,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    NAME varchar(255),
    DATATYPES_TEST_ENTITY_ID uuid,
    --
    primary key (ID)
)^
create table SCR_ASSOCIATION_O2O_TEST_ENTITY (
    ID uuid,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    NAME varchar(255),
    --
    primary key (ID)
)^
create table SCR_COMPOSITION_O2M_TEST_ENTITY (
    ID uuid,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    NAME varchar(255),
    DATATYPES_TEST_ENTITY_ID uuid,
    --
    primary key (ID)
)^
create table SCR_COMPOSITION_O2O_TEST_ENTITY (
    ID uuid,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    NAME varchar(255),
    --
    primary key (ID)
)^
create table SCR_DATATYPES_TEST_ENTITY (
    ID uuid,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    NAME varchar(255),
    BIG_DECIMAL_ATTR decimal(19, 2),
    BOOLEAN_ATTR boolean,
    BYTE_ARRAY_ATTR longvarbinary,
    DATE_ATTR date,
    DATE_TIME_ATTR timestamp,
    DOUBLE_ATTR double precision,
    INTEGER_ATTR integer,
    LONG_ATTR bigint,
    STRING_ATTR varchar(255),
    TIME_ATTR time,
    UUID_ATTR varchar(36),
    LOCAL_DATE_TIME_ATTR timestamp,
    OFFSET_DATE_TIME_ATTR timestamp with time zone,
    LOCAL_DATE_ATTR date,
    LOCAL_TIME_ATTR time,
    OFFSET_TIME_ATTR time with time zone,
    ENUM_ATTR varchar(255),
    ASSOCIATION_O2_OATTR_ID uuid,
    ASSOCIATION_M2_OATTR_ID uuid,
    COMPOSITION_O2_OATTR_ID uuid,
    --
    primary key (ID)
)^
create table SCR_DATATYPES_TEST_ENTITY_ASSOCIATION_M2M_TEST_ENTITY_LINK (
    DATATYPES_TEST_ENTITY_ID uuid,
    ASSOCIATION_M2_M_TEST_ENTITY_ID uuid,
    primary key (DATATYPES_TEST_ENTITY_ID, ASSOCIATION_M2_M_TEST_ENTITY_ID)
)^

-- begin SEC_USER
alter table SEC_USER add column PHONE varchar(255) ^
alter table SEC_USER add column DTYPE varchar(100) ^
update SEC_USER set DTYPE = 'scr$User' where DTYPE is null ^
-- end SEC_USER
