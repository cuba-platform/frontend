-- begin SCR_TECHNICAL_CERTIFICATE
create table SCR_TECHNICAL_CERTIFICATE (
    ID uuid,
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
-- begin SCR_FAVORITE_CAR
create table SCR_FAVORITE_CAR (
    ID uuid,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    CAR_ID uuid not null,
    USER_ID uuid not null,
    NOTES varchar(255),
    --
    primary key (ID)
)^
-- end SCR_FAVORITE_CAR
-- begin SCR_CAR
create table SCR_CAR (
    ID uuid,
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
    GARAGE_ID uuid,
    MAX_PASSENGERS integer,
    PRICE decimal(19, 2),
    MILEAGE double precision,
    TECHNICAL_CERTIFICATE_ID uuid,
    PHOTO_ID uuid,
    --
    primary key (ID)
)^
-- end SCR_CAR
-- begin SCR_GARAGE
create table SCR_GARAGE (
    ID uuid,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    NAME varchar(255) not null,
    ADDRESS varchar(255),
    CAPACITY integer,
    VAN_ENTRY boolean,
    WORKING_HOURS_FROM time,
    WORKING_HOURS_TO time,
    --
    primary key (ID)
)^
-- end SCR_GARAGE
-- begin SCR_CAR_RENT
create table SCR_CAR_RENT (
    ID uuid,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    CAR_ID uuid not null,
    FROM_DATE date,
    FROM_TIME time,
    FROM_DATE_TIME timestamp,
    --
    primary key (ID)
)^
-- end SCR_CAR_RENT
-- begin SCR_SPARE_PART
create table SCR_SPARE_PART (
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
    SPARE_PARTS_ID uuid,
    --
    primary key (ID)
)^
-- end SCR_SPARE_PART
-- begin SCR_GARAGE_USER_LINK
create table SCR_GARAGE_USER_LINK (
    GARAGE_ID uuid,
    USER_ID uuid,
    primary key (GARAGE_ID, USER_ID)
)^
-- end SCR_GARAGE_USER_LINK
-- begin SEC_USER
alter table SEC_USER add column PHONE varchar(255) ^
alter table SEC_USER add column DTYPE varchar(100) ^
update SEC_USER set DTYPE = 'scr$User' where DTYPE is null ^
-- end SEC_USER
-- begin SCR_ASSOCIATION_M2M_TEST_ENTITY
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
-- end SCR_ASSOCIATION_M2M_TEST_ENTITY
-- begin SCR_ASSOCIATION_M2O_TEST_ENTITY
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
-- end SCR_ASSOCIATION_M2O_TEST_ENTITY
-- begin SCR_ASSOCIATION_O2M_TEST_ENTITY
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
-- end SCR_ASSOCIATION_O2M_TEST_ENTITY
-- begin SCR_ASSOCIATION_O2O_TEST_ENTITY
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
-- end SCR_ASSOCIATION_O2O_TEST_ENTITY
-- begin SCR_COMPOSITION_O2M_TEST_ENTITY
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
    DATATYPES_TEST_ENTITY_ID uuid,
    QUANTITY integer,
    NAME varchar(255),
    --
    primary key (ID)
)^
-- end SCR_COMPOSITION_O2M_TEST_ENTITY
-- begin SCR_COMPOSITION_O2O_TEST_ENTITY
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
    QUANTITY integer,
    NESTED_COMPOSITION_ID uuid,
    --
    primary key (ID)
)^
-- end SCR_COMPOSITION_O2O_TEST_ENTITY
-- begin SCR_DATATYPES_TEST_ENTITY
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
    BIG_DECIMAL_ATTR decimal(19, 2),
    BOOLEAN_ATTR boolean,
    BYTE_ARRAY_ATTR bytea,
    DATE_ATTR date,
    DATE_TIME_ATTR timestamp,
    DOUBLE_ATTR double precision,
    INTEGER_ATTR integer,
    LONG_ATTR bigint,
    STRING_ATTR varchar(255),
    READ_ONLY_STRING_ATTR varchar(255),
    TIME_ATTR time,
    UUID_ATTR uuid,
    LOCAL_DATE_TIME_ATTR timestamp,
    OFFSET_DATE_TIME_ATTR timestamp with time zone,
    LOCAL_DATE_ATTR date,
    LOCAL_TIME_ATTR time,
    OFFSET_TIME_ATTR time with time zone,
    ENUM_ATTR varchar(50),
    ASSOCIATION_O2_OATTR_ID uuid,
    ASSOCIATION_M2_OATTR_ID uuid,
    COMPOSITION_O2_OATTR_ID uuid,
    NAME varchar(255),
    INT_IDENTITY_ID_TEST_ENTITY_ASSOCIATION_O2O_ATTR_ID integer,
    DATATYPES_TEST_ENTITY3_ID uuid,
    STRING_ID_TEST_ENTITY_ASSOCIATION_O2O_IDENTIFIER varchar(10),
    STRING_ID_TEST_ENTITY_ASSOCIATION_M2O_ID varchar(10),
    --
    primary key (ID)
)^
-- end SCR_DATATYPES_TEST_ENTITY
-- begin SCR_DATATYPES_TEST_ENTITY_ASSOCIATION_M2M_TEST_ENTITY_LINK
create table SCR_DATATYPES_TEST_ENTITY_ASSOCIATION_M2M_TEST_ENTITY_LINK (
    DATATYPES_TEST_ENTITY_ID uuid,
    ASSOCIATION_M2_M_TEST_ENTITY_ID uuid,
    primary key (DATATYPES_TEST_ENTITY_ID, ASSOCIATION_M2_M_TEST_ENTITY_ID)
)^
-- end SCR_DATATYPES_TEST_ENTITY_ASSOCIATION_M2M_TEST_ENTITY_LINK
-- begin SCR_STRING_ID_TEST_ENTITY
create table SCR_STRING_ID_TEST_ENTITY (
    IDENTIFIER varchar(10),
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    VERSION integer not null,
    --
    DESCRIPTION varchar(255),
    PRODUCT_CODE varchar(10),
    DATATYPES_TEST_ENTITY3_ID uuid,
    --
    primary key (IDENTIFIER)
)^
-- end SCR_STRING_ID_TEST_ENTITY

