import * as path from 'path';
import {MemFsEditor} from "yeoman-generator";

/**
 * Generates and add 'router.className = Class Name' message to i18n en file.
 * Also add set of en and ru messages passed in parameters ('enJson', 'ruJson') to existed i18n files.
 * If message already exist in file - it will be overwritten with new value.
 *
 * @param fs - yeoman fs
 * @param className - component class name //todo may be pass className for router as part of enJson object
 * @param dirShift - directory depth from project root
 * @param enJson - object with key-value messages to be added in en file
 * @param ruJson - object with key-value messages to be added in ru file
 */
export function writeI18nMessages(
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
  className: string
): {
  enOut: Record<string, string>, ruOut: Record<string, string>
} {
  const enOut = {
    ...enTemplate,
    [`router.${className}`]: className,
    ...enExisting
  };

  const ruOut = {
    ...ruTemplate,
    ...ruExisting
  };

  return {enOut, ruOut};
}
