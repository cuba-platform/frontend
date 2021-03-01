declare const Buffer;
declare const global;

export function base64encode(str: string): string {
  /* tslint:disable:no-string-literal */
  if (typeof btoa === 'function') {
    return btoa(str);
  } else if (global['Buffer']) { // prevent Buffer from being injected by browserify
    return new global['Buffer'](str).toString('base64');
  } else {
    throw new Error('Unable to encode to base64');
  }
  /* tslint:enable:no-string-literal */
}

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
export function matchesVersion(testVersion: string, minimumVersion: string): boolean {
  if (!testVersion) {
    return false;
  }

  if (!minimumVersion) {
    throw new Error('Cannot determine required REST API version: the minimum version is not valid');
  }

  const testVersionComponents = testVersion.split('.');
  const requiredVersionComponents = minimumVersion.split('.');

  for (let i = 0; i < requiredVersionComponents.length; i++) {
    const match = parseInt(requiredVersionComponents[i], 10);
    const test = parseInt(testVersionComponents[i], 10);

    if (isNaN(match) || match < 0) {
      throw new Error('Cannot determine required REST API version: the minimum version is not valid');
    }

    if ((test === undefined || test === null || isNaN(test)) && match > 0) {
      // Required version has more components than test version, and current required version component is > 0
      return false;
    }

    if (test > match) {
      return true;
    } else if (test < match) {
      return false;
    }
  }

  // Versions are equal
  return true;
}

export function encodeGetParams(data): string {
  return Object
    .keys(data)
    .map((key) => {
      return encodeURIComponent(key) + "=" + (encodeURIComponent(serialize(data[key])));
    })
    .join("&");
}

function serialize(rawParam): string {
  if (rawParam == null) {
    return '';
  }
  if (typeof rawParam === 'object') {
    return JSON.stringify(rawParam);
  }
  return rawParam;
}

export function getStringId(id: string | object) : string {
  return typeof id === "object" ? base64encode(JSON.stringify(id)) : id;
}
