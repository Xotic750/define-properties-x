let lib;

const areDescriptorsSupported = function() {
  try {
    const obj = Object.defineProperty({}, 'x', {
      enumerable: false,
      value: true,
    });

    if (Object.keys(obj).length > 0) {
      return false;
    }

    return obj.x === true;
  } catch (e) {
    /* this is IE 8. */
    return false;
  }
};

const descriptorsSupported = Boolean(Object.defineProperty) && areDescriptorsSupported();
const hasSymbols = typeof Symbol === 'function' && typeof Symbol('') === 'symbol';
const ifHasSymbolsIt = hasSymbols ? it : xit;
const ifDescriptorsSupportedIt = descriptorsSupported ? it : xit;
const ifNotDescSupportedIt = descriptorsSupported ? xit : it;

describe('basic tests', function() {
  describe('defineProperty', function() {
    ifDescriptorsSupportedIt('with descriptor support', function() {
      const getDescriptor = function(value) {
        return {
          configurable: true,
          enumerable: false,
          value,
          writable: true,
        };
      };

      const obj = {
        a: 1,
        b: 2,
      };
      obj.c = 3;
      expect(Object.keys(obj)).toStrictEqual(['a', 'b', 'c'], 'all literal-set Object.keys start enumerable');
      lib.property(obj, 'c', 4);
      lib.property(obj, 'd', 5);
      expect(obj).toStrictEqual(
        {
          a: 1,
          b: 2,
          c: 3,
        },
        'existing properties were not overridden',
      );
      expect(Object.getOwnPropertyDescriptor(obj, 'd')).toStrictEqual(
        getDescriptor(5),
        'new property "d" was added and is not enumerable',
      );
      expect(['a', 'b', 'c']).toStrictEqual(Object.keys(obj), 'new Object.keys are not enumerable');

      lib.property(obj, 'a', 2, true);
      lib.property(obj, 'b', 3, false);
      lib.property(obj, 'c', 4);
      expect(obj).toStrictEqual(
        {
          b: 2,
          c: 3,
        },
        'properties only overriden when predicate exists and returns true',
      );
      expect(Object.getOwnPropertyDescriptor(obj, 'd')).toStrictEqual(
        getDescriptor(5),
        'existing property "d" remained and is not enumerable',
      );
      expect(Object.getOwnPropertyDescriptor(obj, 'a')).toStrictEqual(
        getDescriptor(2),
        'existing property "a" was overridden and is not enumerable',
      );
      expect(['b', 'c']).toStrictEqual(Object.keys(obj), 'overridden Object.keys are not enumerable');
    });

    ifNotDescSupportedIt('without descriptor support', function() {
      const obj = {
        a: 1,
        b: 2,
        c: 3,
      };
      lib.property(obj, 'b', 3);
      lib.property(obj, 'c', 4);
      lib.property(obj, 'd', 5);
      expect(obj).toStrictEqual(
        {
          a: 1,
          b: 2,
          c: 3,
          d: 5,
        },
        'existing properties were not overridden, new properties added',
      );

      lib.property(obj, 'a', 2, true);
      lib.property(obj, 'b', 3, false);
      lib.property(obj, 'c', 4);
      expect(obj).toStrictEqual(
        {
          a: 2,
          b: 2,
          c: 3,
          d: 5,
        },
        'properties only overriden when predicate exists and returns true',
      );
    });

    ifHasSymbolsIt('symbols', function() {
      const sym = Symbol('foo');
      const obj = {};
      const aValue = {};
      const bValue = {};

      lib.property(obj, 'a', aValue);
      lib.property(obj, sym, bValue);

      expect(Object.keys(obj)).toStrictEqual([], 'object has no enumerable Object.keys');
      expect(Object.getOwnPropertyNames(obj)).toStrictEqual(['a'], 'object has non-enumerable "a" key');
      expect(Object.getOwnPropertySymbols(obj)).toStrictEqual([sym], 'object has non-enumerable symbol key');
      expect(obj.a).toBe(aValue, 'string keyed value is defined');
      expect(obj[sym]).toBe(bValue, 'symbol keyed value is defined');
    });
  });

  describe('defineProperties', function() {
    ifDescriptorsSupportedIt('with descriptor support', function() {
      const getDescriptor = function(value) {
        return {
          configurable: true,
          enumerable: false,
          value,
          writable: true,
        };
      };

      const obj = {
        a: 1,
        b: 2,
        c: 3,
      };
      expect(Object.keys(obj)).toStrictEqual(['a', 'b', 'c'], 'all literal-set keys start enumerable');
      lib.properties(obj, {
        b: 3,
        c: 4,
        d: 5,
      });
      expect(obj).toStrictEqual(
        {
          a: 1,
          b: 2,
          c: 3,
        },
        'existing properties were not overridden',
      );
      expect(Object.getOwnPropertyDescriptor(obj, 'd')).toStrictEqual(
        getDescriptor(5),
        'new property "d" was added and is not enumerable',
      );
      expect(['a', 'b', 'c']).toStrictEqual(Object.keys(obj), 'new keys are not enumerable');

      lib.properties(
        obj,
        {
          a: 2,
          b: 3,
          c: 4,
        },
        {
          a() {
            return true;
          },
          b() {
            return false;
          },
        },
      );
      expect(obj).toStrictEqual(
        {
          b: 2,
          c: 3,
        },
        'properties only overriden when predicate exists and returns true',
      );
      expect(Object.getOwnPropertyDescriptor(obj, 'd')).toStrictEqual(
        getDescriptor(5),
        'existing property "d" remained and is not enumerable',
      );
      expect(Object.getOwnPropertyDescriptor(obj, 'a')).toStrictEqual(
        getDescriptor(2),
        'existing property "a" was overridden and is not enumerable',
      );
      expect(['b', 'c']).toStrictEqual(Object.keys(obj), 'overridden keys are not enumerable');
    });

    ifNotDescSupportedIt('without descriptor support', function() {
      const obj = {
        a: 1,
        b: 2,
        c: 3,
      };
      lib.properties(obj, {
        b: 3,
        c: 4,
        d: 5,
      });
      expect(obj).toStrictEqual(
        {
          a: 1,
          b: 2,
          c: 3,
          d: 5,
        },
        'existing properties were not overridden, new properties were added',
      );

      lib.properties(
        obj,
        {
          a: 2,
          b: 3,
          c: 4,
        },
        {
          a() {
            return true;
          },
          b() {
            return false;
          },
        },
      );
      expect(obj).toStrictEqual(
        {
          a: 2,
          b: 2,
          c: 3,
          d: 5,
        },
        'properties only overriden when predicate exists and returns true',
      );
    });

    ifHasSymbolsIt('symbols', function() {
      const sym = Symbol('foo');
      const obj = {};
      const aValue = {};
      const bValue = {};
      const properties = {a: aValue};
      properties[sym] = bValue;

      lib.properties(obj, properties);

      expect(Object.keys(obj)).toStrictEqual([], 'object has no enumerable keys');
      expect(Object.getOwnPropertyNames(obj)).toStrictEqual(['a'], 'object has non-enumerable "a" key');
      expect(Object.getOwnPropertySymbols(obj)).toStrictEqual([sym], 'object has non-enumerable symbol key');
      expect(obj.a).toBe(aValue, 'string keyed value is defined');
      expect(obj[sym]).toBe(bValue, 'symbol keyed value is defined');
    });
  });
});
