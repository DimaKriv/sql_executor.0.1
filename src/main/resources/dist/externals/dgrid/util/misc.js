define([
	'dojo/has'
], function (has) {
	// summary:
	//		This module defines miscellaneous utility methods for purposes of
	//		adding styles, and throttling/debouncing function calls.

	// establish an extra stylesheet which addCssRule calls will use,
	// plus an array to track actual indices in stylesheet for removal
	var extraRules = [],
		extraSheet,
		removeMethod,
		rulesProperty,
		invalidCssChars = /([^A-Za-z0-9_\u00A0-\uFFFF-])/g,
		delayCallback = setTimeout,
		cancelDelay = clearTimeout;

	has.add('requestidlecallback', function (global) {
		return typeof global.requestIdleCallback === 'function';
	});

	// The presence of the 'requestIdleCallback' method indicates a browser that might
	// performance optimize code by delaying execution of the callback passed to
	// 'setTimeout', so use 'requestIdleCallback' to improve the likelihood of the
	// callback being executed in a timely manner.
	// This is not a perfect solution, but has worked well in testing.
	// requestIdleCallback is designed to be called successively, performing progressive chunks
	// of computation each time until the task is complete.
	// setTimeout executes its callback when delay has transpired, *or later*
	// requestIdleCallback executes its callback when delay has transpired, *or sooner*
	// Fixes https://github.com/SitePen/dgrid/issues/1351
	// if (has('requestidlecallback')) {
	// 	delayCallback = function (callback, delay) {
	// 		return requestIdleCallback(callback, { timeout: delay });
	// 	};
	// 	cancelDelay = cancelIdleCallback;
	// }

	function removeRule(index) {
		// Function called by the remove method on objects returned by addCssRule.
		var realIndex = extraRules[index],
			i, l;
		if (realIndex === undefined) {
			return; // already removed
		}

		// remove rule indicated in internal array at index
		extraSheet[removeMethod](realIndex);

		// Clear internal array item representing rule that was just deleted.
		// NOTE: we do NOT splice, since the point of this array is specifically
		// to negotiate the splicing that occurs in the stylesheet itself!
		extraRules[index] = undefined;

		// Then update array items as necessary to downshift remaining rule indices.
		// Can start at index + 1, since array is sparse but strictly increasing.
		for (i = index + 1, l = extraRules.length; i < l; i++) {
			if (extraRules[i] > realIndex) {
				extraRules[i]--;
			}
		}
	}

	var util = {
		// Throttle/debounce functions

		defaultDelay: 15,
		throttle: function (cb, context, delay) {
			// summary:
			//		Returns a function which calls the given callback at most once per
			//		delay milliseconds.  (Inspired by plugd)
			var ran = false;
			delay = delay || util.defaultDelay;
			return function () {
				if (ran) {
					return;
				}
				ran = true;
				cb.apply(context, arguments);
				delayCallback(function () {
					ran = false;
				}, delay);
			};
		},
		throttleDelayed: function (cb, context, delay) {
			// summary:
			//		Like throttle, except that the callback runs after the delay,
			//		rather than before it.
			var ran = false;
			delay = delay || util.defaultDelay;
			return function () {
				if (ran) {
					return;
				}
				ran = true;
				var a = arguments;
				delayCallback(function () {
					ran = false;
					cb.apply(context, a);
				}, delay);
			};
		},
		debounce: function (cb, context, delay) {
			// summary:
			//		Returns a function which calls the given callback only after a
			//		certain time has passed without successive calls.  (Inspired by plugd)
			var timer;
			delay = delay || util.defaultDelay;
			return function () {
				if (timer) {
					cancelDelay(timer);
					timer = null;
				}
				var a = arguments;
				timer = delayCallback(function () {
					timer = null;
					cb.apply(context, a);
				}, delay);
			};
		},

		// Iterative functions

		each: function (arrayOrObject, callback, context) {
			// summary:
			//		Given an array or object, iterates through its keys.
			//		Does not use hasOwnProperty (since even Dojo does not
			//		consistently use it), but will iterate using a for or for-in
			//		loop as appropriate.

			var i, len;

			if (!arrayOrObject) {
				return;
			}

			if (typeof arrayOrObject.length === 'number') {
				for (i = 0, len = arrayOrObject.length; i < len; i++) {
					callback.call(context, arrayOrObject[i], i, arrayOrObject);
				}
			}
			else {
				for (i in arrayOrObject) {
					callback.call(context, arrayOrObject[i], i, arrayOrObject);
				}
			}
		},

		// CSS-related functions

		addCssRule: function (selector, css) {
			// summary:
			//		Dynamically adds a style rule to the document.  Returns an object
			//		with a remove method which can be called to later remove the rule.

			if (!extraSheet) {
				// First time, create an extra stylesheet for adding rules
				extraSheet = document.createElement('style');
				document.getElementsByTagName('head')[0].appendChild(extraSheet);
				// Keep reference to actual StyleSheet object (`styleSheet` for IE < 9)
				extraSheet = extraSheet.sheet || extraSheet.styleSheet;
				// Store name of method used to remove rules (`removeRule` for IE < 9)
				removeMethod = extraSheet.deleteRule ? 'deleteRule' : 'removeRule';
				// Store name of property used to access rules (`rules` for IE < 9)
				rulesProperty = extraSheet.cssRules ? 'cssRules' : 'rules';
			}

			var index = extraRules.length;
			extraRules[index] = (extraSheet.cssRules || extraSheet.rules).length;
			extraSheet.addRule ?
				extraSheet.addRule(selector, css) :
				extraSheet.insertRule(selector + '{' + css + '}', extraRules[index]);

			return {
				get: function (prop) {
					return extraSheet[rulesProperty][extraRules[index]].style[prop];
				},
				set: function (prop, value) {
					if (typeof extraRules[index] !== 'undefined') {
						extraSheet[rulesProperty][extraRules[index]].style[prop] = value;
					}
				},
				remove: function () {
					removeRule(index);
				}
			};
		},

		escapeCssIdentifier: function (id, replace) {
			// summary:
			//		Escapes normally-invalid characters in a CSS identifier (such as . or :);
			//		see http://www.w3.org/TR/CSS2/syndata.html#value-def-identifier
			// id: String
			//		CSS identifier (e.g. tag name, class, or id) to be escaped
			// replace: String?
			//		If specified, indicates that invalid characters should be
			//		replaced by the given string rather than being escaped

			return typeof id === 'string' ? id.replace(invalidCssChars, replace || '\\$1') : id;
		}
	};
	return util;
});
