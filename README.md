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

Based on the original work by Jordan Harband
[`define-properties`](https://www.npmjs.com/package/define-properties).

<h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
`es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
methods that can be faithfully emulated with a legacy JavaScript engine.

`es5-sham.js` monkey-patches other ES5 methods as closely as possible.
For these methods, as closely as possible to ES5 is not very close.
Many of these shams are intended only to allow code to be written to ES5
without causing run-time errors in older engines. In many cases,
this means that these shams cause many ES5 methods to silently fail.
Decide carefully whether this is what you want. Note: es5-sham.js requires
es5-shim.js to be able to work properly.

`json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.

`es6.shim.js` provides compatibility shims so that legacy JavaScript engines
behave as closely as possible to ECMAScript 6 (Harmony).

**Version**: 1.0.2  
**Author:** Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  

* [define-properties-x](#module_define-properties-x)
    * [`~supportsDescriptors`](#module_define-properties-x..supportsDescriptors) : <code>boolean</code>
    * [`~defineProperty(object, property, value, [force])`](#module_define-properties-x..defineProperty)
    * [`~defineProperties(object, map, [predicates])`](#module_define-properties-x..defineProperties)

<a name="module_define-properties-x..supportsDescriptors"></a>
### `define-properties-x~supportsDescriptors` : <code>boolean</code>
Boolean indicator as to whether the environments supports descriptors
or not.

**Kind**: inner property of <code>[define-properties-x](#module_define-properties-x)</code>  
**Example**  
```js
var lib = require('define-properties-x');
lib.supportsDescriptors; // true or false
```
<a name="module_define-properties-x..defineProperty"></a>
### `define-properties-x~defineProperty(object, property, value, [force])`
Just like `defineProperties` but for defining a single non-enumerable
property. Useful in environments that do not
support `Computed property names`. This can be done
with `defineProperties`, but this method can read a little cleaner.

**Kind**: inner method of <code>[define-properties-x](#module_define-properties-x)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| object | <code>Object</code> |  | The object on which to define the property. |
| property | <code>string</code> &#124; <code>Symbol</code> |  | The property name. |
| value | <code>\*</code> |  | The value of the property. |
| [force] | <code>boolean</code> | <code>false</code> | If `true` then set property regardless. |

**Example**  
```js
var lib = require('define-properties-x');
var myString = 'something';
lib.defineProperty(obj, Symbol.iterator, function () {}, true);
lib.defineProperty(obj, myString, function () {}, true);
```
<a name="module_define-properties-x..defineProperties"></a>
### `define-properties-x~defineProperties(object, map, [predicates])`
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
var lib = require('define-properties-x');
lib.defineProperties({
  a: 1,
  b: 2
}, {
  a: function () { return false; },
  b: function () { return true; }
});
```
