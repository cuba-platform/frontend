import * as Base from "yeoman-generator";
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

export const splitByCapitalLetter =  (word: string) => word.replace(/([^A-Z])([A-Z])/g, '$1 $2');

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

export function isBlank(str: string | undefined): boolean {
  return (str == null || /^\s*$/.test(str));
}

/**
 * Ensure that the path contains only forward slashes and no backward slashes, and has a trailing forward slash.
 *
 * @param relPath
 */
export function normalizeRelativePath(relPath: string | undefined): string {
  if (relPath == null || isBlank(relPath)) {
    return '';
  }

  const relPathPosix = relPath.replace(/\\/g, '/');
  return path.posix.join(relPathPosix, '/');
}

/**
 * The preferable method of throwing an error in Yeoman is using Environment.error() method.
 * It will prevent execution of the subsequent code, however, TypeScript compiler doesn't know about that.
 * Therefore, using Environment.error() in a function that returns a value will require e.g. throwing an error manually
 * or returning an empty value.
 * In such cases this helper function can be used. It returns `never`, which means that compiler won't consider
 * the code after this function reachable.
 *
 * @param generator
 * @param error
 */
export function throwError(generator: Pick<Base, 'env'>, error: string): never {
  generator.env.error(Error(error)); // This will throw an error and the subsequent code will never be reached
  throw error; // This code will never be reached and exists only to allow to return `never`
}



