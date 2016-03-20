import * as rx from 'rx';
import {reduce, is, isArrayLike, clone, set, tail, last, init} from 'ramda';

export const combineTemplate = template => {
  const data = getObservableDataRecursivelyFromObject(template);
  const observables = data.map(o => o.value);
  const fullPaths = data.map(o => o.fullPath);

  const createObject = (...values) => {
    const o = clone(template);
    values.forEach((value, i) => {
      setObjectValueBasedOnPath(o, fullPaths[i], value)
    });
    return o
  };

  return rx.Observable.combineLatest(...observables.concat(createObject))
}

export const getObservableDataRecursivelyFromObject = (obj, path = '') => {
  const observables = [];

  for (const key in obj) {
    const value = obj[key];
    const fullPath = path + '.' + key;

    if (is(rx.Observable, value)) {
      observables.push({ value, fullPath })
    } else if (isArrayLike(value)) {
      const xs = getObservableDataRecursivelyFromObject(value, fullPath);
      for (const x of xs) {
        observables.push(x)
      }
    } else if (is(Object, value)) {
      const xs = getObservableDataRecursivelyFromObject(value, fullPath);
      for (const x of xs) {
        observables.push(x)
      }
    }
  }

  return observables
}

const setObjectValueBasedOnPath = (object, path, value) => {
  const parts = tail(path.split('.'));
  const o = reduce((o, key) => o[key], object, init(parts));
  o[last(parts)] = value
};
