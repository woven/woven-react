import * as Rx from 'rx'

export default () => {
  // This is a helper InputSource object.
  // It extends Rx.Subject with few nice methods.
  const inputSource = new Rx.Subject()

  inputSource.fromConstant = (value) => inputSource.onNext(value)
  inputSource.fromTargetValue = (e) => inputSource.onNext(e.target.value)
  inputSource.fromOnlyKeyCode = (e, key) => e.keyCode == key ? inputSource.onNext(e.target.value) : null

  return inputSource
}
