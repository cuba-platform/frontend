import { MemFsEditor } from "yeoman-generator";

export function writeI18nMessages(
  fs: MemFsEditor,
  className: string,
  dirShift: string = './',
  enJson: Record<string, string> = {},
  ruJson: Record<string, string> = {},
  frJson: Record<string, string> = {},
) {
  const i18nMessagesPathEn = dirShift + 'i18n/en.json';
  const i18nMessagesPathFr = dirShift + 'i18n/fr.json';
  const i18nMessagesPathRu = dirShift + 'i18n/ru.json';

  const existingMessagesEn = fs.readJSON(i18nMessagesPathEn);
  const existingMessagesRu = fs.readJSON(i18nMessagesPathRu);
  const existingMessagesFr = fs.readJSON(i18nMessagesPathFr);

  const {enOut, ruOut,frOut} = mergeI18nMessages(existingMessagesEn, enJson, existingMessagesRu, ruJson, existingMessagesFr, frJson,className);

  fs.writeJSON(i18nMessagesPathEn, enOut);
  fs.writeJSON(i18nMessagesPathRu, ruOut);
  fs.writeJSON(i18nMessagesPathFr, frOut);
}

export function mergeI18nMessages(
  enExisting: Record<string, string>,
  enTemplate: Record<string, string>,
  ruExisting: Record<string, string>,
  ruTemplate: Record<string, string>,
  frExisting: Record<string, string>,
  frTemplate: Record<string, string>,
  className: string
): {
  enOut: Record<string, string>, ruOut: Record<string, string>,frOut: Record<string, string>
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

  const frOut = {
    ...frTemplate,
    ...frExisting
  };

  return {enOut, ruOut,frOut};
}
