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
    --
    primary key (ID)
);