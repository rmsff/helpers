const type = (value, compareType) => {
	const type = Object.prototype.toString.call(value).replace(/\[object\s|\]/g, '');
	if (compareType) return compareType === type;
	return type;
};

const has = (obj, path) => {
	if (typeof path === 'string') path = path.split('.');
	if (path.length === 1) {
        return (obj && obj.hasOwnProperty(path[0]));
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

const findProps = (obj, prop, path, searhArray = true) => {
	const result = [];
	const find = (obj, path) => {
		for (const key in obj) {
			if (key == prop) {
				result.push({
					path: [...path, `${key}`].join('.'),
					value: obj[key],
				});
			}
			if (type(obj[key], 'Object')) find(obj[key], [...path, `${key}`]);
			else if (type(obj[key], 'Array') && searhArray) find(obj[key], [...path, `${key}`]);
		}
    };
    if (path) {
		const newObj = get(obj, path);
		find(newObj, [path]);
	} else {
        find(obj, []);
    }
	return result;
};

const findProp = (obj, prop, path, resultPath = []) => {
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

module.export = { findProp, findProps, set, get, has, type };
