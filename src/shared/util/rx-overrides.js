import * as Rx from 'rx'
import * as ramda from 'ramda'

// Here we define some useful overrides for Rx.

Rx.Observable.prototype.log = function () {
  const optionalParameters = Array.prototype.slice.call(arguments)
  return this.do(value => {
    console.log.apply(console, ramda.concat(optionalParameters, value))
  })
}

Rx.Observable.prototype.filterBy = function (o) {
  const me = this
  return o.map(value => me.filter(() => value)).switchLatest()
}
