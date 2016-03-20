import * as Rx from 'rx'

// Example helper function that gets json content from the given URL.
// This returns an Rx observable/stream.
// The pluck() is a function that reads a value from a JS object (in this case 'response'):
// {status: 200, response: ...}
// Once we have the actual response text instead of the ajax response object,
// then we map that into JSON.parse() to get native JS objects instead of string/text.
export const getJson = url => Rx.DOM.get(url).pluck('response').map(JSON.parse)
