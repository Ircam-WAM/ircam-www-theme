(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
module.exports = require('./lib/extend');


},{"./lib/extend":3}],3:[function(require,module,exports){
/*!
 * node.extend
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * @fileoverview
 * Port of jQuery.extend that actually works on node.js
 */
var is = require('is');

function extend() {
  var target = arguments[0] || {};
  var i = 1;
  var length = arguments.length;
  var deep = false;
  var options, name, src, copy, copy_is_array, clone;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !is.fn(target)) {
    target = {};
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    options = arguments[i]
    if (options != null) {
      if (typeof options === 'string') {
          options = options.split('');
      }
      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (is.hash(copy) || (copy_is_array = is.array(copy)))) {
          if (copy_is_array) {
            copy_is_array = false;
            clone = src && is.array(src) ? src : [];
          } else {
            clone = src && is.hash(src) ? src : {};
          }

          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy);

        // Don't bring in undefined values
        } else if (typeof copy !== 'undefined') {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

/**
 * @public
 */
extend.version = '1.1.3';

/**
 * Exports module.
 */
module.exports = extend;


},{"is":4}],4:[function(require,module,exports){
/* globals window, HTMLElement */
/**!
 * is
 * the definitive JavaScript type testing library
 *
 * @copyright 2013-2014 Enrico Marino / Jordan Harband
 * @license MIT
 */

var objProto = Object.prototype;
var owns = objProto.hasOwnProperty;
var toStr = objProto.toString;
var symbolValueOf;
if (typeof Symbol === 'function') {
  symbolValueOf = Symbol.prototype.valueOf;
}
var isActualNaN = function (value) {
  return value !== value;
};
var NON_HOST_TYPES = {
  'boolean': 1,
  number: 1,
  string: 1,
  undefined: 1
};

var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
var hexRegex = /^[A-Fa-f0-9]+$/;

/**
 * Expose `is`
 */

var is = module.exports = {};

/**
 * Test general.
 */

/**
 * is.type
 * Test if `value` is a type of `type`.
 *
 * @param {Mixed} value value to test
 * @param {String} type type
 * @return {Boolean} true if `value` is a type of `type`, false otherwise
 * @api public
 */

is.a = is.type = function (value, type) {
  return typeof value === type;
};

/**
 * is.defined
 * Test if `value` is defined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is defined, false otherwise
 * @api public
 */

is.defined = function (value) {
  return typeof value !== 'undefined';
};

/**
 * is.empty
 * Test if `value` is empty.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is empty, false otherwise
 * @api public
 */

is.empty = function (value) {
  var type = toStr.call(value);
  var key;

  if (type === '[object Array]' || type === '[object Arguments]' || type === '[object String]') {
    return value.length === 0;
  }

  if (type === '[object Object]') {
    for (key in value) {
      if (owns.call(value, key)) { return false; }
    }
    return true;
  }

  return !value;
};

/**
 * is.equal
 * Test if `value` is equal to `other`.
 *
 * @param {Mixed} value value to test
 * @param {Mixed} other value to compare with
 * @return {Boolean} true if `value` is equal to `other`, false otherwise
 */

is.equal = function equal(value, other) {
  if (value === other) {
    return true;
  }

  var type = toStr.call(value);
  var key;

  if (type !== toStr.call(other)) {
    return false;
  }

  if (type === '[object Object]') {
    for (key in value) {
      if (!is.equal(value[key], other[key]) || !(key in other)) {
        return false;
      }
    }
    for (key in other) {
      if (!is.equal(value[key], other[key]) || !(key in value)) {
        return false;
      }
    }
    return true;
  }

  if (type === '[object Array]') {
    key = value.length;
    if (key !== other.length) {
      return false;
    }
    while (--key) {
      if (!is.equal(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }

  if (type === '[object Function]') {
    return value.prototype === other.prototype;
  }

  if (type === '[object Date]') {
    return value.getTime() === other.getTime();
  }

  return false;
};

/**
 * is.hosted
 * Test if `value` is hosted by `host`.
 *
 * @param {Mixed} value to test
 * @param {Mixed} host host to test with
 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
 * @api public
 */

is.hosted = function (value, host) {
  var type = typeof host[value];
  return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
};

/**
 * is.instance
 * Test if `value` is an instance of `constructor`.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an instance of `constructor`
 * @api public
 */

is.instance = is['instanceof'] = function (value, constructor) {
  return value instanceof constructor;
};

/**
 * is.nil / is.null
 * Test if `value` is null.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is null, false otherwise
 * @api public
 */

is.nil = is['null'] = function (value) {
  return value === null;
};

/**
 * is.undef / is.undefined
 * Test if `value` is undefined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is undefined, false otherwise
 * @api public
 */

is.undef = is.undefined = function (value) {
  return typeof value === 'undefined';
};

/**
 * Test arguments.
 */

/**
 * is.args
 * Test if `value` is an arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.args = is.arguments = function (value) {
  var isStandardArguments = toStr.call(value) === '[object Arguments]';
  var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
  return isStandardArguments || isOldArguments;
};

/**
 * Test array.
 */

/**
 * is.array
 * Test if 'value' is an array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an array, false otherwise
 * @api public
 */

is.array = Array.isArray || function (value) {
  return toStr.call(value) === '[object Array]';
};

/**
 * is.arguments.empty
 * Test if `value` is an empty arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
 * @api public
 */
is.args.empty = function (value) {
  return is.args(value) && value.length === 0;
};

/**
 * is.array.empty
 * Test if `value` is an empty array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty array, false otherwise
 * @api public
 */
is.array.empty = function (value) {
  return is.array(value) && value.length === 0;
};

/**
 * is.arraylike
 * Test if `value` is an arraylike object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.arraylike = function (value) {
  return !!value && !is.bool(value)
    && owns.call(value, 'length')
    && isFinite(value.length)
    && is.number(value.length)
    && value.length >= 0;
};

/**
 * Test boolean.
 */

/**
 * is.bool
 * Test if `value` is a boolean.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a boolean, false otherwise
 * @api public
 */

is.bool = is['boolean'] = function (value) {
  return toStr.call(value) === '[object Boolean]';
};

/**
 * is.false
 * Test if `value` is false.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is false, false otherwise
 * @api public
 */

is['false'] = function (value) {
  return is.bool(value) && Boolean(Number(value)) === false;
};

/**
 * is.true
 * Test if `value` is true.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is true, false otherwise
 * @api public
 */

is['true'] = function (value) {
  return is.bool(value) && Boolean(Number(value)) === true;
};

/**
 * Test date.
 */

/**
 * is.date
 * Test if `value` is a date.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a date, false otherwise
 * @api public
 */

is.date = function (value) {
  return toStr.call(value) === '[object Date]';
};

/**
 * Test element.
 */

/**
 * is.element
 * Test if `value` is an html element.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an HTML Element, false otherwise
 * @api public
 */

is.element = function (value) {
  return value !== undefined
    && typeof HTMLElement !== 'undefined'
    && value instanceof HTMLElement
    && value.nodeType === 1;
};

/**
 * Test error.
 */

/**
 * is.error
 * Test if `value` is an error object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an error object, false otherwise
 * @api public
 */

is.error = function (value) {
  return toStr.call(value) === '[object Error]';
};

/**
 * Test function.
 */

/**
 * is.fn / is.function (deprecated)
 * Test if `value` is a function.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a function, false otherwise
 * @api public
 */

is.fn = is['function'] = function (value) {
  var isAlert = typeof window !== 'undefined' && value === window.alert;
  return isAlert || toStr.call(value) === '[object Function]';
};

/**
 * Test number.
 */

/**
 * is.number
 * Test if `value` is a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a number, false otherwise
 * @api public
 */

is.number = function (value) {
  return toStr.call(value) === '[object Number]';
};

/**
 * is.infinite
 * Test if `value` is positive or negative infinity.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
 * @api public
 */
is.infinite = function (value) {
  return value === Infinity || value === -Infinity;
};

/**
 * is.decimal
 * Test if `value` is a decimal number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a decimal number, false otherwise
 * @api public
 */

is.decimal = function (value) {
  return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
};

/**
 * is.divisibleBy
 * Test if `value` is divisible by `n`.
 *
 * @param {Number} value value to test
 * @param {Number} n dividend
 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
 * @api public
 */

is.divisibleBy = function (value, n) {
  var isDividendInfinite = is.infinite(value);
  var isDivisorInfinite = is.infinite(n);
  var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
  return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
};

/**
 * is.integer
 * Test if `value` is an integer.
 *
 * @param value to test
 * @return {Boolean} true if `value` is an integer, false otherwise
 * @api public
 */

is.integer = is['int'] = function (value) {
  return is.number(value) && !isActualNaN(value) && value % 1 === 0;
};

/**
 * is.maximum
 * Test if `value` is greater than 'others' values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is greater than `others` values
 * @api public
 */

is.maximum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value < others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.minimum
 * Test if `value` is less than `others` values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is less than `others` values
 * @api public
 */

is.minimum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value > others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.nan
 * Test if `value` is not a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is not a number, false otherwise
 * @api public
 */

is.nan = function (value) {
  return !is.number(value) || value !== value;
};

/**
 * is.even
 * Test if `value` is an even number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an even number, false otherwise
 * @api public
 */

is.even = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
};

/**
 * is.odd
 * Test if `value` is an odd number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an odd number, false otherwise
 * @api public
 */

is.odd = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
};

/**
 * is.ge
 * Test if `value` is greater than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.ge = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value >= other;
};

/**
 * is.gt
 * Test if `value` is greater than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.gt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value > other;
};

/**
 * is.le
 * Test if `value` is less than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if 'value' is less than or equal to 'other'
 * @api public
 */

is.le = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value <= other;
};

/**
 * is.lt
 * Test if `value` is less than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if `value` is less than `other`
 * @api public
 */

is.lt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value < other;
};

/**
 * is.within
 * Test if `value` is within `start` and `finish`.
 *
 * @param {Number} value value to test
 * @param {Number} start lower bound
 * @param {Number} finish upper bound
 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
 * @api public
 */
is.within = function (value, start, finish) {
  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
    throw new TypeError('all arguments must be numbers');
  }
  var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
  return isAnyInfinite || (value >= start && value <= finish);
};

/**
 * Test object.
 */

/**
 * is.object
 * Test if `value` is an object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an object, false otherwise
 * @api public
 */

is.object = function (value) {
  return toStr.call(value) === '[object Object]';
};

/**
 * is.hash
 * Test if `value` is a hash - a plain object literal.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a hash, false otherwise
 * @api public
 */

is.hash = function (value) {
  return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
};

/**
 * Test regexp.
 */

/**
 * is.regexp
 * Test if `value` is a regular expression.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a regexp, false otherwise
 * @api public
 */

is.regexp = function (value) {
  return toStr.call(value) === '[object RegExp]';
};

/**
 * Test string.
 */

/**
 * is.string
 * Test if `value` is a string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a string, false otherwise
 * @api public
 */

is.string = function (value) {
  return toStr.call(value) === '[object String]';
};

/**
 * Test base64 string.
 */

/**
 * is.base64
 * Test if `value` is a valid base64 encoded string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
 * @api public
 */

is.base64 = function (value) {
  return is.string(value) && (!value.length || base64Regex.test(value));
};

/**
 * Test base64 string.
 */

/**
 * is.hex
 * Test if `value` is a valid hex encoded string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
 * @api public
 */

is.hex = function (value) {
  return is.string(value) && (!value.length || hexRegex.test(value));
};

/**
 * is.symbol
 * Test if `value` is an ES6 Symbol
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a Symbol, false otherise
 * @api public
 */

is.symbol = function (value) {
  return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol';
};

},{}],5:[function(require,module,exports){
'use strict';

var keys = require('object-keys');

module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	if (typeof sym === 'string') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(Object(sym) instanceof Symbol)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; }
	if (keys(obj).length !== 0) { return false; }
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{"object-keys":12}],6:[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es6-shim
var keys = require('object-keys');
var bind = require('function-bind');
var canBeObject = function (obj) {
	return typeof obj !== 'undefined' && obj !== null;
};
var hasSymbols = require('./hasSymbols')();
var toObject = Object;
var push = bind.call(Function.call, Array.prototype.push);
var propIsEnumerable = bind.call(Function.call, Object.prototype.propertyIsEnumerable);

module.exports = function assign(target, source1) {
	if (!canBeObject(target)) { throw new TypeError('target must be an object'); }
	var objTarget = toObject(target);
	var s, source, i, props, syms, value, key;
	for (s = 1; s < arguments.length; ++s) {
		source = toObject(arguments[s]);
		props = keys(source);
		if (hasSymbols && Object.getOwnPropertySymbols) {
			syms = Object.getOwnPropertySymbols(source);
			for (i = 0; i < syms.length; ++i) {
				key = syms[i];
				if (propIsEnumerable(source, key)) {
					push(props, key);
				}
			}
		}
		for (i = 0; i < props.length; ++i) {
			key = props[i];
			value = source[key];
			if (propIsEnumerable(source, key)) {
				objTarget[key] = value;
			}
		}
	}
	return objTarget;
};

},{"./hasSymbols":5,"function-bind":11,"object-keys":12}],7:[function(require,module,exports){
'use strict';

var defineProperties = require('define-properties');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

defineProperties(implementation, {
	implementation: implementation,
	getPolyfill: getPolyfill,
	shim: shim
});

module.exports = implementation;

},{"./implementation":6,"./polyfill":14,"./shim":15,"define-properties":8}],8:[function(require,module,exports){
'use strict';

var keys = require('object-keys');
var foreach = require('foreach');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
        /* eslint-disable no-unused-vars, no-restricted-syntax */
        for (var _ in obj) { return false; }
        /* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

},{"foreach":9,"object-keys":12}],9:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],10:[function(require,module,exports){
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],11:[function(require,module,exports){
var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":10}],12:[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = require('./isArguments');
var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');
var hasProtoEnumBug = function () {}.propertyIsEnumerable('prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var blacklistedKeys = {
	$console: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$parent: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!blacklistedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":13}],13:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],14:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

var lacksProperEnumerationOrder = function () {
	if (!Object.assign) {
		return false;
	}
	// v8, specifically in node 4.x, has a bug with incorrect property enumeration order
	// note: this does not detect the bug unless there's 20 characters
	var str = 'abcdefghijklmnopqrst';
	var letters = str.split('');
	var map = {};
	for (var i = 0; i < letters.length; ++i) {
		map[letters[i]] = letters[i];
	}
	var obj = Object.assign({}, map);
	var actual = '';
	for (var k in obj) {
		actual += k;
	}
	return str !== actual;
};

var assignHasPendingExceptions = function () {
	if (!Object.assign || !Object.preventExtensions) {
		return false;
	}
	// Firefox 37 still has "pending exception" logic in its Object.assign implementation,
	// which is 72% slower than our shim, and Firefox 40's native implementation.
	var thrower = Object.preventExtensions({ 1: 2 });
	try {
		Object.assign(thrower, 'xy');
	} catch (e) {
		return thrower[1] === 'y';
	}
};

module.exports = function getPolyfill() {
	if (!Object.assign) {
		return implementation;
	}
	if (lacksProperEnumerationOrder()) {
		return implementation;
	}
	if (assignHasPendingExceptions()) {
		return implementation;
	}
	return Object.assign;
};

},{"./implementation":6}],15:[function(require,module,exports){
'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimAssign() {
	var polyfill = getPolyfill();
	define(
		Object,
		{ assign: polyfill },
		{ assign: function () { return Object.assign !== polyfill; } }
	);
	return polyfill;
};

},{"./polyfill":14,"define-properties":8}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

/**
 * Validates a number of seconds to use as the auto-advance delay.
 *
 * @private
 * @param   {Number} s
 * @return  {Boolean}
 */
var validSeconds = function validSeconds(s) {
  return typeof s === 'number' && !isNaN(s) && s >= 0 && s < Infinity;
};

/**
 * Resets the auto-advance behavior of a player.
 *
 * @param {Player} player
 */
var reset = function reset(player) {
  if (player.playlist.autoadvance_.timeout) {
    _globalWindow2['default'].clearTimeout(player.playlist.autoadvance_.timeout);
  }

  if (player.playlist.autoadvance_.trigger) {
    player.off('ended', player.playlist.autoadvance_.trigger);
  }

  player.playlist.autoadvance_.timeout = null;
  player.playlist.autoadvance_.trigger = null;
};

/**
 * Sets up auto-advance behavior on a player.
 *
 * @param  {Player} player
 * @param  {Number} delay
 *         The number of seconds to wait before each auto-advance.
 */
var setup = function setup(player, delay) {
  reset(player);

  // Before queuing up new auto-advance behavior, check if `seconds` was
  // called with a valid value.
  if (!validSeconds(delay)) {
    return;
  }

  player.playlist.autoadvance_.trigger = function () {
    player.playlist.autoadvance_.timeout = _globalWindow2['default'].setTimeout(function () {
      reset(player);
      player.playlist.next();
    }, delay * 1000);
  };

  player.one('ended', player.playlist.autoadvance_.trigger);
};

exports.reset = reset;
exports.setup = setup;

},{"global/window":1}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var _autoAdvanceJs = require('./auto-advance.js');

/**
 * Removes all remote text tracks from a player.
 *
 * @param  {Player} player
 */
var clearTracks = function clearTracks(player) {
  var tracks = player.remoteTextTracks();
  var i = tracks && tracks.length || 0;

  // This uses a `while` loop rather than `forEach` because the
  // `TextTrackList` object is a live DOM list (not an array).
  while (i--) {
    player.removeRemoteTextTrack(tracks[i]);
  }
};

/**
 * Plays an item on a player's playlist.
 *
 * @param  {Player} player
 * @param  {Number} delay
 *         The number of seconds to wait before each auto-advance.
 *
 * @param  {Object} item
 *         A source from the playlist.
 *
 * @return {Player}
 */
var playItem = function playItem(player, delay, item) {
  var Cue = _globalWindow2['default'].VTTCue || _globalWindow2['default'].TextTrackCue;
  var replay = !player.paused() || player.ended();

  player.poster(item.poster || '');
  player.src(item.sources);

  clearTracks(player);

  if (item.cuePoints && item.cuePoints.length) {
    (function () {
      var trackEl = player.addRemoteTextTrack({ kind: 'metadata' });

      item.cuePoints.forEach(function (cue) {
        var vttCue = new Cue(cue.startTime || cue.time || 0, cue.endTime || cue.time || 0, cue.type);

        trackEl.track.addCue(vttCue);
      });
    })();
  }

  (item.textTracks || []).forEach(player.addRemoteTextTrack.bind(player));

  if (replay) {
    player.play();
  }

  (0, _autoAdvanceJs.setup)(player, delay);

  return player;
};

exports['default'] = playItem;
exports.clearTracks = clearTracks;

},{"./auto-advance.js":16,"global/window":1}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var _objectAssign = require('object.assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _playItem = require('./play-item');

var _playItem2 = _interopRequireDefault(_playItem);

var _autoAdvance = require('./auto-advance');

var _autoadvance = _interopRequireWildcard(_autoAdvance);

/**
 * Given two sources, check to see whether the two sources are equal.
 * If both source urls have a protocol, the protocols must match, otherwise, protocols
 * are ignored.
 *
 * @private
 * @param {String|Object} source1
 * @param {String|Object} source2
 * @return {Boolean}
 */
var sourceEquals = function sourceEquals(source1, source2) {
  var src1 = source1;
  var src2 = source2;

  if (typeof source1 === 'object') {
    src1 = source1.src;
  }
  if (typeof source2 === 'object') {
    src2 = source2.src;
  }

  if (/^\/\//.test(src1)) {
    src2 = src2.slice(src2.indexOf('//'));
  }
  if (/^\/\//.test(src2)) {
    src1 = src1.slice(src1.indexOf('//'));
  }

  return src1 === src2;
};

/**
 * Look through an array of playlist items for a specific `source`;
 * checking both the value of elements and the value of their `src`
 * property.
 *
 * @private
 * @param   {Array} arr
 * @param   {String} src
 * @return  {Number}
 */
var indexInSources = function indexInSources(arr, src) {
  for (var i = 0; i < arr.length; i++) {
    var sources = arr[i].sources;

    if (Array.isArray(sources)) {
      for (var j = 0; j < sources.length; j++) {
        var source = sources[j];

        if (source && sourceEquals(source, src)) {
          return i;
        }
      }
    }
  }

  return -1;
};

/**
 * Factory function for creating new playlist implementation on the given player.
 *
 * API summary:
 *
 * playlist(['a', 'b', 'c']) // setter
 * playlist() // getter
 * playlist.currentItem() // getter, 0
 * playlist.currentItem(1) // setter, 1
 * playlist.next() // 'c'
 * playlist.previous() // 'b'
 * playlist.first() // 'a'
 * playlist.last() // 'c'
 * playlist.autoadvance(5) // 5 second delay
 * playlist.autoadvance() // cancel autoadvance
 *
 * @param  {Player} player
 * @param  {Array}  [initialList]
 *         If given, an initial list of sources with which to populate
 *         the playlist.
 * @param  {Number}  [initialIndex]
 *         If given, the index of the item in the list that should
 *         be loaded first. If -1, no video is loaded. If omitted, The
 *         the first video is loaded.
 *
 * @return {Function}
 *         Returns the playlist function specific to the given player.
 */
var factory = function factory(player, initialList) {
  var initialIndex = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var list = Array.isArray(initialList) ? initialList.slice() : [];

  /**
   * Get/set the playlist for a player.
   *
   * This function is added as an own property of the player and has its
   * own methods which can be called to manipulate the internal state.
   *
   * @param  {Array} [newList]
   *         If given, a new list of sources with which to populate the
   *         playlist. Without this, the function acts as a getter.
   * @param  {Number}  [newIndex]
   *         If given, the index of the item in the list that should
   *         be loaded first. If -1, no video is loaded. If omitted, The
   *         the first video is loaded.
   *
   * @return {Array}
   */
  var playlist = player.playlist = function (newList) {
    var newIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    if (Array.isArray(newList)) {
      list = newList.slice();
      if (newIndex !== -1) {
        playlist.currentItem(newIndex);
      }
      playlist.changeTimeout_ = _globalWindow2['default'].setTimeout(function () {
        player.trigger('playlistchange');
      }, 0);
    }

    // Always return a shallow clone of the playlist list.
    return list.slice();
  };

  player.on('loadstart', function () {
    if (playlist.currentItem() === -1) {
      _autoadvance.reset(player);
    }
  });

  player.on('dispose', function () {
    _globalWindow2['default'].clearTimeout(playlist.changeTimeout_);
  });

  (0, _objectAssign2['default'])(playlist, {
    currentIndex_: -1,
    player_: player,
    autoadvance_: {},

    /**
     * Get or set the current item in the playlist.
     *
     * @param  {Number} [index]
     *         If given as a valid value, plays the playlist item at that index.
     *
     * @return {Number}
     *         The current item index.
     */
    currentItem: function currentItem(index) {
      if (typeof index === 'number' && playlist.currentIndex_ !== index && index >= 0 && index < list.length) {
        playlist.currentIndex_ = index;
        (0, _playItem2['default'])(playlist.player_, playlist.autoadvance_.delay, list[playlist.currentIndex_]);
      } else {
        playlist.currentIndex_ = playlist.indexOf(playlist.player_.currentSrc() || '');
      }

      return playlist.currentIndex_;
    },

    /**
     * Checks if the playlist contains a value.
     *
     * @param  {String|Object|Array} value
     * @return {Boolean}
     */
    contains: function contains(value) {
      return playlist.indexOf(value) !== -1;
    },

    /**
     * Gets the index of a value in the playlist or -1 if not found.
     *
     * @param  {String|Object|Array} value
     * @return {Number}
     */
    indexOf: function indexOf(value) {
      if (typeof value === 'string') {
        return indexInSources(list, value);
      }

      var sources = Array.isArray(value) ? value : value.sources;

      for (var i = 0; i < sources.length; i++) {
        var source = sources[i];

        if (typeof source === 'string') {
          return indexInSources(list, source);
        } else if (source.src) {
          return indexInSources(list, source.src);
        }
      }

      return -1;
    },

    /**
     * Plays the first item in the playlist.
     *
     * @return {Object|undefined}
     *         Returns undefined and has no side effects if the list is empty.
     */
    first: function first() {
      if (list.length) {
        return list[playlist.currentItem(0)];
      }

      playlist.currentIndex_ = -1;
    },

    /**
     * Plays the last item in the playlist.
     *
     * @return {Object|undefined}
     *         Returns undefined and has no side effects if the list is empty.
     */
    last: function last() {
      if (list.length) {
        return list[playlist.currentItem(list.length - 1)];
      }

      playlist.currentIndex_ = -1;
    },

    /**
     * Plays the next item in the playlist.
     *
     * @return {Object|undefined}
     *         Returns undefined and has no side effects if on last item.
     */
    next: function next() {

      // Make sure we don't go past the end of the playlist.
      var index = Math.min(playlist.currentIndex_ + 1, list.length - 1);

      if (index !== playlist.currentIndex_) {
        return list[playlist.currentItem(index)];
      }
    },

    /**
     * Plays the previous item in the playlist.
     *
     * @return {Object|undefined}
     *         Returns undefined and has no side effects if on first item.
     */
    previous: function previous() {

      // Make sure we don't go past the start of the playlist.
      var index = Math.max(playlist.currentIndex_ - 1, 0);

      if (index !== playlist.currentIndex_) {
        return list[playlist.currentItem(index)];
      }
    },

    /**
     * Sets up auto-advance on the playlist.
     *
     * @param {Number} delay
     *        The number of seconds to wait before each auto-advance.
     */
    autoadvance: function autoadvance(delay) {
      playlist.autoadvance_.delay = delay;
      _autoadvance.setup(playlist.player_, delay);
    }
  });

  playlist.currentItem(initialIndex);

  return playlist;
};

exports['default'] = factory;
module.exports = exports['default'];

},{"./auto-advance":16,"./play-item":17,"global/window":1,"object.assign":7}],19:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var _playlistMaker = require('./playlist-maker');

