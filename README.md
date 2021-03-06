<a
  href="https://travis-ci.org/Xotic750/define-properties-x"
  title="Travis status">
<img
  src="https://travis-ci.org/Xotic750/define-properties-x.svg?branch=master"
  alt="Travis status" height="18">
</a>
<a
  href="https://david-dm.org/Xotic750/define-properties-x"
  title="Dependency status">
<img src="https://david-dm.org/Xotic750/define-properties-x/status.svg"
  alt="Dependency status" height="18"/>
</a>
<a
  href="https://david-dm.org/Xotic750/define-properties-x?type=dev"
  title="devDependency status">
<img src="https://david-dm.org/Xotic750/define-properties-x/dev-status.svg"
  alt="devDependency status" height="18"/>
</a>
<a
  href="https://badge.fury.io/js/define-properties-x"
  title="npm version">
<img src="https://badge.fury.io/js/define-properties-x.svg"
  alt="npm version" height="18">
</a>
<a
  href="https://www.jsdelivr.com/package/npm/define-properties-x"
  title="jsDelivr hits">
<img src="https://data.jsdelivr.com/v1/package/npm/define-properties-x/badge?style=rounded"
  alt="jsDelivr hits" height="18">
</a>
<a
  href="https://bettercodehub.com/results/Xotic750/define-properties-x"
  title="bettercodehub score">
<img src="https://bettercodehub.com/edge/badge/Xotic750/define-properties-x?branch=master"
  alt="bettercodehub score" height="18">
</a>
<a
  href="https://coveralls.io/github/Xotic750/define-properties-x?branch=master"
  title="Coverage Status">
<img src="https://coveralls.io/repos/github/Xotic750/define-properties-x/badge.svg?branch=master"
  alt="Coverage Status" height="18">
</a>

<a name="module_define-properties-x"></a>

## define-properties-x

Define multiple non-enumerable properties at once.

**See**: [define-properties](https://www.npmjs.com/package/define-properties)

- [define-properties-x](#module_define-properties-x)
  - [`.properties(object, map, [predicates])`](#module_define-properties-x.properties)
  - [`.property(object, prop, value, [force])`](#module_define-properties-x.property)

<a name="module_define-properties-x.properties"></a>

### `define-properties-x.properties(object, map, [predicates])`

Define multiple non-enumerable properties at once.
Uses `Object.defineProperty` when available; falls back to standard
assignment in older engines. Existing properties are not overridden.
Accepts a map of property names to a predicate that, when true,
force-overrides.

**Kind**: static method of [<code>define-properties-x</code>](#module_define-properties-x)

| Param        | Type                | Description                                 |
| ------------ | ------------------- | ------------------------------------------- |
| object       | <code>Object</code> | The object on which to define the property. |
| map          | <code>Object</code> | The object of properties.                   |
| [predicates] | <code>Object</code> | The object of property predicates.          |

**Example**

```js
import * as define from 'define-properties-x';

define.properties(
  {
    a: 1,
    b: 2,
  },
  {
    a: function() {
      return false;
    },
    b: function() {
      return true;
    },
  },
);
```

<a name="module_define-properties-x.property"></a>

### `define-properties-x.property(object, prop, value, [force])`

Just like `properties` but for defining a single non-enumerable
property. Useful in environments that do not
support `Computed property names`. This can be done
with `properties`, but this method can read a little cleaner.

**Kind**: static method of [<code>define-properties-x</code>](#module_define-properties-x)

| Param   | Type                                       | Default            | Description                                 |
| ------- | ------------------------------------------ | ------------------ | ------------------------------------------- |
| object  | <code>Object</code>                        |                    | The object on which to define the property. |
| prop    | <code>string</code> \| <code>Symbol</code> |                    | The property name.                          |
| value   | <code>\*</code>                            |                    | The value of the property.                  |
| [force] | <code>boolean</code>                       | <code>false</code> | If `true` then set property regardless.     |

**Example**

```js
import * as define from 'define-properties-x';

const myString = 'something';
define.property(obj, Symbol.iterator, function() {}, true);
define.property(obj, myString, function() {}, true);
```
