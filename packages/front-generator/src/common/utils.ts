/**
 * @param {string} elementName my-app-custom
 * @returns {string} class name MyAppCustom
 */
export const elementNameToClass = (elementName: string): string => {
  if (elementName == null) {
    return elementName;
  }
  return elementName
    .split('-')
    .map(capitalizeFirst)
    .join('');
};

export const capitalizeFirst = (part: string) => part[0].toUpperCase() + part.slice(1);

export const unCapitalizeFirst = (part: string) => part[0].toLowerCase() + part.slice(1);