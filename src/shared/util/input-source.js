import * as Rx from 'rx'

class InputSource extends Rx.Subject {
  fromConstant(value) {
    super.onNext(value)
  }

  fromTargetValue(e) {
    super.onNext(e.target.value)
  }

  fromOnlyKeyCode(e, key) {
    if (e.keyCode == key) {
      super.onNext(e.target.value)
    }
  }
}

export default () => new InputSource()
