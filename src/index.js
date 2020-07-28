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

const get = (obj, path) => {
	if (typeof path === 'string') path = path.split('.');
	if (path.length === 1) {
		return obj !== undefined && obj[path[0]];
	} else {
		return get(obj && obj[path[0]], path.slice(1));
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
					prop: searchType === 'props' ? looking : key,
				});
			} else if (includes) {
				if (
					(searchType === 'props' &&
						key.search(type(includes, 'RegExp') ? includes : new RegExp(`${looking}`, 'g')) > -1) ||
					(searchType === 'values' &&
						`${obj[key]}`.search(
							type(includes, 'RegExp') ? includes : new RegExp(`${looking}`, 'g'),
						) > -1)
				) {
					result.push({
						path: [...path, `${key}`].join('.'),
						value: obj[key],
						prop: searchType === 'props' ? looking : key,
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

const findProp = (obj, prop, { path, resultPath = [] }) => {
	if (path) {
		const newObj = get(obj, path);
		return findProp(newObj, prop, false, [path]);
	}
	if (obj.hasOwnProperty(prop))
		return {
			path: [...resultPath, `${prop}`].join('.'),
			value: obj[prop],
		};
	for (const key in obj) {
		if (type(obj[key], 'Object')) {
			const found = findProp(obj[key], prop, false, [...resultPath, `${key}`]);
			if (found) return found;
		}
	}
};

module.exports = { findProp, findProps, set, get, has, type };
