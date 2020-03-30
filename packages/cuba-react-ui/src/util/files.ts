export function saveFile(objectUrl: string, fileName: string) {
  const anchor: HTMLAnchorElement = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();
}