var _playlistMaker2 = _interopRequireDefault(_playlistMaker);

/**
 * The video.js playlist plugin. Invokes the playlist-maker to create a
 * playlist function on the specific player.
 *
 * @param {Array} list
 */
var plugin = function plugin(list, item) {
  (0, _playlistMaker2['default'])(this, list, item);
};

_videoJs2['default'].plugin('playlist', plugin);

exports['default'] = plugin;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./playlist-maker":18}],20:[function(require,module,exports){
(function (global){
'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var _qunit = (typeof window !== "undefined" ? window['QUnit'] : typeof global !== "undefined" ? global['QUnit'] : null);

var _qunit2 = _interopRequireDefault(_qunit);

var _srcAutoAdvanceJs = require('../src/auto-advance.js');

var autoadvance = _interopRequireWildcard(_srcAutoAdvanceJs);

var _playerProxyMakerJs = require('./player-proxy-maker.js');

var _playerProxyMakerJs2 = _interopRequireDefault(_playerProxyMakerJs);

_qunit2['default'].module('auto-advance');

_qunit2['default'].test('set up ended listener if one does not exist yet', function (assert) {
  var player = (0, _playerProxyMakerJs2['default'])();
  var ones = [];

  player.one = function (type) {
    ones.push(type);
  };

  autoadvance.setup(player, 0);

  assert.equal(ones.length, 1, 'there should have been only one one event added');
  assert.equal(ones[0], 'ended', 'the event we want to one is "ended"');
});

_qunit2['default'].test('off previous listener if exists before adding a new one', function (assert) {
  var player = (0, _playerProxyMakerJs2['default'])();
  var ones = [];
  var offs = [];

  player.one = function (type) {
    ones.push(type);
  };

  player.off = function (type) {
    offs.push(type);
  };

  autoadvance.setup(player, 0);
  assert.equal(ones.length, 1, 'there should have been only one one event added');
  assert.equal(ones[0], 'ended', 'the event we want to one is "ended"');
  assert.equal(offs.length, 0, 'we should not have off-ed anything yet');

  autoadvance.setup(player, 10);

  assert.equal(ones.length, 2, 'there should have been only two one event added');
  assert.equal(ones[0], 'ended', 'the event we want to one is "ended"');
  assert.equal(ones[1], 'ended', 'the event we want to one is "ended"');
  assert.equal(offs.length, 1, 'there should have been only one off event added');
  assert.equal(offs[0], 'ended', 'the event we want to off is "ended"');
});

_qunit2['default'].test('do nothing if timeout is weird', function (assert) {
  var player = (0, _playerProxyMakerJs2['default'])();

  var ones = [];
  var offs = [];

  player.one = function (type) {
    ones.push(type);
  };

  player.off = function (type) {
    offs.push(type);
  };

  autoadvance.setup(player, -1);
  autoadvance.setup(player, -100);
  autoadvance.setup(player, null);
  autoadvance.setup(player, {});
  autoadvance.setup(player, []);

  assert.equal(offs.length, 0, 'we did nothing');
  assert.equal(ones.length, 0, 'we did nothing');
});

_qunit2['default'].test('reset if timeout is weird after we advance', function (assert) {
  var player = (0, _playerProxyMakerJs2['default'])();

  var ones = [];
  var offs = [];

  player.one = function (type) {
    ones.push(type);
  };

  player.off = function (type) {
    offs.push(type);
  };

  autoadvance.setup(player, 0);
  autoadvance.setup(player, -1);
  autoadvance.setup(player, 0);
  autoadvance.setup(player, -100);
  autoadvance.setup(player, 0);
  autoadvance.setup(player, null);
  autoadvance.setup(player, 0);
  autoadvance.setup(player, {});
  autoadvance.setup(player, 0);
  autoadvance.setup(player, []);
  autoadvance.setup(player, 0);
  autoadvance.setup(player, NaN);
  autoadvance.setup(player, 0);
  autoadvance.setup(player, Infinity);
  autoadvance.setup(player, 0);
  autoadvance.setup(player, -Infinity);

  assert.equal(offs.length, 8, 'we reset the advance 8 times');
  assert.equal(ones.length, 8, 'we autoadvanced 8 times');
});

_qunit2['default'].test('reset if we have already started advancing', function (assert) {
  var player = (0, _playerProxyMakerJs2['default'])();
  var oldClearTimeout = _globalWindow2['default'].clearTimeout;
  var clears = 0;

  _globalWindow2['default'].clearTimeout = function () {
    clears++;
  };

  // pretend we started autoadvancing
  player.playlist.autoadvance_.timeout = 1;
  autoadvance.setup(player, 0);

  assert.equal(clears, 1, 'we reset the auto advance');

  _globalWindow2['default'].clearTimeout = oldClearTimeout;
});

_qunit2['default'].test('timeout is given in seconds', function (assert) {
  var player = (0, _playerProxyMakerJs2['default'])();
  var oldSetTimeout = _globalWindow2['default'].setTimeout;

  player.addEventListener = Function.prototype;

  _globalWindow2['default'].setTimeout = function (fn, timeout) {
    assert.equal(timeout, 10 * 1000, 'timeout was given in seconds');
  };

  autoadvance.setup(player, 10);
  player.trigger('ended');

  _globalWindow2['default'].setTimeout = oldSetTimeout;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/auto-advance.js":16,"./player-proxy-maker.js":22,"global/window":1}],21:[function(require,module,exports){
(function (global){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _qunit = (typeof window !== "undefined" ? window['QUnit'] : typeof global !== "undefined" ? global['QUnit'] : null);

var _qunit2 = _interopRequireDefault(_qunit);

var _srcPlayItem = require('../src/play-item');

var _srcPlayItem2 = _interopRequireDefault(_srcPlayItem);

var _playerProxyMaker = require('./player-proxy-maker');

var _playerProxyMaker2 = _interopRequireDefault(_playerProxyMaker);

_qunit2['default'].module('play-item');

_qunit2['default'].test('clearTracks will try and remove all tracks', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var remoteTracks = [1, 2, 3];
  var removedTracks = [];

  player.remoteTextTracks = function () {
    return remoteTracks;
  };

  player.removeRemoteTextTrack = function (tt) {
    removedTracks.push(tt);
  };

  (0, _srcPlayItem.clearTracks)(player);

  assert.deepEqual(removedTracks.sort(), remoteTracks.sort(), 'the removed tracks are equivalent to our remote tracks');
});

_qunit2['default'].test('playItem() works as expected for setting sources, poster, tracks and cue points', function (assert) {
  var oldVttCue = window.VTTCue;
  var player = (0, _playerProxyMaker2['default'])();
  var setSrc = undefined;
  var setPoster = undefined;
  var setTracks = [];
  var cues = [];

  window.VTTCue = function (startTime, endTime, type) {
    return { startTime: startTime, endTime: endTime, type: type };
  };

  player.src = function (src) {
    setSrc = src;
  };

  player.poster = function (poster) {
    setPoster = poster;
  };

  player.addRemoteTextTrack = function (tt) {
    setTracks.push(tt);
    return {
      track: {
        addCue: function addCue(cue) {
          cues.push(cue);
        }
      }
    };
  };

  (0, _srcPlayItem2['default'])(player, null, {
    sources: [1, 2, 3],
    textTracks: [4, 5, 6],
    poster: 'http://example.com/poster.png',
    cuePoints: [{ startTime: 0, endTime: 0.01667, type: 'foo' }, { startTime: 1, endTime: 1.01667, type: 'bar' }]
  });

  assert.deepEqual(setSrc, [1, 2, 3], 'sources are what we expected');
  assert.deepEqual(setTracks.sort(), [4, 5, 6, { kind: 'metadata' }].sort(), 'tracks are what we expected');

  assert.equal(setPoster, 'http://example.com/poster.png', 'poster is what we expected');

  assert.deepEqual(cues, [{ startTime: 0, endTime: 0.01667, type: 'foo' }, { startTime: 1, endTime: 1.01667, type: 'bar' }], 'cues are what we expected');
  window.VTTCue = oldVttCue;
});

_qunit2['default'].test('Backwards compatibility test for old cue points property using just time', function (assert) {
  var oldVttCue = window.VTTCue;
  var player = (0, _playerProxyMaker2['default'])();
  var setTracks = [];
  var cues = [];

  window.VTTCue = function (startTime, endTime, type) {
    return { startTime: startTime, endTime: endTime, type: type };
  };

  player.addRemoteTextTrack = function (tt) {
    setTracks.push(tt);
    return {
      track: {
        addCue: function addCue(cue) {
          cues.push(cue);
        }
      }
    };
  };

  (0, _srcPlayItem2['default'])(player, null, {
    cuePoints: [{ time: 0, type: 'foo' }, { time: 1, type: 'bar' }]
  });

  assert.deepEqual(cues, [{ startTime: 0, endTime: 0, type: 'foo' }, { startTime: 1, endTime: 1, type: 'bar' }], 'cues are what we expected');

  window.VTTCue = oldVttCue;
});

_qunit2['default'].test('ensure we are using startTime/endTime rather than time if possible', function (assert) {
  var oldVttCue = window.VTTCue;
  var player = (0, _playerProxyMaker2['default'])();
  var setTracks = [];
  var cues = [];

  window.VTTCue = function (startTime, endTime, type) {
    return { startTime: startTime, endTime: endTime, type: type };
  };

  player.addRemoteTextTrack = function (tt) {
    setTracks.push(tt);
    return {
      track: {
        addCue: function addCue(cue) {
          cues.push(cue);
        }
      }
    };
  };

  (0, _srcPlayItem2['default'])(player, null, {
    cuePoints: [{ time: 0, endTime: 0.0166, startTime: 0.0111, type: 'foo' }, { time: 1, endTime: 1.0166, startTime: 1.0111, type: 'bar' }]
  });

  assert.deepEqual(cues, [{ endTime: 0.0166, startTime: 0.0111, type: 'foo' }, { endTime: 1.0166, startTime: 1.0111, type: 'bar' }], 'We are not choosing the property endTime correctly');

  window.VTTCue = oldVttCue;
});

_qunit2['default'].test('will not try to play if paused', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var tryPlay = false;

  player.paused = function () {
    return true;
  };

  player.play = function () {
    tryPlay = true;
  };

  (0, _srcPlayItem2['default'])(player, null, {
    sources: [1, 2, 3],
    textTracks: [4, 5, 6],
    poster: 'http://example.com/poster.png'
  });

  assert.ok(!tryPlay, 'we did not reply on paused');
});

_qunit2['default'].test('will try to play if not paused', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var tryPlay = false;

  player.paused = function () {
    return false;
  };

  player.play = function () {
    tryPlay = true;
  };

  (0, _srcPlayItem2['default'])(player, null, {
    sources: [1, 2, 3],
    textTracks: [4, 5, 6],
    poster: 'http://example.com/poster.png'
  });

  assert.ok(tryPlay, 'we replayed on not-paused');
});

_qunit2['default'].test('will not try to play if paused and not ended', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var tryPlay = false;

  player.paused = function () {
    return true;
  };

  player.ended = function () {
    return false;
  };

  player.play = function () {
    tryPlay = true;
  };

  (0, _srcPlayItem2['default'])(player, null, {
    sources: [1, 2, 3],
    textTracks: [4, 5, 6],
    poster: 'http://example.com/poster.png'
  });

  assert.ok(!tryPlay, 'we did not replaye on paused and not ended');
});

_qunit2['default'].test('will try to play if paused and ended', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var tryPlay = false;

  player.paused = function () {
    return true;
  };

  player.ended = function () {
    return true;
  };

  player.play = function () {
    tryPlay = true;
  };

  (0, _srcPlayItem2['default'])(player, null, {
    sources: [1, 2, 3],
    textTracks: [4, 5, 6],
    poster: 'http://example.com/poster.png'
  });

  assert.ok(tryPlay, 'we replayed on not-paused');
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/play-item":17,"./player-proxy-maker":22}],22:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _nodeExtend = require('node.extend');

var _nodeExtend2 = _interopRequireDefault(_nodeExtend);

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var proxy = function proxy(props) {
  var player = (0, _nodeExtend2['default'])(true, {}, _videoJs2['default'].EventTarget.prototype, {
    play: Function.prototype,
    paused: Function.prototype,
    ended: Function.prototype,
    poster: Function.prototype,
    src: Function.prototype,
    addRemoteTextTrack: Function.prototype,
    removeRemoteTextTrack: Function.prototype,
    remoteTextTracks: Function.prototype,
    currentSrc: Function.prototype,
    playlist: {
      autoadvance_: {},
      currentIndex_: -1,
      autoadvance: Function.prototype,
      contains: Function.prototype,
      currentItem: Function.prototype,
      first: Function.prototype,
      indexOf: Function.prototype,
      next: Function.prototype,
      previous: Function.prototype
    }
  }, props);

  player.constructor = _videoJs2['default'].getComponent('Player');
  player.playlist.player_ = player;

  return player;
};

exports['default'] = proxy;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"node.extend":2}],23:[function(require,module,exports){
(function (global){
'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var _qunit = (typeof window !== "undefined" ? window['QUnit'] : typeof global !== "undefined" ? global['QUnit'] : null);

var _qunit2 = _interopRequireDefault(_qunit);

var _srcPlaylistMaker = require('../src/playlist-maker');

var _srcPlaylistMaker2 = _interopRequireDefault(_srcPlaylistMaker);

var _srcAutoAdvance = require('../src/auto-advance');

var autoadvance = _interopRequireWildcard(_srcAutoAdvance);

var _playerProxyMaker = require('./player-proxy-maker');

var _playerProxyMaker2 = _interopRequireDefault(_playerProxyMaker);

var videoList = [{
  sources: [{
    src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
    type: 'video/mp4'
  }],
  poster: 'http://media.w3.org/2010/05/sintel/poster.png'
}, {
  sources: [{
    src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
    type: 'video/mp4'
  }],
  poster: 'http://media.w3.org/2010/05/bunny/poster.png'
}, {
  sources: [{
    src: 'http://vjs.zencdn.net/v/oceans.mp4',
    type: 'video/mp4'
  }],
  poster: 'http://www.videojs.com/img/poster.jpg'
}, {
  sources: [{
    src: 'http://media.w3.org/2010/05/bunny/movie.mp4',
    type: 'video/mp4'
  }],
  poster: 'http://media.w3.org/2010/05/bunny/poster.png'
}, {
  sources: [{
    src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
    type: 'video/mp4'
  }],
  poster: 'http://media.w3.org/2010/05/video/poster.png'
}];

_qunit2['default'].module('playlist', {

  beforeEach: function beforeEach() {
    this.oldTimeout = _globalWindow2['default'].setTimeout;
    _globalWindow2['default'].setTimeout = Function.prototype;
  },

  afterEach: function afterEach() {
    _globalWindow2['default'].setTimeout = this.oldTimeout;
  }
});

_qunit2['default'].test('playlistMaker takes a player and a list and returns a playlist', function (assert) {
  var playlist = (0, _srcPlaylistMaker2['default'])((0, _playerProxyMaker2['default'])(), []);

  assert.equal(typeof playlist, 'function', 'playlist is a function');
  assert.equal(typeof playlist.autoadvance, 'function', 'we have a autoadvance function');

  assert.equal(typeof playlist.currentItem, 'function', 'we have a currentItem function');

  assert.equal(typeof playlist.first, 'function', 'we have a first function');
  assert.equal(typeof playlist.indexOf, 'function', 'we have a indexOf function');
  assert.equal(typeof playlist.next, 'function', 'we have a next function');
  assert.equal(typeof playlist.previous, 'function', 'we have a previous function');
});

_qunit2['default'].test('playlistMaker can either take nothing or an Array as its first argument', function (assert) {
  var playlist1 = (0, _srcPlaylistMaker2['default'])((0, _playerProxyMaker2['default'])());
  var playlist2 = (0, _srcPlaylistMaker2['default'])((0, _playerProxyMaker2['default'])(), 'foo');
  var playlist3 = (0, _srcPlaylistMaker2['default'])((0, _playerProxyMaker2['default'])(), { foo: [1, 2, 3] });

  assert.deepEqual(playlist1(), [], 'if given no initial array, default to an empty array');

  assert.deepEqual(playlist2(), [], 'if given no initial array, default to an empty array');

  assert.deepEqual(playlist3(), [], 'if given no initial array, default to an empty array');
});

_qunit2['default'].test('playlist() is a getter and setter for the list', function (assert) {
  var playlist = (0, _srcPlaylistMaker2['default'])((0, _playerProxyMaker2['default'])(), [1, 2, 3]);

  assert.deepEqual(playlist(), [1, 2, 3], 'equal to input list');

  assert.deepEqual(playlist([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5], 'equal to input list, arguments ignored');

  assert.deepEqual(playlist(), [1, 2, 3, 4, 5], 'equal to input list');

  var list = playlist();

  list.unshift(10);

  assert.deepEqual(playlist(), [1, 2, 3, 4, 5], 'changing the list did not affect the playlist');

  assert.notDeepEqual(playlist(), [10, 1, 2, 3, 4, 5], 'changing the list did not affect the playlist');
});

_qunit2['default'].test('playlist() should only accept an Array as a new playlist', function (assert) {
  var playlist = (0, _srcPlaylistMaker2['default'])((0, _playerProxyMaker2['default'])(), [1, 2, 3]);

  assert.deepEqual(playlist('foo'), [1, 2, 3], 'when given "foo", it should be treated as a getter');

  assert.deepEqual(playlist({ foo: [1, 2, 3] }), [1, 2, 3], 'when given {foo: [1,2,3]}, it should be treated as a getter');
});

_qunit2['default'].test('playlist.currentItem() works as expected', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var playlist = (0, _srcPlaylistMaker2['default'])(player, videoList);
  var src = undefined;

  player.src = function (s) {
    if (s) {
      if (typeof s === 'string') {
        src = s;
      } else if (Array.isArray(s)) {
        return player.src(s[0]);
      } else {
        return player.src(s.src);
      }
    }
  };

  player.currentSrc = function () {
    return src;
  };

  src = videoList[0].sources[0].src;

  assert.equal(playlist.currentItem(), 0, 'begin at the first item, item 0');

  assert.equal(playlist.currentItem(2), 2, 'setting to item 2 gives us back the new item index');

  assert.equal(playlist.currentItem(), 2, 'the current item is now 2');
  assert.equal(playlist.currentItem(5), 2, 'cannot change to an out-of-bounds item');
  assert.equal(playlist.currentItem(-1), 2, 'cannot change to an out-of-bounds item');
  assert.equal(playlist.currentItem(null), 2, 'cannot change to an invalid item');
  assert.equal(playlist.currentItem(NaN), 2, 'cannot change to an invalid item');
  assert.equal(playlist.currentItem(Infinity), 2, 'cannot change to an invalid item');
  assert.equal(playlist.currentItem(-Infinity), 2, 'cannot change to an invalid item');
});

_qunit2['default'].test('playlist.currentItem() returns -1 with an empty playlist', function (assert) {
  var playlist = (0, _srcPlaylistMaker2['default'])((0, _playerProxyMaker2['default'])(), []);

  assert.equal(playlist.currentItem(), -1, 'we should get a -1 with an empty playlist');
});

_qunit2['default'].test('playlist.currentItem() does not change items if same index is given', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var sources = 0;
  var playlist = undefined;
  var src = undefined;

  player.src = function (s) {
    if (s) {
      if (typeof s === 'string') {
        src = s;
      } else if (Array.isArray(s)) {
        return player.src(s[0]);
      } else {
        return player.src(s.src);
      }
    }

    sources++;
  };

  player.currentSrc = function () {
    return src;
  };

  playlist = (0, _srcPlaylistMaker2['default'])(player, videoList);

  assert.equal(sources, 1, 'we switched to the first playlist item');
  sources = 0;

  assert.equal(playlist.currentItem(), 0, 'we start at index 0');

  playlist.currentItem(0);
  assert.equal(sources, 0, 'we did not try to set sources');

  playlist.currentItem(1);
  assert.equal(sources, 1, 'we did try to set sources');

  playlist.currentItem(1);
  assert.equal(sources, 1, 'we did not try to set sources');
});

_qunit2['default'].test('playlistMaker accepts a starting index', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var src = undefined;

  player.src = function (s) {
    if (s) {
      if (typeof s === 'string') {
        src = s;
      } else if (Array.isArray(s)) {
        return player.src(s[0]);
      } else {
        return player.src(s.src);
      }
    }
  };

  player.currentSrc = function () {
    return src;
  };

  var playlist = (0, _srcPlaylistMaker2['default'])(player, videoList, 1);

  assert.equal(playlist.currentItem(), 1, 'if given an initial index, load that video');
});

_qunit2['default'].test('playlistMaker accepts a starting index', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var src = undefined;

  player.src = function (s) {
    if (s) {
      if (typeof s === 'string') {
        src = s;
      } else if (Array.isArray(s)) {
        return player.src(s[0]);
      } else {
        return player.src(s.src);
      }
    }
  };

  player.currentSrc = function () {
    return src;
  };

  var playlist = (0, _srcPlaylistMaker2['default'])(player, videoList, -1);

  assert.equal(playlist.currentItem(), -1, 'if given -1 as initial index, load no video');
});

_qunit2['default'].test('playlist.contains() works as expected', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var playlist = (0, _srcPlaylistMaker2['default'])(player, videoList);

  player.playlist = playlist;

  assert.ok(playlist.contains('http://media.w3.org/2010/05/sintel/trailer.mp4'), 'we can ask whether it contains a source string');

  assert.ok(playlist.contains(['http://media.w3.org/2010/05/sintel/trailer.mp4']), 'we can ask whether it contains a sources list of strings');

  assert.ok(playlist.contains([{
    src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
    type: 'video/mp4'
  }]), 'we can ask whether it contains a sources list of objects');

  assert.ok(playlist.contains({
    sources: ['http://media.w3.org/2010/05/sintel/trailer.mp4']
  }), 'we can ask whether it contains a playlist item');

  assert.ok(playlist.contains({
    sources: [{
      src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
      type: 'video/mp4'
    }]
  }), 'we can ask whether it contains a playlist item');

  assert.ok(!playlist.contains('http://media.w3.org/2010/05/sintel/poster.png'), 'we get false for a non-existent source string');

  assert.ok(!playlist.contains(['http://media.w3.org/2010/05/sintel/poster.png']), 'we get false for a non-existent source list of strings');

  assert.ok(!playlist.contains([{
    src: 'http://media.w3.org/2010/05/sintel/poster.png',
    type: 'video/mp4'
  }]), 'we get false for a non-existent source list of objects');

  assert.ok(!playlist.contains({
    sources: ['http://media.w3.org/2010/05/sintel/poster.png']
  }), 'we can ask whether it contains a playlist item');

  assert.ok(!playlist.contains({
    sources: [{
      src: 'http://media.w3.org/2010/05/sintel/poster.png',
      type: 'video/mp4'
    }]
  }), 'we get false for a non-existent playlist item');
});

_qunit2['default'].test('playlist.indexOf() works as expected', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var playlist = (0, _srcPlaylistMaker2['default'])(player, videoList);

  var mixedSourcesPlaylist = (0, _srcPlaylistMaker2['default'])(player, [{
    sources: [{
      src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
      type: 'video/mp4'
    }, {
      app_name: 'rtmp://example.com/sintel/trailer', // eslint-disable-line
      avg_bitrate: 4255000, // eslint-disable-line
      codec: 'H264',
      container: 'MP4'
    }],
    poster: 'http://media.w3.org/2010/05/sintel/poster.png'
  }]);

  player.playlist = playlist;

  assert.equal(playlist.indexOf('http://media.w3.org/2010/05/sintel/trailer.mp4'), 0, 'sintel trailer is first item');

  assert.equal(playlist.indexOf('//media.w3.org/2010/05/sintel/trailer.mp4'), 0, 'sintel trailer is first item, protocol-relative url considered equal');

  assert.equal(playlist.indexOf(['http://media.w3.org/2010/05/bunny/trailer.mp4']), 1, 'bunny trailer is second item');

  assert.equal(playlist.indexOf([{
    src: 'http://vjs.zencdn.net/v/oceans.mp4',
    type: 'video/mp4'
  }]), 2, 'oceans is third item');

  assert.equal(playlist.indexOf({
    sources: ['http://media.w3.org/2010/05/bunny/movie.mp4']
  }), 3, 'bunny movie is fourth item');

  assert.equal(playlist.indexOf({
    sources: [{
      src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
      type: 'video/mp4'
    }]
  }), 4, 'timer video is fifth item');

  assert.equal(playlist.indexOf('http://media.w3.org/2010/05/sintel/poster.png'), -1, 'poster.png does not exist');

  assert.equal(playlist.indexOf(['http://media.w3.org/2010/05/sintel/poster.png']), -1, 'poster.png does not exist');

  assert.equal(playlist.indexOf([{
    src: 'http://media.w3.org/2010/05/sintel/poster.png',
    type: 'video/mp4'
  }]), -1, 'poster.png does not exist');

  assert.equal(playlist.indexOf({
    sources: ['http://media.w3.org/2010/05/sintel/poster.png']
  }), -1, 'poster.png does not exist');

  assert.equal(playlist.indexOf({
    sources: [{
      src: 'http://media.w3.org/2010/05/sintel/poster.png',
      type: 'video/mp4'
    }]
  }), -1, 'poster.png does not exist');

  assert.equal(mixedSourcesPlaylist.indexOf({
    sources: [{
      src: 'http://media.w3.org/2010/05/bunny/movie.mp4',
      type: 'video/mp4'
    }, {
      app_name: 'rtmp://example.com/bunny/movie', // eslint-disable-line
      avg_bitrate: 4255000, // eslint-disable-line
      codec: 'H264',
      container: 'MP4'
    }],
    poster: 'http://media.w3.org/2010/05/sintel/poster.png'
  }), -1, 'bunny movie does not exist');

  assert.equal(mixedSourcesPlaylist.indexOf({
    sources: [{
      src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
      type: 'video/mp4'
    }, {
      app_name: 'rtmp://example.com/sintel/trailer', // eslint-disable-line
      avg_bitrate: 4255000, // eslint-disable-line
      codec: 'H264',
      container: 'MP4'
    }],
    poster: 'http://media.w3.org/2010/05/sintel/poster.png'
  }), 0, 'sintel trailer does exist');
});

