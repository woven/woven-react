import * as ramda from 'ramda'

// Very generic util functions here.

export const mapObjectToList = (object, fn) => ramda.values(ramda.mapObjIndexed(fn, object))
