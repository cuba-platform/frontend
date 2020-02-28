create table SCR_INT_ID_TEST_ENTITY (
    ID serial,
    UPDATE_TS timestamp,
    UPDATED_BY varchar(50),
    DELETE_TS timestamp,
    DELETED_BY varchar(50),
    --
    DESCRIPTION varchar(255),
    --
    primary key (ID)
);