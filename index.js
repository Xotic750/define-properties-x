/**
 * @file Define multiple non-enumerable properties at once.
 * @see {@link https://www.npmjs.com/package/define-properties|define-properties}
 * @version 2.0.3
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module define-properties-x
 */

'use strict';

var hasSymbols = require('has-symbol-support-x');
var isFunction = require('is-function-x');
var isUndefined = require('validate.io-undefined');
var forEach = require('array-for-each-x');
var $keys = require('object-keys-x');
var $getOwnPropertySymbols = isFunction(Object.getOwnPropertySymbols) && Object.getOwnPropertySymbols;
var $defineProperty = require('object-define-property-x');

/**
 * Method `property`.
 *
 * @private
 * @param {Object} object - The object on which to define the property.
 * @param {string|Symbol} prop - The property name.
 * @param {*} value - The value of the property.
 * @param {boolean} [force=false] - If `true` then set property regardless.
 */
// eslint-disable-next-line max-params
var $property = function property(object, prop, value, force) {
  if (prop in object && Boolean(force) === false) {
    return;
  }

  $defineProperty(object, prop, {
    configurable: true,
    enumerable: false,
    value: value,
    writable: true
  });
};

/**
 * Method `properties`.
 *
 * @private
 * @param {Object} object - The object on which to define the property.
 * @param {Object} map - The object of properties.
 * @param {Object} [predicates] - The object of property predicates.
 */
var $properties = function properties(object, map, predicates) {
  var preds = isUndefined(predicates) ? {} : predicates;
  var props = $keys(map);
  if (hasSymbols && $getOwnPropertySymbols) {
    props = props.concat($getOwnPropertySymbols(map));
  }

  forEach(props, function _for(name) {
    var predicate = preds[name];
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
   * @param {Object} object - The object on which to define the property.
   * @param {Object} map - The object of properties.
   * @param {Object} [predicates] - The object of property predicates.
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
   * @param {Object} object - The object on which to define the property.
   * @param {string|Symbol} prop - The property name.
   * @param {*} value - The value of the property.
   * @param {boolean} [force=false] - If `true` then set property regardless.
   * @example
   * var define = require('define-properties-x');
   * var myString = 'something';
   * define.property(obj, Symbol.iterator, function () {}, true);
   * define.property(obj, myString, function () {}, true);
   */
  property: $property
};
