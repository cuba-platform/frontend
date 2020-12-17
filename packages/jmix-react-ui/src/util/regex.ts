// More strict validation would be:
// export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// However, we are using relaxed validation rules as Backoffice UI allows to create UUIDs with invalid
// versions and variants (https://github.com/cuba-platform/cuba/issues/2867)
// TODO Once https://github.com/cuba-platform/cuba/issues/2867 is fixed, choose the regex dynamically based on Platform version.
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
