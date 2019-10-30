import { MemFsEditor } from "yeoman-generator";

export function writeI18nMessages(
  fs: MemFsEditor,
  className: string,
  dirShift: string = './',
  enJson: Record<string, string> = {},
  ruJson: Record<string, string> = {},
) {
  const i18nMessagesPathEn = dirShift + 'i18n/en.json';
  const i18nMessagesPathRu = dirShift + 'i18n/ru.json';

  const existingMessagesEn = fs.readJSON(i18nMessagesPathEn);
  const existingMessagesRu = fs.readJSON(i18nMessagesPathRu);

  const resultMessagesEn = {
    ...enJson,
    [`router.${className}`]: className,
    ...existingMessagesEn
  };
  const resultMessagesRu = {
    ...ruJson,
    ...existingMessagesRu
  };

  fs.writeJSON(i18nMessagesPathEn, resultMessagesEn);
  fs.writeJSON(i18nMessagesPathRu, resultMessagesRu);
}
