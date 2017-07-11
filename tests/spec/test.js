'use strict';

var lib;
if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');
  if (typeof JSON === 'undefined') {
    JSON = {};
  }
  require('json3').runInContext(null, JSON);
  require('es6-shim');
  var es7 = require('es7-shim');
  Object.keys(es7).forEach(function (key) {
    var obj = es7[key];
    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  lib = require('../../index.js');
} else {
  lib = returnExports;
}

var areDescriptorsSupported = function () {
  var obj = {};
  try {
    Object.defineProperty(obj, 'x', {
      enumerable: false,
      value: obj
    });
    // eslint-disable-next-line no-restricted-syntax
    for (var unused in obj) {
      return false;
    }
    return obj.x === obj;
  } catch (e) { /* this is IE 8. */
    return false;
  }
};

var descriptorsSupported = Boolean(Object.defineProperty) && areDescriptorsSupported();
var hasSymbols = typeof Symbol === 'function' && typeof Symbol('') === 'symbol';
var ifHasSymbolsIt = hasSymbols ? it : xit;
var ifDescriptorsSupportedIt = descriptorsSupported ? it : xit;
var ifNotDescSupportedIt = descriptorsSupported ? xit : it;

describe('Basic tests', function () {
  describe('defineProperty', function () {
    ifDescriptorsSupportedIt('with descriptor support', function () {
      var getDescriptor = function (value) {
        return {
          configurable: true,
          enumerable: false,
          value: value,
          writable: true
        };
      };
      var obj = {
        a: 1,
        b: 2
      };
      obj.c = 3;
      expect(Object.keys(obj)).toEqual(
        [
          'a',
          'b',
          'c'
        ],
        'all literal-set Object.keys start enumerable'
      );
      lib.property(obj, 'c', 4);
      lib.property(obj, 'd', 5);
      expect(obj).toEqual({
        a: 1,
        b: 2,
        c: 3
      }, 'existing properties were not overridden');
      expect(Object.getOwnPropertyDescriptor(obj, 'd')).toEqual(
        getDescriptor(5),
        'new property "d" was added and is not enumerable'
      );
      expect([
        'a',
        'b',
        'c'
      ]).toEqual(
        Object.keys(obj),
        'new Object.keys are not enumerable'
      );

      lib.property(obj, 'a', 2, true);
      lib.property(obj, 'b', 3, false);
      lib.property(obj, 'c', 4);
      expect(obj).toEqual({
        b: 2,
        c: 3
      }, 'properties only overriden when predicate exists and returns true');
      expect(Object.getOwnPropertyDescriptor(obj, 'd')).toEqual(
        getDescriptor(5),
        'existing property "d" remained and is not enumerable'
      );
      expect(Object.getOwnPropertyDescriptor(obj, 'a')).toEqual(
        getDescriptor(2),
        'existing property "a" was overridden and is not enumerable'
      );
      expect(['b', 'c']).toEqual(
        Object.keys(obj),
        'overridden Object.keys are not enumerable'
      );
    });

    ifNotDescSupportedIt('without descriptor support', function () {
      var obj = {
        a: 1,
        b: 2,
        c: 3
      };
      lib.property(obj, 'b', 3);
      lib.property(obj, 'c', 4);
      lib.property(obj, 'd', 5);
      expect(obj).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 5
      }, 'existing properties were not overridden, new properties added');

      lib.property(obj, 'a', 2, true);
      lib.property(obj, 'b', 3, false);
      lib.property(obj, 'c', 4);
      expect(obj).toEqual({
        a: 2,
        b: 2,
        c: 3,
        d: 5
      }, 'properties only overriden when predicate exists and returns true');
    });

    ifHasSymbolsIt('symbols', function () {
      var sym = Symbol('foo'),
        obj = {},
        aValue = {},
        bValue = {};

      lib.property(obj, 'a', aValue);
      lib.property(obj, sym, bValue);

      expect(Object.keys(obj)).toEqual(
        [],
        'object has no enumerable Object.keys'
      );
      expect(Object.getOwnPropertyNames(obj)).toEqual(
        ['a'],
        'object has non-enumerable "a" key'
      );
      expect(Object.getOwnPropertySymbols(obj)).toEqual(
        [sym],
        'object has non-enumerable symbol key'
      );
      expect(obj.a).toBe(aValue, 'string keyed value is defined');
      expect(obj[sym]).toBe(bValue, 'symbol keyed value is defined');
    });
  });

  describe('defineProperties', function () {
    ifDescriptorsSupportedIt('with descriptor support', function () {
      var getDescriptor = function (value) {
        return {
          configurable: true,
          enumerable: false,
          value: value,
          writable: true
        };
      };

      var obj = {
        a: 1,
        b: 2,
        c: 3
      };
      expect(Object.keys(obj)).toEqual(
        [
          'a',
          'b',
          'c'
        ],
        'all literal-set keys start enumerable'
      );
      lib.properties(obj, {
        b: 3,
        c: 4,
        d: 5
      });
      expect(obj).toEqual({
        a: 1,
        b: 2,
        c: 3
      }, 'existing properties were not overridden');
      expect(Object.getOwnPropertyDescriptor(obj, 'd')).toEqual(
        getDescriptor(5),
        'new property "d" was added and is not enumerable'
      );
      expect([
        'a',
        'b',
        'c'
      ]).toEqual(
        Object.keys(obj),
        'new keys are not enumerable'
      );

      lib.properties(obj, {
        a: 2,
        b: 3,
        c: 4
      }, {
        a: function () {
          return true;
        },
        b: function () {
          return false;
        }
      });
      expect(obj).toEqual({
        b: 2,
        c: 3
      }, 'properties only overriden when predicate exists and returns true');
      expect(Object.getOwnPropertyDescriptor(obj, 'd')).toEqual(
        getDescriptor(5),
        'existing property "d" remained and is not enumerable'
      );
      expect(Object.getOwnPropertyDescriptor(obj, 'a')).toEqual(
        getDescriptor(2),
        'existing property "a" was overridden and is not enumerable'
      );
      expect(['b', 'c']).toEqual(
        Object.keys(obj),
        'overridden keys are not enumerable'
      );
    });

    ifNotDescSupportedIt('without descriptor support', function () {
      var obj = {
        a: 1,
        b: 2,
        c: 3
      };
      lib.properties(obj, {
        b: 3,
        c: 4,
        d: 5
      });
      expect(obj).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 5
      },
      'existing properties were not overridden, new properties were added'
      );

      lib.properties(obj, {
        a: 2,
        b: 3,
        c: 4
      }, {
        a: function () {
          return true;
        },
        b: function () {
          return false;
        }
      });
      expect(obj).toEqual({
        a: 2,
        b: 2,
        c: 3,
        d: 5
      }, 'properties only overriden when predicate exists and returns true');
    });

    ifHasSymbolsIt('symbols', function () {
      var sym = Symbol('foo');
      var obj = {};
      var aValue = {};
      var bValue = {};
      var properties = { a: aValue };
      properties[sym] = bValue;

      lib.properties(obj, properties);

      expect(Object.keys(obj)).toEqual([], 'object has no enumerable keys');
      expect(Object.getOwnPropertyNames(obj)).toEqual(
        ['a'],
        'object has non-enumerable "a" key'
      );
      expect(Object.getOwnPropertySymbols(obj)).toEqual(
        [sym],
        'object has non-enumerable symbol key'
      );
      expect(obj.a).toBe(aValue, 'string keyed value is defined');
      expect(obj[sym]).toBe(bValue, 'symbol keyed value is defined');
    });
  });
});
