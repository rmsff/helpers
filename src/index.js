/**
 * Get data type of value
 * @param {any} value - Value whose data type is being checked
 * @param {(string | Number | String | Array | Object)} [compareType] - Comparison type. String or or class compare type.
 * @return {(boolean | string)} Data type or result of type comparison
 * @example
 * type('value'); -> String
 * type(new RegExp('value', 'RegExp'); -> true or false
 * type(2314123, Number); -> true
 */

const type = (value, compareType) => {
	const _type = Object.prototype.toString.call(value).replace(/\[object\s|\]/g, '');
	if (compareType) {
		if (type(compareType) === 'Function') compareType = type(compareType.prototype);
		return compareType === _type;
	}
	return _type;
};

const has = (obj, path) => {
	if (typeof path === 'string') path = path.split('.');
	if (path.length === 1) {
		return obj && obj.hasOwnProperty(path[0]);
	} else {
		return has((obj && obj[path[0]]) || {}, path.slice(1));
	}
};

const get = (obj, path, defaultValue) => {
	if (typeof path === 'string') path = path.split('.');
	if (path.length === 1) {
		return (obj !== undefined && obj[path[0]]) || (defaultValue !== undefined && defaultValue);
	} else {
		return get(obj && obj[path[0]], path.slice(1), defaultValue);
	}
};

const set = (obj = {}, path, value) => {
	if (typeof path === 'string') path = path.split('.');
	if (!obj.hasOwnProperty(path[0])) {
		const createObjs = (path, obj) => {
			if (path.length === 1) return (obj[path[0]] = {});
			obj[path[0]] = {};
			return createObjs(path.slice(1), obj[path[0]]);
		};
		obj[path[0]] = createObjs(path, {});
	}
	if (path.length === 1) {
		if (obj.hasOwnProperty(path[0])) {
			obj[path[0]] = value;
			return true;
		} else return false;
	} else {
		if (!['Object', 'Array'].includes(type(obj[path[0]]))) obj[path[0]] = {};
		return set(obj[path[0]], path.slice(1), value);
	}
};

/**
 * @typedef {Object} TOptions
 * @property {string} [path] - Search path
 * @property {number} [deep] - Recursion depth
 * @property {(boolean | RegExp)} [includes] - Search for occurrences or RegExp
 * @property {boolean} [searhArray] - Search by object and arrays
 * @property {('props' | 'values')} [searchType] - Search type. "props" - search by object properties, "values" - search by object values
 */

/**
 * Recursively look up a names or values in an object
 * @param {({} | [])} obj - Search object (required)
 * @param {string} looking - Property
 * @param {TOptions} [options] - Options
 * @return {boolean} Search results
 * @example
 * findProps(object, 'd', { path: 'a.b.c', searchType: 'props', includes: true });
 * -> [
 *   { value: [ 1, 2, {} ], path: 'a.b.c.d' },
 *   { value: 463456, path: 'a.b.c.d.2.d' }
 * ]
 */
const findProps = (
	obj,
	looking,
	{ path: deepPath, deep, includes, searhArray = true, searchType = 'props' },
) => {
	const result = [];
	const find = (obj, path, looking) => {
		if (
			type(deep, 'Number') &&
			((deepPath && deepPath.split('.').length) || 0) + deep < path.length
		)
			return;
		for (const key in obj) {
			if (
				(searchType === 'props' && key == looking) ||
				(searchType === 'values' && obj[key] == looking)
			) {
				result.push({
					path: [...path, `${key}`].join('.'),
					value: obj[key],
					prop: key,
				});
			} else if (includes) {
				if (
					(searchType === 'props' &&
						key.search(type(includes, 'RegExp') ? includes : new RegExp(`${looking}`, 'gi')) > -1) ||
					(searchType === 'values' &&
						`${obj[key]}`.search(
							type(includes, 'RegExp') ? includes : new RegExp(`${looking}`, 'gi'),
						) > -1)
				) {
					result.push({
						path: [...path, `${key}`].join('.'),
						value: obj[key],
						prop: key,
					});
				}
			}
			if (type(obj[key], 'Object')) find(obj[key], [...path, `${key}`], looking);
			else if (type(obj[key], 'Array') && searhArray) find(obj[key], [...path, `${key}`], looking);
		}
	};
	if (deepPath) {
		const newObj = get(obj, deepPath);
		if (type(looking, Array)) looking.forEach((l) => find(newObj, [deepPath], l));
		else find(newObj, [deepPath], looking);
	} else {
		if (type(looking, Array)) looking.forEach((l) => find(obj, [deepPath], l));
		else find(obj, [], looking);
	}
	return result;
};

module.exports = { findProps, set, get, has, type };
