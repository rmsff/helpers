export const type = (value, compareType) => {
	const type = Object.prototype.toString.call(value).replace(/\[object\s|\]/g, '');
	if (compareType) return compareType === type;
	return type;
};

export const has = (obj, path) => {
	if (typeof path === 'string') path = path.split('.');
	if (path.length === 1) {
        return (obj && obj.hasOwnProperty(path[0]));
	} else {
		return has((obj && obj[path[0]]) || {}, path.slice(1));
	}
};

export const get = (obj, path) => {
	if (typeof path === 'string') path = path.split('.');
	if (path.length === 1) {
		return obj !== undefined && obj[path[0]];
	} else {
		return get(obj && obj[path[0]], path.slice(1));
	}
};

export const set = (obj = {}, path, value) => {
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

export const findProps = (obj, prop, searhArray = true) => {
	const result = [];
	const find = (obj, path) => {
		for (const key in obj) {
			if (key == prop) {
				result.push({
					value: obj[key],
					path: [...path, `${key}`].join('.'),
				});
			}
			if (type(obj[key], 'Object')) find(obj[key], [...path, `${key}`]);
			else if (type(obj[key], 'Array') && searhArray) find(obj[key], [...path, `${key}`]);
		}
	};
	find(obj, []);
	return result;
};

export const findProp = (obj, prop, path, resultPath = []) => {
	if (path) {
		const newObj = get(obj, path);
		return findProp(newObj, prop, false, [path]);
	}
	if (obj.hasOwnProperty(prop))
		return {
			value: obj[prop],
			path: [...resultPath, `${prop}`].join('.'),
		};
	for (const key in obj) {
        if (type(obj[key], 'Object')) {
            const found = findProp(obj[key], prop, false, [...resultPath, `${key}`]);
            if (found) return found;
        }
	}
};

export const useHelpers = function () {
	Object.prototype.hasValue = function (path) {
		return has(this, path);
	};
	Object.prototype.getValue = function (path) {
		return get(this, path);
	};
	Object.prototype.setValue = function (path, value) {
		return set(this, path, value);
	};
	Object.prototype.findProp = function (prop, path) {
		return findProp(this, prop, path);
	};
	Object.prototype.findProps = function (prop, searhArray) {
		return findProps(this, prop, searhArray);
	};
	Array.prototype.type = function (compareType) {
		return type(this[0], compareType);
	};
};
