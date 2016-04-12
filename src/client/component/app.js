import * as ramda from 'ramda'
import * as Rx from 'rx'
import InputSource from '../../shared/util/input-source'
import {combineTemplate} from '../../shared/util/rx'
import Firebase from 'firebase'
import {snapshotToObject, onValueOnce, onRemoved, onAdded} from '../util/firebase'
import view from '../../shared/view/app'

const model = () => {
  const fb = new Firebase('https://glowing-inferno-1196.firebaseio.com/')
  const todosRef = fb.child('todos')

  const inputSources = {
    newTodoMessage: InputSource(),
    addNewTodo: InputSource(),
    removeTodo: InputSource()
  }

  const addedTodo = inputSources.newTodoMessage
    .sample(inputSources.addNewTodo)
    .map(message => ({ checked: false, message: message, created: Date.now() }))

  // Persist...
  addedTodo.subscribe(todo => todosRef.push(todo))
  inputSources.removeTodo.subscribe(id => todosRef.child(id).remove())

  const initialTodos = onValueOnce(todosRef).map(snapshot => ({data: snapshot.val(), type: 'add'}))
  const additionalTodos = onAdded(todosRef).map(snapshot => ({data: snapshotToObject(snapshot), type: 'add'}))
  const removedTodos = onRemoved(todosRef).map(snapshot => ({data: snapshotToObject(snapshot), type: 'remove'}))

  const hasFetchedInitialTodos = initialTodos.map(true)

  const todoActions = Rx.Observable.merge(
    initialTodos,
    additionalTodos.filterBy(hasFetchedInitialTodos),
    removedTodos
  )

  const todos = todoActions.scan((currentTodos, action) => {
    if (action.type == 'add') {
      return ramda.merge(currentTodos, action.data)
    } else {
      return ramda.omit(ramda.keys(action.data), currentTodos)
    }
  }, {})

  return combineTemplate({
    view: {
      todos: todos,
      newTodoMessage: Rx.Observable.merge(
        inputSources.newTodoMessage.startWith(''),
        inputSources.addNewTodo.map('')
      )
    },
    inputSources: Rx.Observable.just(inputSources)
  }).log('app/model state: ')
}

export default () => model().map(view)
