<a name="module_define-properties-x"></a>

## define-properties-x
<a href="https://travis-ci.org/Xotic750/define-properties-x"
title="Travis status">
<img
src="https://travis-ci.org/Xotic750/define-properties-x.svg?branch=master"
alt="Travis status" height="18">
</a>
<a href="https://david-dm.org/Xotic750/define-properties-x"
title="Dependency status">
<img src="https://david-dm.org/Xotic750/define-properties-x.svg"
alt="Dependency status" height="18"/>
</a>
<a
href="https://david-dm.org/Xotic750/define-properties-x#info=devDependencies"
title="devDependency status">
<img src="https://david-dm.org/Xotic750/define-properties-x/dev-status.svg"
alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/define-properties-x" title="npm version">
<img src="https://badge.fury.io/js/define-properties-x.svg"
alt="npm version" height="18">
</a>

Define multiple non-enumerable properties at once.

Requires ES3 or above.

**See**: [define-properties](https://www.npmjs.com/package/define-properties)  
**Version**: 1.2.1  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  

* [define-properties-x](#module_define-properties-x)
    * [`~supportsDescriptors`](#module_define-properties-x..supportsDescriptors) : <code>boolean</code>
    * [`~properties(object, map, [predicates])`](#module_define-properties-x..properties)
    * [`~property(object, prop, value, [force])`](#module_define-properties-x..property)

<a name="module_define-properties-x..supportsDescriptors"></a>

### `define-properties-x~supportsDescriptors` : <code>boolean</code>
Boolean indicator as to whether the environments supports descriptors
or not.

**Kind**: inner property of <code>[define-properties-x](#module_define-properties-x)</code>  
**Example**  
```js
var define = require('define-properties-x');
define.supportsDescriptors; // true or false
```
<a name="module_define-properties-x..properties"></a>

### `define-properties-x~properties(object, map, [predicates])`
Define multiple non-enumerable properties at once.
Uses `Object.defineProperty` when available; falls back to standard
assignment in older engines. Existing properties are not overridden.
Accepts a map of property names to a predicate that, when true,
force-overrides.

**Kind**: inner method of <code>[define-properties-x](#module_define-properties-x)</code>  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | The object on which to define the property. |
| map | <code>Object</code> | The object of properties. |
| [predicates] | <code>Object</code> | The object of property predicates. |

**Example**  
```js
var define = require('define-properties-x');
define.properties({
  a: 1,
  b: 2
}, {
  a: function () { return false; },
  b: function () { return true; }
});
```
<a name="module_define-properties-x..property"></a>

### `define-properties-x~property(object, prop, value, [force])`
Just like `properties` but for defining a single non-enumerable
property. Useful in environments that do not
support `Computed property names`. This can be done
with `properties`, but this method can read a little cleaner.

**Kind**: inner method of <code>[define-properties-x](#module_define-properties-x)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| object | <code>Object</code> |  | The object on which to define the property. |
| prop | <code>string</code> \| <code>Symbol</code> |  | The property name. |
| value | <code>\*</code> |  | The value of the property. |
| [force] | <code>boolean</code> | <code>false</code> | If `true` then set property regardless. |

**Example**  
```js
var define = require('define-properties-x');
var myString = 'something';
define.property(obj, Symbol.iterator, function () {}, true);
define.property(obj, myString, function () {}, true);
```
