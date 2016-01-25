/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/define-properties-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/define-properties-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/define-properties-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/define-properties-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/define-properties-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/define-properties-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/define-properties-x" title="npm version">
 * <img src="https://badge.fury.io/js/define-properties-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * Based on the original work by Jordan Harband
 * {@link https://www.npmjs.com/package/define-properties `define-properties`}.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.1.1
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module define-properties-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:4, maxdepth:2,
  maxstatements:12, maxcomplexity:3 */

/*global module */

;(function () {
  'use strict';

  var hasSymbols = require('has-symbol-support-x');
  var isFunction = require('is-function-x');
  var isUndefined = require('validate.io-undefined');
  var pConcat = Array.prototype.concat;
  var pForEach = Array.prototype.forEach;
  var $keys = Object.keys;
  var $getOwnPropertySymbols = isFunction(Object.getOwnPropertySymbols) &&
    Object.getOwnPropertySymbols;
  var $defineProperty = isFunction(Object.defineProperty) &&
    Object.defineProperty;
  var supportsDescriptors = Boolean($defineProperty) && (function (unused) {
    var obj = {};
    try {
      $defineProperty(obj, 'x', {
        enumerable: false,
        value: obj
      });
      for (unused in obj) {
        /*jshint forin:false */
        return false;
      }
      return obj.x === obj;
    } catch (e) { /* this is IE 8. */
      return false;
    }
  })();

  /**
   * Method `property`.
   *
   * @private
   * @param {Object} object The object on which to define the property.
   * @param {string|Symbol} prop The property name.
   * @param {*} value The value of the property.
   * @param {boolean} [force=false] If `true` then set property regardless.
   */
  function property(object, prop, value, force) {
    if (prop in object && !force) {
      return;
    }
    if (supportsDescriptors) {
      $defineProperty(object, prop, {
        configurable: true,
        enumerable: false,
        value: value,
        writable: true
      });
    } else {
      object[prop] = value;
    }
  }

  /**
   * Method `properties`.
   *
   * @private
   * @param {Object} object The object on which to define the property.
   * @param {Object} map The object of properties.
   * @param {Object} [predicates] The object of property predicates.
   */
  function properties(object, map, predicates) {
    var preds = isUndefined(predicates) ? {} : predicates;
    var props = $keys(map);
    if (hasSymbols && $getOwnPropertySymbols) {
      props = pConcat.call(props, $getOwnPropertySymbols(map));
    }
    pForEach.call(props, function (name) {
      var predicate = preds[name];
      property(
        object,
        name,
        map[name],
        isFunction(predicate) && predicate()
      );
    });
  }

  properties(module.exports, {
    /**
     * Just like `properties` but for defining a single non-enumerable
     * property. Useful in environments that do not
     * support `Computed property names`. This can be done
     * with `properties`, but this method can read a little cleaner.
     *
     * @function
     * @param {Object} object The object on which to define the property.
     * @param {string|Symbol} prop The property name.
     * @param {*} value The value of the property.
     * @param {boolean} [force=false] If `true` then set property regardless.
     * @example
     * var define = require('define-properties-x');
     * var myString = 'something';
     * define.property(obj, Symbol.iterator, function () {}, true);
     * define.property(obj, myString, function () {}, true);
     */
    property: property,
    /**
     * Define multiple non-enumerable properties at once.
     * Uses `Object.defineProperty` when available; falls back to standard
     * assignment in older engines. Existing properties are not overridden.
     * Accepts a map of property names to a predicate that, when true,
     * force-overrides.
     *
     * @function
     * @param {Object} object The object on which to define the property.
     * @param {Object} map The object of properties.
     * @param {Object} [predicates] The object of property predicates.
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
    properties: properties,
    /**
     * Boolean indicator as to whether the environments supports descriptors
     * or not.
     *
     * @type boolean
     * @example
     * var define = require('define-properties-x');
     * define.supportsDescriptors; // true or false
     */
    supportsDescriptors: supportsDescriptors
  });
}());
