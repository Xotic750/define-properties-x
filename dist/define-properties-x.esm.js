function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

import isFunction from 'is-function-x';
import forEach from 'array-for-each-x';
import defineProperty from 'object-define-property-x';
import getKeys from 'get-own-enumerable-keys-x';
/**  @type {BooleanConstructor} */

var castBoolean = true.constructor;
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

export var property = function property(object, prop, value, force) {
  if (prop in object && castBoolean(force) === false) {
    return;
  }

  defineProperty(object, prop, {
    configurable: true,
    enumerable: false,
    value: value,
    writable: true
  });
};
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

export var properties = function properties(object, map, predicates) {
  var _this = this;

  var preds = typeof predicates === 'undefined' ? {} : predicates;
  forEach(getKeys(map), function (name) {
    _newArrowCheck(this, _this);

    var predicate = preds[name];
    property(object, name, map[name], isFunction(predicate) && predicate());
  }.bind(this));
};

//# sourceMappingURL=define-properties-x.esm.js.map