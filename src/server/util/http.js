import req from 'request'
import * as Rx from 'rx'

export const read = param => {
  const x = new Rx.Subject()

  req(param, (err, response, body) => {
    if (err) {
      x.onError(err)
    } else {
      x.onNext(body)
    }
    x.onCompleted()
  })

  return x
}
