define([
	'dojo/_base/declare',
	'dojo/_base/array'
], function (declare, arrayUtil) {

	// module:
	//		dstore/SimpleQuery

	function makeGetter(property, queryAccessors) {
		if (property.indexOf('.') > -1) {
			var propertyPath = property.split('.');
			var pathLength = propertyPath.length;
			return function (object) {
				for (var i = 0; i < pathLength; i++) {
					object = object && (queryAccessors && object.get ? object.get(propertyPath[i]) : object[propertyPath[i]]);
				}
				return object;
			};
		}
		// else
		return function (object) {
			return object.get ? object.get(property) : object[property];
		};
	}

	var comparators = {
		eq: function eq(value, required) {
			return value === required;
		},
		'in': function inComparator(value, required) {
			// allow for a collection of data
			return arrayUtil.indexOf(required.data || required, value) > -1;
		},
		ne: function ne(value, required) {
			return value !== required;
		},
		lt: function lt(value, required) {
			return value < required;
		},
		lte: function lte(value, required) {
			return value <= required;
		},
		gt: function gt(value, required) {
			return value > required;
		},
		gte: function gte(value, required) {
			return value >= required;
		},
		match: function match(value, required, object) {
			return required.test(value, object);
		},
		contains: function contains(value, required, object, key) {
			var collection = this;
			var data;

			if (required.data) {
				data = required.data;
			} else if(Array.isArray(required)) {
				data = required;
			} else {
				data = [required];
			}

			return arrayUtil.every(data, function (requiredValue) {
				if (typeof requiredValue === 'object' && requiredValue.type) {
					var comparator = collection._getFilterComparator(requiredValue.type);
					return arrayUtil.some(value, function (item) {
						return comparator.call(collection, item, requiredValue.args[1], object, key);
					});
				}
				return arrayUtil.indexOf(value, requiredValue) > -1;
			});
		}
	};

	return declare(null, {
		// summary:
		//		Mixin providing querier factories for core query types

		_createFilterQuerier: function (filter) {
			// create our matching filter function
			var queryAccessors = this.queryAccessors;
			var collection = this;
			var querier = getQuerier(filter);

			function getQuerier(filter) {
				var currentQuerier;
				var nextQuerier;
				var type = filter.type;
				var args = filter.args;
				var comparatorFunction = collection._getFilterComparator(type);

				if (comparatorFunction) {
					// it is a comparator
					var firstArg = args[0];
					var getProperty = makeGetter(firstArg, queryAccessors);
					var secondArg = args[1];

					if (secondArg && secondArg.fetchSync) {
						// if it is a collection, fetch the contents (for `in` and `contains` operators)
						secondArg = secondArg.fetchSync();
					}

					return function comparator(object) {
						// get the value for the property and compare to expected value
						return comparatorFunction.call(collection, getProperty(object), secondArg, object, firstArg);
					};
				}

				switch (type) {
					case 'and': case 'or':
						for (var i = 0, l = args.length; i < l; i++) {
							// combine filters, using and or or
							nextQuerier = getQuerier(args[i]);

							if (currentQuerier) {
								// combine the last querier with a new one
								currentQuerier = (function(a, b) {
									return type === 'and' ?
										function and(object) {
											return a(object) && b(object);
										} :
										function or(object) {
											return a(object) || b(object);

										};
								})(currentQuerier, nextQuerier);
							} else {
								currentQuerier = nextQuerier;
							}
						}
						return currentQuerier;
					case 'function':
						return args[0];
					case 'string':
						// named filter
						var filterFunction = collection[args[0]];
						if (!filterFunction) {
							throw new Error('No filter function ' + args[0] + ' was found in the collection');
						}
						return filterFunction;
					case undefined:
						return function () {
							return true;
						};
					default:
						throw new Error('Unknown filter operation "' + type + '"');
				}
			}

			return function (data) {
				return arrayUtil.filter(data, querier);
			};
		},

		_getFilterComparator: function (type) {
			// summary:
			//		Get the comparator for the specified type
			// returns: Function?

			return comparators[type] || this.inherited(arguments);
		},

		_createSelectQuerier: function (properties) {
			return function (data) {
				var l = properties.length;
				return arrayUtil.map(data, properties instanceof Array ?
					// array of properties
					function (object) {
						var selectedObject = {};
						for (var i = 0; i < l; i++) {
							var property = properties[i];
							selectedObject[property] = object[property];
						}
						return selectedObject;
					} :
					// single property
					function (object) {
						return object[properties];
					});
			};
		},

		_createSortQuerier: function (sortOptions) {
			var queryAccessors = this.queryAccessors;

			return function (data) {
				data = data.slice();

				if (typeof sortOptions === 'function') {
					data.sort(sortOptions);
				}
				else if (sortOptions && sortOptions.length) {
					data.sort(function (a, b) {
						for (var i = 0; i < sortOptions.length; i++) {
							var comparison;
							var sorter = sortOptions[i];
							if (typeof sorter == 'function') {
								comparison = sorter(a, b);
							} else {
								var getProperty = sorter.get || (sorter.get = makeGetter(sorter.property, queryAccessors));
								var descending = sorter.descending;
								var aValue = getProperty(a);
								var bValue = getProperty(b);

								aValue != null && (aValue = aValue.valueOf());
								bValue != null && (bValue = bValue.valueOf());
								if (aValue === bValue) {
									comparison = 0;
								}
								else {
									// Prioritize undefined > null > defined
									var isALessThanB = typeof bValue === 'undefined' ||
										bValue === null && typeof aValue !== 'undefined' ||
										aValue != null && aValue < bValue;
									comparison = Boolean(descending) === isALessThanB ? 1 : -1;
								}
							}

							if (comparison !== 0) {
								return comparison;
							}
						}

						return 0;
					});
				}

				return data;
			};
		}
	});
});
