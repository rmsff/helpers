# helpers


## Setup
```sh
$ npm install serikoff/helpers
```

## Examples of using

```
import { type, has, get, set, findProps, findProp } from 'helpers';
```

### Find properties in an object

```
findProps(object, 'd', { path: 'a.b.c', searchType: 'props', includes: true });
// -> 
// [
//   { value: [ 1, 2, {} ], path: 'a.b.c.d' },
//   { value: 463456, path: 'a.b.c.d.2.d' }
// ]
```