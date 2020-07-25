# helpers


## Setup
```sh
$ npm install serikoff/helpers
```

## Examples of using


### Find a property in an object
* @param {object} search object (required)
* @param {string} property (required)
* @param {string} path (optional)

```
findProp(object, 'd', 'a.b.c.d');
// -> true or false
```

### Find properties in an object
* @param {object} search object (required)
* @param {string} property (required)
* @param {string} path (optional)
* @param {boolean} array search (optional)

```
findProps(object, 'd', 'a.b.c.d', false);
// -> 
// [
//   { value: [ 1, 2, [Object] ], path: 'a.b.c.d' },
//   { value: 463456, path: 'a.b.c.d.2.d' }
// ]
```




console.log('set',obj.setValue('a.b.c.d', {0: 0}));
console.log('has',obj.hasValue('a.b.c.d.0'));
console.log('set',obj.setValue('a.b.c.d.0.0.0.0.0', {0: 'qwqwq'}));
console.log('get',obj.getValue('a.b.c.d.0.0.0.0.0.0'));
console.log('type', [null].type());

console.log({ type: type('') });


```
import { type, has, get, set, findProps, findProp } from 'helpers';
```