_qunit2['default'].test('playlist.next() works as expected', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var playlist = (0, _srcPlaylistMaker2['default'])(player, videoList);
  var src = undefined;

  player.currentSrc = function () {
    return src;
  };

  src = videoList[0].sources[0].src;
  assert.equal(playlist.currentItem(), 0, 'we start on item 0');

  assert.deepEqual(playlist.next(), videoList[1], 'we get back the value of currentItem 2');

  src = videoList[1].sources[0].src;
  assert.equal(playlist.currentItem(), 1, 'we are now on item 1');

  assert.deepEqual(playlist.next(), videoList[2], 'we get back the value of currentItem 3');

  src = videoList[2].sources[0].src;
  assert.equal(playlist.currentItem(), 2, 'we are now on item 2');
  src = videoList[4].sources[0].src;
  assert.equal(playlist.currentItem(4), 4, 'we are now on item 4');

  assert.equal(typeof playlist.next(), 'undefined', 'we get nothing back if we try to go out of bounds');
});

_qunit2['default'].test('playlist.previous() works as expected', function (assert) {
  var player = (0, _playerProxyMaker2['default'])();
  var playlist = (0, _srcPlaylistMaker2['default'])(player, videoList);
  var src = undefined;

  player.currentSrc = function () {
    return src;
  };

  src = videoList[0].sources[0].src;
  assert.equal(playlist.currentItem(), 0, 'we start on item 0');

  assert.equal(typeof playlist.previous(), 'undefined', 'we get nothing back if we try to go out of bounds');

  src = videoList[2].sources[0].src;
  assert.equal(playlist.currentItem(), 2, 'we are on item 2');

  assert.deepEqual(playlist.previous(), videoList[1], 'we get back value of currentItem 1');

  src = videoList[1].sources[0].src;
  assert.equal(playlist.currentItem(), 1, 'we are on item 1');

  assert.deepEqual(playlist.previous(), videoList[0], 'we get back value of currentItem 0');

  src = videoList[0].sources[0].src;
  assert.equal(playlist.currentItem(), 0, 'we are on item 0');

  assert.equal(typeof playlist.previous(), 'undefined', 'we get nothing back if we try to go out of bounds');
});

