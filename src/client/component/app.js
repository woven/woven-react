import * as ramda from 'ramda'
import * as Rx from 'rx'
import InputSource from '../../shared/util/input-source'
import {combineTemplate} from '../../shared/util/rx'
import Firebase from 'firebase'
import {snapshotToObject, onValueOnce, onRemoved, onAdded} from '../util/firebase'
import view from '../../shared/view/app'
import {showNotification} from '../util/notification'

const model = () => {
  const fb = new Firebase('https://glowing-inferno-1196.firebaseio.com/')
  const messagesRef = fb.child('messages')

  const inputSources = {
    newMessage: InputSource(),
    addNewMessage: InputSource(),
    removeMessage: InputSource()
  }

  const addedMessage = inputSources.newMessage
    .sample(inputSources.addNewMessage)
    .map(message => ({ checked: false, message: message, created: Date.now() }))

  // Persist...
  addedMessage.subscribe(sdfgghffggfd => messagesRef.push(sdfgghffggfd))
  inputSources.removeMessage.subscribe(id => messagesRef.child(id).remove())

  const initialMessages = onValueOnce(messagesRef).map(snapshot => ({data: snapshot.val(), type: 'add'}))
  const hasFetchedInitialMessages = initialMessages.map(true)

  const additionalMessages = onAdded(messagesRef).map(snapshot => ({data: snapshotToObject(snapshot), type: 'add'})).filterBy(hasFetchedInitialMessages)
  const removeMessages = onRemoved(messagesRef).map(snapshot => ({data: snapshotToObject(snapshot), type: 'remove'}))

  additionalMessages.subscribe(message => {
    // Damn Firebase object structure is complicated...
    const firstId = ramda.keys(message.data)[0]
    showNotification(message.data[firstId].message)
  })

  const messageActions = Rx.Observable.merge(
    initialMessages,
    additionalMessages,
    removeMessages
  )

  const messages = messageActions.scan((currentMessages, action) => {
    if (action.type == 'add') {
      return ramda.merge(currentMessages, action.data)
    } else {
      return ramda.omit(ramda.keys(action.data), currentMessages)
    }
  }, {})

  return combineTemplate({
    view: {
      messages: messages,
      newMessage: Rx.Observable.merge(
        inputSources.newMessage.startWith(''),
        inputSources.addNewMessage.map('')
      )
    },
    inputSources: Rx.Observable.just(inputSources)
  }).log('app/model state: ')
}

export default () => model().map(view)
