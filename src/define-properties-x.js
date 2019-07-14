/**
 * @file Define multiple non-enumerable properties at once.
 * @see {@link https://www.npmjs.com/package/define-properties|define-properties}
 * @version 3.1.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module define-properties-x
 */

const isFunction = require('is-function-x');
const isUndefined = require('validate.io-undefined');
const forEach = require('array-for-each-x');
const defineProperty = require('object-define-property-x');
const isFalsey = require('is-falsey-x');
const getKeys = require('get-own-enumerable-keys-x');

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

module.exports = {
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
   * @example
   * var define = require('define-properties-x');
   * define.properties({
   *   a: 1,
   *   b: 2
   * }, {
   *   a: function () { return false; },
   *   b: function () { return true; }
   * });
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
   * @example
   * var define = require('define-properties-x');
   * var myString = 'something';
   * define.property(obj, Symbol.iterator, function () {}, true);
   * define.property(obj, myString, function () {}, true);
   */
  property: $property,
};
