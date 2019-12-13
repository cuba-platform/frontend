export declare function base64encode(str: string): string;
/**
 * Compares version strings. Intended to be used only for comparing versions consisting of major, minor and
 * (optional) patch version (dot-separated) and optional `-SNAPSHOT` suffix. Does not conform to
 * Semantic Versioning Specification and will produce incorrect results in some cases not covered above
 * (e.g. it doesn't take into account any text including pre-release identifiers, so 7.2.0-beta will be considered
 * equal to 7.2.0).
 *
 * @param testVersion
 * @param minimumVersion
 *
 * @returns true if testVersion is greater or equal than minimumVersion
 */
export declare function matchesVersion(testVersion: string, minimumVersion: string): boolean;
export declare function encodeGetParams(data: any): string;