-- begin SCR_DEEPLY_NESTED_TEST_ENTITY
create table SCR_DEEPLY_NESTED_TEST_ENTITY (
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
    ASSOCIATION_O2_OATTR_ID uuid,
    --
    primary key (ID)
)^
-- end SCR_DEEPLY_NESTED_TEST_ENTITY
-- begin SCR_DATATYPES_TEST_ENTITY2
create table SCR_DATATYPES_TEST_ENTITY2 (
    ID uuid,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    DATATYPES_TEST_ENTITY_ATTR_ID uuid,
    INT_IDENTITY_ID_TEST_ENTITY_ATTR_ID integer,
    INTEGER_ID_TEST_ENTITY_ATTR_ID integer,
    STRING_ID_TEST_ENTITY_ATTR_IDENTIFIER varchar(10),
    WEIRD_STRING_ID_TEST_ENTITY_ATTR_IDENTIFIER varchar(10),
    --
    primary key (ID)
)^
-- end SCR_DATATYPES_TEST_ENTITY2
-- begin SCR_DATATYPES_TEST_ENTITY3
create table SCR_DATATYPES_TEST_ENTITY3 (
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
-- end SCR_DATATYPES_TEST_ENTITY3
-- begin SCR_INTEGER_ID_TEST_ENTITY
create table SCR_INTEGER_ID_TEST_ENTITY (
    ID integer,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    VERSION integer not null,
    --
    DESCRIPTION varchar(255),
    DATATYPES_TEST_ENTITY3_ID uuid,
    --
    primary key (ID)
)^
-- end SCR_INTEGER_ID_TEST_ENTITY
-- begin SCR_INT_IDENTITY_ID_TEST_ENTITY
create table SCR_INT_IDENTITY_ID_TEST_ENTITY (
    ID serial,
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    VERSION integer not null,
    --
    DESCRIPTION varchar(255),
    DATATYPES_TEST_ENTITY3_ID uuid,
    --
    primary key (ID)
)^
-- end SCR_INT_IDENTITY_ID_TEST_ENTITY
-- begin SCR_DATATYPES_TEST_ENTITY_INTEGER_ID_TEST_ENTITY_LINK
create table SCR_DATATYPES_TEST_ENTITY_INTEGER_ID_TEST_ENTITY_LINK (
    DATATYPES_TEST_ENTITY_ID uuid,
    INTEGER_ID_TEST_ENTITY_ID integer,
    primary key (DATATYPES_TEST_ENTITY_ID, INTEGER_ID_TEST_ENTITY_ID)
)^
-- end SCR_DATATYPES_TEST_ENTITY_INTEGER_ID_TEST_ENTITY_LINK
-- begin SCR_WEIRD_STRING_ID_TEST_ENTITY
create table SCR_WEIRD_STRING_ID_TEST_ENTITY (
    IDENTIFIER varchar(10),
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    VERSION integer not null,
    --
    DESCRIPTION varchar(255),
    ID varchar(255),
    DATATYPES_TEST_ENTITY3_ID uuid,
    --
    primary key (IDENTIFIER)
)^
-- end SCR_WEIRD_STRING_ID_TEST_ENTITY

-- begin SCR_BORING_STRING_ID_TEST_ENTITY
create table SCR_BORING_STRING_ID_TEST_ENTITY (
    ID varchar(10),
    UUID uuid,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    VERSION integer not null,
    --
    DESCRIPTION varchar(255),
    --
    primary key (ID)
)^
-- end SCR_BORING_STRING_ID_TEST_ENTITY
-- begin SCR_COMPOSITE_KEY_ENTITY
create table SCR_COMPOSITE_KEY_ENTITY (
    UUID uuid,
    --
    FIRST_FIELD varchar(255),
    SECOND_FIELD varchar(255),
    THIRD_FIELD varchar(255),
    --
    TESTFLD varchar(255),
    --
    primary key (FIRST_FIELD, SECOND_FIELD, THIRD_FIELD)
)^
-- end SCR_COMPOSITE_KEY_ENTITY
-- begin SCR_EMBEDDED_TEST_ENTITY
create table SCR_EMBEDDED_TEST_ENTITY (
    ID uuid,
    VERSION integer not null,
    CREATE_TS timestamp,
    CREATED_BY varchar(50),
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    EMBEDDED_NAME varchar(255),
    --
    OWN_ATTRIBUTE varchar(255),
    --
    primary key (ID)
)^
-- end SCR_EMBEDDED_TEST_ENTITY
