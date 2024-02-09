/* eslint-disable no-nested-ternary */

/**
 * Raw code copied from https://github.com/voodoocreation/ts-deepmerge's index.ts file
 * except for the mergeObjectReducer function and comments.
 * We prefer to reduce npm dependencies when it is easy (ex. a single file)
 *
 * const obj1 = {
  a: {
    a: 1
  }
};

const obj2 = {
  b: {
    a: 2,
    b: 2
  }
};

const obj3 = {
  a: {
    b: 3
  },
  b: {
    b: 3,
    c: 3
  },
  c: 3
};

const result = merge(obj1, obj2, obj3);

returns {
  "a": {
    "a": 1,
    "b": 3
  },
  "b": {
    "a": 2,
    "b": 3,
    "c": 3
  },
  "c": 3
}
 */
type TAllKeys<T> = T extends any ? keyof T : never;

type TIndexValue<T, K extends PropertyKey, D = never> = T extends any
  ? K extends keyof T
    ? T[K]
    : D
  : never;

type TPartialKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

type TFunction = (...a: any[]) => any;

type TPrimitives =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | Date
  | TFunction;

type TMerged<T> = [T] extends [Array<any>]
  ? { [K in keyof T]: TMerged<T[K]> }
  : [T] extends [TPrimitives]
    ? T
    : [T] extends [object]
      ? TPartialKeys<{ [K in TAllKeys<T>]: TMerged<TIndexValue<T, K>> }, never>
      : T;

// istanbul ignore next
const isObject = (obj: any) => {
  if (typeof obj === 'object' && obj !== null) {
    if (typeof Object.getPrototypeOf === 'function') {
      const prototype = Object.getPrototypeOf(obj);
      return prototype === Object.prototype || prototype === null;
    }

    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  return false;
};

interface IObject {
  [key: string]: any;
}

const merge = <T extends IObject[]>(...objects: T): TMerged<T[number]> =>
  objects.reduce((result, current) => {
    if (Array.isArray(current)) {
      throw new TypeError(
        'Arguments provided to ts-deepmerge must be objects, not arrays.',
      );
    }

    Object.keys(current).forEach((key) => {
      if (['__proto__', 'constructor', 'prototype'].includes(key)) {
        return;
      }

      if (Array.isArray(result[key]) && Array.isArray(current[key])) {
        result[key] = merge.options.mergeArrays
          ? merge.options.uniqueArrayItems
            ? Array.from(
                new Set((result[key] as unknown[]).concat(current[key])),
              )
            : [...result[key], ...current[key]]
          : current[key];
      } else if (isObject(result[key]) && isObject(current[key])) {
        result[key] = merge(result[key] as IObject, current[key] as IObject);
      } else {
        result[key] =
          current[key] === undefined
            ? merge.options.allowUndefinedOverrides
              ? current[key]
              : result[key]
            : current[key];
      }
    });

    return result;
  }, {}) as any;

interface IOptions {
  /**
   * When `true`, values explicitly provided as `undefined` will override existing values, though properties that are simply omitted won't affect anything.
   * When `false`, values explicitly provided as `undefined` won't override existing values.
   *
   * Default: `true`
   */
  allowUndefinedOverrides: boolean;

  /**
   * When `true` it will merge array properties.
   * When `false` it will replace array properties with the last instance entirely instead of merging their contents.
   *
   * Default: `true`
   */
  mergeArrays: boolean;

  /**
   * When `true` it will ensure there are no duplicate array items.
   * When `false` it will allow duplicates when merging arrays.
   *
   * Default: `true`
   */
  uniqueArrayItems: boolean;
}

const defaultOptions: IOptions = {
  allowUndefinedOverrides: true,
  mergeArrays: true,
  uniqueArrayItems: true,
};

merge.options = defaultOptions;

merge.withOptions = <T extends IObject[]>(
  options: Partial<IOptions>,
  ...objects: T
) => {
  merge.options = {
    ...defaultOptions,
    ...options,
  };

  const result = merge(...objects);

  merge.options = defaultOptions;

  return result;
};

/**
 * This does a deep merge on the action object with the previous state. This allows us to update
 * any state property without having to provide the entire state object (some components don't have this when updating).
 * This also helps with some closure/race conditions.
 *
 * See the comment at the top of deepMerge.ts for an detailed example.
 * @param state object
 * @param action object
 * @returns object
 */
export const mergeObjectReducer = (state: object, action: object) => {
  return merge(state, action);
};

export default merge;
