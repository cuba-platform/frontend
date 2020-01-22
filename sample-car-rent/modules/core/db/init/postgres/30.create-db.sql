-- SECURITY

-- ROLES
insert into SEC_ROLE (ID, CREATE_TS, VERSION, NAME, ROLE_TYPE) values ('0c018061-b26f-4de2-a5be-dff348347f93', now(), 0, 'Administrators', 10);
INSERT INTO SEC_ROLE (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,NAME,LOC_NAME,DESCRIPTION,IS_DEFAULT_ROLE,ROLE_TYPE) VALUES ('23548523-3f0f-f96a-07ff-0d60b9cb5c1b',now(),'admin',1,now(),null,null,null,'Mechanics',null,null,null,30);
INSERT INTO SEC_ROLE (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,NAME,LOC_NAME,DESCRIPTION,IS_DEFAULT_ROLE,ROLE_TYPE) VALUES ('91099ca3-194e-6ba5-7aa6-15b03bcef05a',now(),'admin',2,now(),'admin',null,null,'Managers',null,null,null,40);

-- USERS
INSERT INTO SEC_USER (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,LOGIN,LOGIN_LC,PASSWORD,PASSWORD_ENCRYPTION,NAME,FIRST_NAME,LAST_NAME,MIDDLE_NAME,POSITION_,EMAIL,LANGUAGE_,TIME_ZONE,TIME_ZONE_AUTO,ACTIVE,GROUP_ID,IP_MASK,CHANGE_PASSWORD_AT_LOGON,PHONE,DTYPE) VALUES ('af89f9b9-5e64-bdf9-2466-5da9c91cf3d4',now(),'admin',1,now(),null,null,null,'mechanic','mechanic','$2a$10$3kFINu4A.tD.RCfQE69lE.66VWFVlyVXBKq0SdNB5nEamQWX07Tti','bcrypt','John Doe','John','Doe',null,null,'jd@example.com','en',null,null,true,'0fa2b1a5-1d68-4d69-9fbd-dff348347f93',null,true,null,'scr$User');
INSERT INTO SEC_USER_ROLE (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,USER_ID,ROLE_ID) VALUES ('7c2d9b0b-0d11-ade7-5005-39748c488373',now(),'admin',1,now(),null,null,null,'af89f9b9-5e64-bdf9-2466-5da9c91cf3d4','23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_USER (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,LOGIN,LOGIN_LC,PASSWORD,PASSWORD_ENCRYPTION,NAME,FIRST_NAME,LAST_NAME,MIDDLE_NAME,POSITION_,EMAIL,LANGUAGE_,TIME_ZONE,TIME_ZONE_AUTO,ACTIVE,GROUP_ID,IP_MASK,CHANGE_PASSWORD_AT_LOGON,PHONE,DTYPE) VALUES ('62864fc8-0273-7c57-890d-314c1fd2fde3',now(),'admin',1,now(),null,null,null,'manager','manager','$2a$10$HvoOHL3rmT6t6RSp6MF7wehKY2MAh6ssQVG6Q31k9x.RavgeKsnXu','bcrypt','Ivan Petrov','Ivan','Petrov',null,null,'ivanp@example.com','en',null,null,true,'0fa2b1a5-1d68-4d69-9fbd-dff348347f93',null,true,null,'scr$User');
INSERT INTO SEC_USER_ROLE (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,USER_ID,ROLE_ID,ROLE_NAME) VALUES ('51e0b9a4-0437-ad73-eefe-b34438b27389',now(),'admin',1,now(),null,null,null,'62864fc8-0273-7c57-890d-314c1fd2fde3','91099ca3-194e-6ba5-7aa6-15b03bcef05a',null);

-- PERMISSIONS - MECHANICS
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('4224a29f-20fe-1ba6-bac2-5704afc62a4f',now(),'admin',1,now(),null,null,null,10,'scr$Car.edit',1,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('09023a03-3eaa-63e2-5439-81e715815b46',now(),'admin',1,now(),null,null,null,10,'scr$Car.browse',1,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('11919891-c126-3c3e-ae41-28016d374a2a',now(),'admin',1,now(),null,null,null,10,'application',1,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');

INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('4a34b7db-381d-b55d-126b-9bac1c644d1e',now(),'admin',1,now(),null,null,null,20,'scr$Car:read',1,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('868403ca-5475-7e3e-a5a7-1e700d25824b',now(),'admin',1,now(),null,null,null,20,'scr$Car:delete',1,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('b12f7355-3358-02ac-f54d-e9b27291c2b2',now(),'admin',1,now(),null,null,null,20,'scr$Car:create',1,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('2866648a-e6f5-42e4-bf0d-1cb565b27971',now(),'admin',1,now(),null,null,null,20,'scr$Car:update',1,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');

INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('18800190-ba22-8ed1-61ad-7c2f49e2db11',now(),'admin',1,now(),null,null,null,30,'scr$Car:deletedBy',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('2312a5ef-b74e-f7c5-55b7-1ee30eceff03',now(),'admin',1,now(),null,null,null,30,'scr$Car:photo',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('3444b937-5069-52b2-9396-fcbedfe047d6',now(),'admin',1,now(),null,null,null,30,'scr$Car:ecoRank',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('44c2e708-64d8-0045-6f5b-e33d6140f287',now(),'admin',1,now(),null,null,null,30,'scr$Car:mileage',1,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('4bcef35b-326c-0dac-ca32-d789033106f0',now(),'admin',1,now(),null,null,null,30,'scr$Car:updatedBy',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('68bc5c71-e5a9-25e5-aba0-5674d6c23d77',now(),'admin',1,now(),null,null,null,30,'scr$Car:garage',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('7801cafe-f96c-83ef-5e49-189517d6bdcf',now(),'admin',1,now(),null,null,null,30,'scr$Car:maxPassengers',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('7a744222-6518-b1ae-e123-4a1d151dcc1f',now(),'admin',1,now(),null,null,null,30,'scr$Car:wheelOnRight',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('8b35523b-c726-64a9-c6f2-d7c04785785a',now(),'admin',1,now(),null,null,null,30,'scr$Car:deleteTs',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('8b79aa89-a97e-3b24-9a1f-bc9b63c441a0',now(),'admin',1,now(),null,null,null,30,'scr$Car:createTs',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('9dcca375-ac2f-ce13-8a98-8bc4ae07db1a',now(),'admin',1,now(),null,null,null,30,'scr$Car:technicalCertificate',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('9f76a1dc-c734-bb8b-a38f-3ee637bcc212',now(),'admin',1,now(),null,null,null,30,'scr$Car:manufactureDate',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('c89f7b4c-1e6c-41f1-ebd7-99712aa7d702',now(),'admin',1,now(),null,null,null,30,'scr$Car:id',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('cbcf870e-4281-5ce2-123d-36382b78d499',now(),'admin',1,now(),null,null,null,30,'scr$Car:createdBy',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('cf846c03-c29a-40b6-2215-a0622ded8aa5',now(),'admin',1,now(),null,null,null,30,'scr$Car:price',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('d9a60137-065a-081e-fdcc-9d9f5e0cba3f',now(),'admin',1,now(),null,null,null,30,'scr$Car:updateTs',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('de608a9a-a5af-78b5-1167-ed183374fe85',now(),'admin',1,now(),null,null,null,30,'scr$Car:version',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('e3322eb8-107c-d0aa-fc34-139d6a195217',now(),'admin',1,now(),null,null,null,30,'scr$Car:purchaseDate',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('f24e4496-2f78-33ad-2f8d-21c94899ded4',now(),'admin',1,now(),null,null,null,30,'scr$Car:regNumber',0,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');

INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('35010e42-f9c1-dde3-655d-98c2956225a8',now(),'admin',1,now(),null,null,null,40,'cuba.restApi.fileUpload.enabled',1,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('5dbc9ae5-c869-5e0b-63da-5cf4dad29e48',now(),'admin',1,now(),null,null,null,40,'cuba.restApi.enabled',1,'23548523-3f0f-f96a-07ff-0d60b9cb5c1b');

-- PERMISSIONS - MANAGERS
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('375a7d63-8484-3a77-a90b-9965db63d634',now(),'admin',1,now(),null,null,null,10,'application',1,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('0d0c1a61-da7e-9ce8-bbf1-b77aa4d8b7aa',now(),'admin',1,now(),null,null,null,20,'scr$Car:delete',1,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('5d2d3bc2-a2d0-80e0-7ed2-966eb43830be',now(),'admin',1,now(),null,null,null,20,'scr$Car:read',1,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('5fdaf791-d9be-8ac4-0ae4-d1c9b26df4cc',now(),'admin',1,now(),null,null,null,20,'scr$Car:update',1,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('792c50bf-417e-a05a-a70a-65da35986ae8',now(),'admin',1,now(),null,null,null,10,'scr$Car.browse',1,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('7e52dc0c-a757-0cb6-4618-8b685d144390',now(),'admin',1,now(),null,null,null,20,'scr$Car:create',1,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('a3fc94e2-1cbf-cf52-0ac6-dc284e1bd9dd',now(),'admin',1,now(),null,null,null,10,'scr$Car.edit',1,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('879ee3d2-4107-8581-3da2-a19ae3b9e57f',now(),'admin',1,now(),null,null,null,30,'scr$Car:carType',2,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('02a59ea2-047b-5d06-043c-99e7a6e0adfe',now(),'admin',1,now(),null,null,null,30,'scr$Car:manufacturer',2,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('cbdf3cc5-dc1c-cc67-f4f4-1d75bac60878',now(),'admin',1,now(),null,null,null,30,'scr$Car:regNumber',2,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('e4cf8ce1-2eb5-36fe-7ad9-ec83e98fc290',now(),'admin',1,now(),null,null,null,30,'scr$Car:model',2,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');

INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('20d28e51-a877-33d5-cca4-b408c3a3f557',now(),'admin',1,now(),null,null,null,40,'cuba.restApi.enabled',1,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');
INSERT INTO SEC_PERMISSION (ID,CREATE_TS,CREATED_BY,VERSION,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,PERMISSION_TYPE,TARGET,VALUE_,ROLE_ID) VALUES ('35462aa7-c709-9cf3-735a-19e2368581a5',now(),'admin',1,now(),null,null,null,40,'cuba.restApi.fileUpload.enabled',1,'91099ca3-194e-6ba5-7aa6-15b03bcef05a');

-- DATA

-- CARS
INSERT INTO SCR_CAR (ID,VERSION,CREATE_TS,CREATED_BY,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,MANUFACTURER,MODEL,REG_NUMBER,PURCHASE_DATE,MANUFACTURE_DATE,WHEEL_ON_RIGHT,CAR_TYPE,ECO_RANK,GARAGE_ID,MAX_PASSENGERS,PRICE,MILEAGE,TECHNICAL_CERTIFICATE_ID,PHOTO_ID) VALUES ('3da61043-aaad-7e30-c7f5-c1f1328d3980',1,now(),'admin',now(),null,null,null,'VAZ','2121','ab345',null,null,null,'SEDAN',null,null,null,null,null,null,null);
INSERT INTO SCR_CAR (ID,VERSION,CREATE_TS,CREATED_BY,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,MANUFACTURER,MODEL,REG_NUMBER,PURCHASE_DATE,MANUFACTURE_DATE,WHEEL_ON_RIGHT,CAR_TYPE,ECO_RANK,GARAGE_ID,MAX_PASSENGERS,PRICE,MILEAGE,TECHNICAL_CERTIFICATE_ID,PHOTO_ID) VALUES ('5f14d58d-6f24-4590-eef9-4b5885ed3e34',1,now(),'mechanic',now(),null,null,null,'ZAZ','968M','a010a',null,null,null,'SEDAN',1,null,null,null,null,null,null);
INSERT INTO SCR_CAR (ID,VERSION,CREATE_TS,CREATED_BY,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,MANUFACTURER,MODEL,REG_NUMBER,PURCHASE_DATE,MANUFACTURE_DATE,WHEEL_ON_RIGHT,CAR_TYPE,ECO_RANK,GARAGE_ID,MAX_PASSENGERS,PRICE,MILEAGE,TECHNICAL_CERTIFICATE_ID,PHOTO_ID) VALUES ('63e88502-3cf0-382c-8f5f-07a0c8a4d9b2',1,now(),'mechanic',now(),null,null,null,'GAZ','2410','aaabb',null,null,null,'HATCHBACK',null,null,null,null,null,null,null);
INSERT INTO SCR_CAR (ID,VERSION,CREATE_TS,CREATED_BY,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,MANUFACTURER,MODEL,REG_NUMBER,PURCHASE_DATE,MANUFACTURE_DATE,WHEEL_ON_RIGHT,CAR_TYPE,ECO_RANK,GARAGE_ID,MAX_PASSENGERS,PRICE,MILEAGE,TECHNICAL_CERTIFICATE_ID,PHOTO_ID) VALUES ('73c05bf0-ef67-4291-48a2-1481fc7f17e6',1,now(),'mechanic',now(),null,null,null,'AZLK','2141','az123',null,null,null,'HATCHBACK',null,null,null,null,null,null,null);
INSERT INTO SCR_CAR (ID,VERSION,CREATE_TS,CREATED_BY,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,MANUFACTURER,MODEL,REG_NUMBER,PURCHASE_DATE,MANUFACTURE_DATE,WHEEL_ON_RIGHT,CAR_TYPE,ECO_RANK,GARAGE_ID,MAX_PASSENGERS,PRICE,MILEAGE,TECHNICAL_CERTIFICATE_ID,PHOTO_ID) VALUES ('bf6791e6-0e0a-8ca1-6a98-75b0a8971676',2,now(),'admin',now(),'admin',null,null,'bmw','X0','x00zz',null,null,null,'SEDAN',null,null,null,null,null,null,null);
INSERT INTO SCR_CAR (ID,VERSION,CREATE_TS,CREATED_BY,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,MANUFACTURER,MODEL,REG_NUMBER,PURCHASE_DATE,MANUFACTURE_DATE,WHEEL_ON_RIGHT,CAR_TYPE,ECO_RANK,GARAGE_ID,MAX_PASSENGERS,PRICE,MILEAGE,TECHNICAL_CERTIFICATE_ID,PHOTO_ID) VALUES ('c2a14bec-cd7d-a3e4-1581-db243cf704aa',1,now(),'mechanic',now(),null,null,null,'Porshe','911',null,null,null,null,'SEDAN',null,null,null,null,null,null,null);
INSERT INTO SCR_CAR (ID,VERSION,CREATE_TS,CREATED_BY,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,MANUFACTURER,MODEL,REG_NUMBER,PURCHASE_DATE,MANUFACTURE_DATE,WHEEL_ON_RIGHT,CAR_TYPE,ECO_RANK,GARAGE_ID,MAX_PASSENGERS,PRICE,MILEAGE,TECHNICAL_CERTIFICATE_ID,PHOTO_ID) VALUES ('f44d486f-2fa3-4789-d02a-c1d2b2c67fc6',1,now(),'mechanic',now(),null,null,null,'Tesla','Model Y','tt444',null,null,null,'HATCHBACK',null,null,null,null,null,null,null);
INSERT INTO SCR_CAR (ID,VERSION,CREATE_TS,CREATED_BY,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,MANUFACTURER,MODEL,REG_NUMBER,PURCHASE_DATE,MANUFACTURE_DATE,WHEEL_ON_RIGHT,CAR_TYPE,ECO_RANK,GARAGE_ID,MAX_PASSENGERS,PRICE,MILEAGE,TECHNICAL_CERTIFICATE_ID,PHOTO_ID) VALUES ('fc63ccfc-e8e9-5486-5c38-98ae42f729da',2,now(),'mechanic',now(),'mechanic',null,null,'Mercedes',null,'mmbbb',null,null,null,'SEDAN',null,null,null,null,null,null,null);

-- SPARE PARTS
INSERT INTO PUBLIC.SCR_SPARE_PART_O2O (ID, VERSION, CREATE_TS, CREATED_BY, UPDATE_TS, UPDATED_BY, DELETE_TS, DELETED_BY, NAME) VALUES ('036ead75-04e5-7aa3-c7b8-0508b9e1bc30', 1, '2020-01-22 16:48:38.974000', 'admin', '2020-01-22 16:48:38.974000', null, null, null, 'Theta');

INSERT INTO SCR_SPARE_PART (ID,VERSION,CREATE_TS,CREATED_BY,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,NAME,SPARE_PARTS_ID,PART_ID,CURRENT_STOCK,LOCAL_DATE,LOCAL_TIME,LOCAL_DATE_TIME,OFFSET_DATE_TIME,OFFSET_TIME,BYTE_ARRAY) VALUES ('1afc42aa-6b13-4d3a-84c0-a30afbfd2e3c',1,now(),'admin',now(),null,null,null,'Fuse box',null,'9f43efd8-979d-4aca-b96a-223948326756',50,now(),now(),now(),now(),now(),'0x1234567');
INSERT INTO SCR_SPARE_PART (ID, VERSION, CREATE_TS, CREATED_BY, UPDATE_TS, UPDATED_BY, DELETE_TS, DELETED_BY, NAME, SPARE_PARTS_ID, PART_ID, CURRENT_STOCK, LOCAL_DATE, LOCAL_TIME, LOCAL_DATE_TIME, OFFSET_DATE_TIME, OFFSET_TIME, BYTE_ARRAY, COMPOSITION_O2O_ID) VALUES ('638a7842-1ecc-43d8-a2e0-3db995188967', 2, '2020-01-22 17:02:35.508667', 'admin', '2020-01-22 17:03:46.662000', 'admin', null, null, 'Grommet', null, 'e62d5f9d-b728-462f-87c6-ed690d3b78a1', 200, '2020-01-22', '17:02:35', '2020-01-22 17:02:35.508667', '2020-01-22 13:02:35.508667', '17:02:35.508667 +04:00', '0x89ABCDE', '036ead75-04e5-7aa3-c7b8-0508b9e1bc30');
INSERT INTO SCR_SPARE_PART (ID,VERSION,CREATE_TS,CREATED_BY,UPDATE_TS,UPDATED_BY,DELETE_TS,DELETED_BY,NAME,SPARE_PARTS_ID,PART_ID,CURRENT_STOCK,LOCAL_DATE,LOCAL_TIME,LOCAL_DATE_TIME,OFFSET_DATE_TIME,OFFSET_TIME,BYTE_ARRAY) VALUES ('59028362-eaa5-4521-8c51-8ecd0cde8b38',1,now(),'admin',now(),null,null,null,'Headlight wire harness',null,'81794bdf-e146-410c-b851-ea1c47f5d0f8',25,now(),now(),now(),now(),now(),'0xFFFFFFF');

INSERT INTO SCR_SPARE_PART_O2M (ID, VERSION, CREATE_TS, CREATED_BY, UPDATE_TS, UPDATED_BY, DELETE_TS, DELETED_BY, NAME, SPARE_PART_ID) VALUES ('f3ce8fd8-74b5-2c87-cf8c-05f6f81b1aa9', 1, '2020-01-22 16:47:49.853000', 'admin', '2020-01-22 16:47:49.853000', null, null, null, 'Beta', '638a7842-1ecc-43d8-a2e0-3db995188967');
INSERT INTO SCR_SPARE_PART_O2M (ID, VERSION, CREATE_TS, CREATED_BY, UPDATE_TS, UPDATED_BY, DELETE_TS, DELETED_BY, NAME, SPARE_PART_ID) VALUES ('11f9e074-158d-c345-c0ca-6427c7ec2ab4', 1, '2020-01-22 16:47:49.853000', 'admin', '2020-01-22 16:47:49.853000', null, null, null, 'Alpha', '638a7842-1ecc-43d8-a2e0-3db995188967');
