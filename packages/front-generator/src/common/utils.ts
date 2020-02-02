import * as path from "path";
import {Entity} from "./model/cuba-model";

/**
 * Remove illegal symbols and normalize class name by standard js notation.
 *
 * @param {string} elementName 'my-app-custom' | 'myAppCustom' | 'my app custom'
 * @returns {string} class name MyAppCustom
 */
export const elementNameToClass = (elementName: string): string => {

  if (elementName.match(/$\s*^/)) throw new Error('Could not generate class name from empty string');

  return elementName
    .trim().replace(/\s{2,}/g, ' ') // extra spaces
    .replace(/[^\w\d\s_\-$]/g, '') // remove symbols not allowed in class name
    .split(/[-\s]/) // split by separate words
    .map(capitalizeFirst)
    .join('');
};

export const capitalizeFirst = (part: string) => part[0].toUpperCase() + part.slice(1);

export const unCapitalizeFirst = (part: string) => part[0].toLowerCase() + part.slice(1);

export function convertToUnixPath(input: string): string {
  const isExtendedLengthPath = /^\\\\\?\\/.test(input);
  const hasNonAscii = /[^\u0000-\u0080]+/.test(input); // eslint-disable-line no-control-regex

  if (isExtendedLengthPath || hasNonAscii) {
    return input;
  }

  return input.replace(/\\/g, '/');
}

/**
 * Convert java class fully qualified name to compilable TS class name
 *
 * @param fqn java class fqn
 */
export function fqnToName(fqn: string): string {
  return fqn.replace(/\./g, '_');
}

export function getEntityModulePath(entity: Entity, prefix: string = ''): string {
  const modulePath = entity.name ? entity.name : entity.className;
  return path.posix.join(prefix, modulePath);
}



