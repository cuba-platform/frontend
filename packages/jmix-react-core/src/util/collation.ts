import {SerializedEntity} from '@cuba-platform/rest';

// TODO Implement client-side filtering
// export function filterEntityInstances<T>(items: Array<SerializedEntity<T>>, _filter: EntityFilter | undefined): Array<SerializedEntity<T>> {
//   return items;
// }

/**
 * Performs client-side sorting of entities, mimicking the way sorting is performed by REST API
 *
 * @param items - entity instances array
 * @param sort - REST API parameter representing sort field and order
 */
export function sortEntityInstances<T>(items: Array<SerializedEntity<T>>, sort: string | undefined): Array<SerializedEntity<T>> {
  if (sort == null) {
    return items;
  }

  let fieldName: string = sort;
  let isAscending: boolean = true;
  if (sort.startsWith('+')) {
    fieldName = sort.slice(1);
  } else if (sort.startsWith('-')) {
    fieldName = sort.slice(1);
    isAscending = false;
  }

  const sortOrderModifier = isAscending ? 1 : -1;

  return items.sort((a: any, b: any) => {
    let valA = a[fieldName];
    let valB = b[fieldName];

    if (valA === valB) {
      return 0;
    }

    // null and undefined go to bottom in ascending sort (i.e. are "greater" than any values)
    if (valA == null && valB != null) {
      // valA is null or undefined, but not valB -> valA is "greater" than valB
      return 1 * sortOrderModifier;
    }
    if (valB == null) {
      if (valA != null) {
        // valB is null or undefined, but not valA -> valB is "greater" than valA
        return -1 * sortOrderModifier;
      }
      // One is null and the other is undefined
      return 0;
    }

    if (typeof valA !== typeof valB) {
      // tslint:disable-next-line:no-console
      console.warn('Unexpected value encountered when performing client-side sorting of entity instances.' +
        ' The types of the values being compared differ and neither value is null or undefined.' +
        ' This might indicate a bug in the application. Sort order is not guaranteed to be correct.');
      return 0;
    }

    switch (typeof valA) {
      case 'number':
        if (!isFinite(valA) || !isFinite(valB)) {
          // tslint:disable-next-line:no-console
          console.warn('Unexpected value encountered when performing client-side sorting of entity instances.' +
            ' A numeric field contains a value that is NaN, positive or negative Infinity.' +
            ' This might indicate a bug in the application.');
          // Still attempt to sort the values
          // NaN is treated the same as null or undefined
          if (isNaN(valA) && !isNaN(valB)) {
            // valA is NaN, but not valB -> valA is "greater" than valB
            return 1 * sortOrderModifier;
          }
          if (isNaN(valB)) {
            if (!isNaN(valA)) {
              // valB is NaN, but not valA -> valB is "greater" than valA
              return -1 * sortOrderModifier;
            }
            // Both are NaN
            return 0;
          }
          // defaultCompare but one or both values are negative or positive Infinity
          return defaultCompare(valA, valB, sortOrderModifier);
        }
        return defaultCompare(valA, valB, sortOrderModifier);
      case 'object':
        const nameA = valA._instanceName != null ? valA._instanceName : '';
        const nameB = valB._instanceName != null ? valB._instanceName : '';

        return defaultCompare(nameA, nameB, sortOrderModifier);
      case 'string':
        // Imitate REST API behavior for consistency
        const nonAlphaNumericRegex = /[^0-9a-zA-Z]/g;
        const nonAlphaNumericCharsA = valA.match(nonAlphaNumericRegex)?.join('') || '';
        const nonAlphaNumericCharsB = valB.match(nonAlphaNumericRegex)?.join('') || '';

        valA = valA.replace(nonAlphaNumericRegex, '').toLowerCase();
        valB = valB.replace(nonAlphaNumericRegex, '').toLowerCase();

        const result = defaultCompare(valA, valB, sortOrderModifier);

        if (result !== 0) {
          return result
        }
        return defaultCompare(nonAlphaNumericCharsA, nonAlphaNumericCharsB, sortOrderModifier);
      case 'boolean':
        return defaultCompare(valA, valB, sortOrderModifier);
    }

    // tslint:disable-next-line:no-console
    console.warn('Unexpected value encountered when performing client-side sorting of entity instances.' +
      ` Value ${valA} of type ${typeof valA} is being compared to value ${valB} of type ${typeof valB}.` +
      ' Sort order is not guaranteed to be correct.');
    return 0;
  });
}

export function defaultCompare(valA: any, valB: any, sortOrderModifier: -1 | 1 = 1): number {
  if (valA < valB) {
    return -1 * sortOrderModifier;
  } else if (valA > valB) {
    return 1 * sortOrderModifier;
  } else {
    return 0;
  }
}
