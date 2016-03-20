import * as Rx from 'rx'

export default () => {
  // This is a helper InputSource object.
  // It extends Rx.Subject with few nice methods.
  const inputSource = new Rx.Subject()

  inputSource.fromValue = (e) => inputSource.onNext(e.target.value)
  inputSource.fromEvent = (e) => inputSource.onNext(e)

  return inputSource
}