_qunit2['default'].test('loading a non-playlist video will cancel autoadvance and set index of -1', function (assert) {
  var playlist = undefined;
  var oldReset = autoadvance.reset;
  var player = (0, _playerProxyMaker2['default'])();

  playlist = (0, _srcPlaylistMaker2['default'])(player, [{
    sources: [{
      src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
      type: 'video/mp4'
    }],
    poster: 'http://media.w3.org/2010/05/sintel/poster.png'
  }, {
    sources: [{
      src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
      type: 'video/mp4'
    }],
    poster: 'http://media.w3.org/2010/05/bunny/poster.png'
  }]);

  player.currentSrc = function () {
    return 'http://vjs.zencdn.net/v/oceans.mp4';
  };

  autoadvance.reset = function () {
    assert.ok(true, 'autoadvance.reset was called');
  };

  player.trigger('loadstart');

  assert.equal(playlist.currentItem(), -1, 'new currentItem is -1');

  player.currentSrc = function () {
    return 'http://media.w3.org/2010/05/sintel/trailer.mp4';
  };

  autoadvance.reset = function () {
    assert.ok(false, 'autoadvance.reset should not be called');
  };

  player.trigger('loadstart');

  autoadvance.reset = oldReset;
});

_qunit2['default'].test('when loading a new playlist, trigger "playlistchange" on the player', function (assert) {
  var oldTimeout = _globalWindow2['default'].setTimeout;
  var player = (0, _playerProxyMaker2['default'])();
  var playlist = undefined;

  _globalWindow2['default'].setTimeout = function (fn, timeout) {
    fn();
  };

  player.trigger = function (type) {
    assert.equal(type, 'playlistchange', 'trigger playlistchange on playlistchange');
  };

  playlist = (0, _srcPlaylistMaker2['default'])(player, [1, 2, 3]);

  playlist([4, 5, 6]);

  _globalWindow2['default'].setTimeout = oldTimeout;
});

