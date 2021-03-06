import * as Rx from 'rx'
import * as ramda from 'ramda'

export const onAdded = ref => {
  const subject = new Rx.Subject()
  setTimeout(() => {
    ref.on('child_added', result => subject.onNext(result), (e) => subject.onError(e))
  }, 0)
  return subject
}

export const onRemoved = ref => {
  const subject = new Rx.Subject()
  setTimeout(() => {
    ref.on('child_removed', result => subject.onNext(result), (e) => subject.onError(2))
  }, 0)
  return subject
}

export const onValueOnce = ref => {
  const subject = new Rx.Subject()
  setTimeout(() => {
    ref.once('value', result => subject.onNext(result), (e) => subject.onError(e))
  }, 0)
  return subject
}

export const snapshotToObject = snapshot => ramda.objOf(snapshot.key(), snapshot.val())
