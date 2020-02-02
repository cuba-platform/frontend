import * as path from 'path';
import {MemFsEditor} from "yeoman-generator";
import {capitalizeFirst, splitByCapitalLetter} from "../../../common/utils";

/**
 * Add set of en and ru component messages to existed i18n files.
 * Also, based on class name, generates and add component menu item caption in en.json file.
 * If any message already exist in file - it will be overwritten with new value.
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

  const existingMessagesEn = fs.readJSON(i18nMessagesPathEn);
  const existingMessagesRu = fs.readJSON(i18nMessagesPathRu);

  const {enOut, ruOut} = mergeI18nMessages(existingMessagesEn, enJson, existingMessagesRu, ruJson, className);

  fs.writeJSON(i18nMessagesPathEn, enOut);
  fs.writeJSON(i18nMessagesPathRu, ruOut);
}

// todo return null and do not rewrite messages file if there are no changes
function mergeI18nMessages(
  enExisting: Record<string, string>,
  enTemplate: Record<string, string>,
  ruExisting: Record<string, string>,
  ruTemplate: Record<string, string>,
  className: string)
  : { enOut: Record<string, string>, ruOut: Record<string, string> } {

  const menuCaption = splitByCapitalLetter(capitalizeFirst(className));
  const enOut = {
    ...enTemplate,
    [`router.${className}`]: menuCaption,
    ...enExisting
  };

  const ruOut = {
    ...ruTemplate,
    ...ruExisting
  };

  return {enOut, ruOut};
}
