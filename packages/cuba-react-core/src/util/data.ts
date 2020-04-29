export const TEMPORARY_ENTITY_ID_PREFIX = '_CUBA_TEMPORARY_ENTITY_ID_';

export const generateTemporaryEntityId = () => TEMPORARY_ENTITY_ID_PREFIX + Math.random().toString().slice(2);