_qunit2['default'].test('clearTimeout on dispose', function (assert) {
  var oldTimeout = _globalWindow2['default'].setTimeout;
  var oldClear = _globalWindow2['default'].clearTimeout;
  var timeout = 1;
  var player = (0, _playerProxyMaker2['default'])();
  var playlist = (0, _srcPlaylistMaker2['default'])(player, [1, 2, 3]);

  _globalWindow2['default'].setTimeout = function () {
    return timeout;
  };

  _globalWindow2['default'].clearTimeout = function (to) {
    assert.equal(to, timeout, 'we cleared the timeout');
  };

  playlist([1, 2, 3]);
  player.trigger('dispose');

  _globalWindow2['default'].setTimeout = oldTimeout;
  _globalWindow2['default'].clearTimeout = oldClear;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/auto-advance":16,"../src/playlist-maker":18,"./player-proxy-maker":22,"global/window":1}],24:[function(require,module,exports){
(function (global){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _qunit = (typeof window !== "undefined" ? window['QUnit'] : typeof global !== "undefined" ? global['QUnit'] : null);

var _qunit2 = _interopRequireDefault(_qunit);

var _sinon = (typeof window !== "undefined" ? window['sinon'] : typeof global !== "undefined" ? global['sinon'] : null);

var _sinon2 = _interopRequireDefault(_sinon);

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var _srcPlugin = require('../src/plugin');

var _srcPlugin2 = _interopRequireDefault(_srcPlugin);

_qunit2['default'].test('the environment is sane', function (assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof _sinon2['default'], 'object', 'sinon exists');
  assert.strictEqual(typeof _videoJs2['default'], 'function', 'videojs exists');
  assert.strictEqual(typeof _srcPlugin2['default'], 'function', 'plugin is a function');
});

_qunit2['default'].test('registers itself with video.js', function (assert) {
  assert.expect(1);
  assert.strictEqual(_videoJs2['default'].getComponent('Player').prototype.playlist, _srcPlugin2['default'], 'videojs-playlist plugin was registered');
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/plugin":19}]},{},[20,21,23,24]);
