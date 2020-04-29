import * as path from 'path';
import {MemFsEditor} from "yeoman-generator";
import {capitalizeFirst, splitByCapitalLetter} from "../../../common/utils";

/**
 * Add set of en and ru component messages to existed i18n files.
 * Also, based on class name, generates and add component menu item caption in en.json file.
 * If any message already exist in file - it will be NOT overwritten with new value.
 *
 * @param fs - yeoman fs
 * @param className - component class name
 * @param dirShift - directory depth from project root
 * @param enJson - object with key-value i18n component captions to be added in en file
 * @param ruJson - object with key-value i18n component captions to be added in ru file
 */
export function writeComponentI18nMessages(
  fs: MemFsEditor,
  className: string,
  dirShift: string = './',
  enJson: Record<string, string> = {},
  ruJson: Record<string, string> = {},
) {
  const i18nMessagesPathEn = path.join(dirShift, 'i18n/en.json');
  const i18nMessagesPathRu = path.join(dirShift, 'i18n/ru.json');

  const existingMessagesEn: Record<string, string> | null = fs.readJSON(i18nMessagesPathEn);
  const existingMessagesRu: Record<string, string> | null = fs.readJSON(i18nMessagesPathRu);

  const {enOut, ruOut} = mergeI18nMessages(existingMessagesEn, enJson, existingMessagesRu, ruJson, className);

  // mergeI18nMessages could returns 'null' as out in case we don't have nor new nor changed rows in it
  enOut && fs.writeJSON(i18nMessagesPathEn, enOut);
  ruOut && fs.writeJSON(i18nMessagesPathRu, ruOut);
}

/**
 * Method could returns null for 'en' or 'ru' out if no changes need to be made in file.
 *
 * @param enExisting en rows already existed in i18n file
 * @param enTemplate en rows to be added
 * @param ruExisting ru rows already existed in i18n file
 * @param ruTemplate ru rows to be added
 * @param className menu caption will be generated based on this name and added to en file
 */
function mergeI18nMessages(
  enExisting: Record<string, string> | null,
  enTemplate: Record<string, string>,
  ruExisting: Record<string, string> | null,
  ruTemplate: Record<string, string>,
  className: string)
  : { enOut: Record<string, string> | null, ruOut: Record<string, string> | null } {

  const menuCaption = splitByCapitalLetter(capitalizeFirst(className));

  enTemplate = {
    ...enTemplate,
    [`router.${className}`]: menuCaption
  };

  const enOut  = hasNewEntries(enTemplate, enExisting)
    ? {
    ...enTemplate,
    ...enExisting
  } : null;

  const ruOut = hasNewEntries(ruTemplate, ruExisting)
    ? {
      ...ruTemplate,
      ...ruExisting
    } : null;

  return {enOut, ruOut};
}

function hasNewEntries(newVals: Record<string, string>, oldVals: Record<string, string> | null): boolean {
  const newKeys = Object.keys(newVals);

  if (newKeys.length === 0) return false;
  if (!oldVals) return true;

  return !newKeys.every((newK) => Object.keys(oldVals).some((oldK) => oldK === newK));
}

