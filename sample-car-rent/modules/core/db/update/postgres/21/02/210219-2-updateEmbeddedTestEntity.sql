alter table SCR_EMBEDDED_TEST_ENTITY rename column embedded_entity_name to embedded_entity_name__u27563 ;
alter table SCR_EMBEDDED_TEST_ENTITY alter column embedded_entity_name__u27563 drop not null ;
alter table SCR_EMBEDDED_TEST_ENTITY add column OWN_ATTRIBUTE varchar(255) ;
alter table SCR_EMBEDDED_TEST_ENTITY add column EMBEDDED_NAME varchar(255) ;
