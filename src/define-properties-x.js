import isFunction from 'is-function-x';

import isUndefined from 'validate.io-undefined';
import forEach from 'array-for-each-x';
import defineProperty from 'object-define-property-x';
import isFalsey from 'is-falsey-x';
import getKeys from 'get-own-enumerable-keys-x';

/**
 * Method `property`.
 *
 * @private
 * @param {object} object - The object on which to define the property.
 * @param {string|Symbol} prop - The property name.
 * @param {*} value - The value of the property.
 * @param {boolean} [force=false] - If `true` then set property regardless.
 */
// eslint-disable-next-line max-params
const $property = function property(object, prop, value, force) {
  if (prop in object && isFalsey(force)) {
    return;
  }

  defineProperty(object, prop, {
    configurable: true,
    enumerable: false,
    value,
    writable: true,
  });
};

/**
 * Method `properties`.
 *
 * @private
 * @param {object} object - The object on which to define the property.
 * @param {object} map - The object of properties.
 * @param {object} [predicates] - The object of property predicates.
 */
const $properties = function properties(object, map, predicates) {
  const preds = isUndefined(predicates) ? {} : predicates;
  forEach(getKeys(map), function(name) {
    const predicate = preds[name];
    $property(object, name, map[name], isFunction(predicate) && predicate());
  });
};

export default {
  /**
   * Define multiple non-enumerable properties at once.
   * Uses `Object.defineProperty` when available; falls back to standard
   * assignment in older engines. Existing properties are not overridden.
   * Accepts a map of property names to a predicate that, when true,
   * force-overrides.
   *
   * @function
   * @param {object} object - The object on which to define the property.
   * @param {object} map - The object of properties.
   * @param {object} [predicates] - The object of property predicates.
   */
  properties: $properties,
  /**
   * Just like `properties` but for defining a single non-enumerable
   * property. Useful in environments that do not
   * support `Computed property names`. This can be done
   * with `properties`, but this method can read a little cleaner.
   *
   * @function
   * @param {object} object - The object on which to define the property.
   * @param {string|Symbol} prop - The property name.
   * @param {*} value - The value of the property.
   * @param {boolean} [force=false] - If `true` then set property regardless.
   */
  property: $property,
};
