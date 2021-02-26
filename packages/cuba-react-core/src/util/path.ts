import { mergeDeep } from "./object"

type Path = string[]

function convertPathToStringPath(path: Path): string {
    return path.join('.')
}

function convertStringPathToPath(stringPath: string): Path {
    return stringPath.split('.')
}

export function getPropertyNameFromStringPath(stringPath: string): string {
    const path = convertStringPathToPath(stringPath)
    return path[path.length - 1]
}

function createNestedObjectByPath([head, ...tail]: Path, value: any): any {
    return tail.length === 0
        ? {[head]: value}
        : {[head]: createNestedObjectByPath(tail, value)}
}

export function nestingObject(flatObject: Record<string, any>): any {
    return Object.keys(flatObject)
        .map((stringPath) => createNestedObjectByPath(convertStringPathToPath(stringPath), flatObject[stringPath]))
        .reduce(mergeDeep, {})
}
  
function flattenPathsFromObject(obj: any, path: Path = []): Path[] {
  return Object.keys(obj)
        .reduce<string[][]>((acc, key) =>
            typeof obj[key] === 'object' && obj[key] !== null
                ? [...acc, ...flattenPathsFromObject(obj[key], [...path, key])]
                : [...acc, [...path, key]]
            ,
            [],
        )
}

function getValueInNestedObjectByPath(obj: any, path: Path): any {
    return path.reduce((acc, key) => acc[key], obj)
}

export function flattenObject(nestedObject: Record<string, any>): Record<string, any> {
  const paths = flattenPathsFromObject(nestedObject)
  return paths
    .reduce<Record<string, any>>((acc, path) => ({
            ...acc,
            [convertPathToStringPath(path)]: getValueInNestedObjectByPath(nestedObject, path),
        }),
        {},
    )
}
