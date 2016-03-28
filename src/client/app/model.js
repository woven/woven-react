import * as ramda from 'ramda'
import * as Rx from 'rx'
import InputSource from '../util/input-source'
import {combineTemplate} from '../util/rx'
import Firebase from 'firebase'
import {snapshotToObject, onValueOnce, onRemoved, onAdded} from '../util/firebase'

export default () => {
  const fb = new Firebase('https://glowing-inferno-1196.firebaseio.com/')
  const todosRef = fb.child('todos')

  const inputSources = {
    newTodoMessage: InputSource(), // Our own helper thing.
    addNewTodo: InputSource(),
    removeTodo: InputSource()
  }

  const addedTodo = inputSources.newTodoMessage
    .sample(inputSources.addNewTodo)
    .map(message => ({ checked: false, message: message }))

  // Persist...
  addedTodo.subscribe(todo => todosRef.push(todo))
  inputSources.removeTodo.subscribe(id => todosRef.child(id).remove())

  // Define some actions. We can either add or remove todos.
  const todoActions = Rx.Observable.merge(
    onValueOnce(todosRef).map(snapshot => ({data: snapshot.val(), type: 'add'})),
    onAdded(todosRef).map(snapshot => ({data: snapshotToObject(snapshot), type: 'add'})),
    onRemoved(todosRef).map(snapshot => ({data: snapshotToObject(snapshot), type: 'remove'}))
  )

  // Now let's create a stream of todos we wish to display.
  // The scan() below simply scans/reads `allTodoData`. Whenever `allTodoData` changes, the scan runs.
  // The function you give to scan, gets two parameters. 1) the current state and 2) the new item/event that came from the `allTodoData` event stream.
  // And finally, our function inside the scan returns the new state (old state + new item = new state).
  // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/scan.md
  const todos = todoActions.scan((currentTodos, action) => {
    if (action.type == 'add') {
      return ramda.merge(currentTodos, action.data)
    } else {
      return ramda.omit(ramda.keys(action.data), currentTodos)
    }
  }, {})

  // Define the top level state for our entire app. This state goes to the view-side.
  // This is an Rx observable, which contains JS objects:
  // { todos: [{id: 1, message: 'foo'}], newTodoMessage: 'user is typing a new todo item' }
  return combineTemplate({
    view: {
      todos: todos,
      newTodoMessage: Rx.Observable.merge(
        inputSources.newTodoMessage.startWith(''), // In the beginning, our input field is empty.
        inputSources.addNewTodo.map('') // When clicking 'add!' button, clear the input field!
      )
    },
    inputSources: Rx.Observable.just(inputSources) // We pass input sources just as-is to the view layer so it can wire up UI events to these input sources.
  }).log('app/model state: ')
}
