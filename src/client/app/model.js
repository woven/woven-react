import * as ramda from 'ramda'
import * as Rx from 'rx'
import InputSource from '../util/input-source'
import {combineTemplate} from '../util/rx'
import {getJson} from '../util/ajax'

export default () => {
  const inputSources = {
    newTodoMessage: InputSource(), // Our own helper thing.
    addNewTodo: InputSource(),
    removeTodo: InputSource()
  }

  const serverTodos = getJson('/todos') // Read todos once from the server.

  // TODO:
  const newTodoData = Rx.Observable.merge(
    serverTodos, // Just use server todos directly.

    // For user todos we want to process a bit.
    // `sample()` new todo messages based on when we click the 'Add!' button.
    // We wish to only act when the user presses the button 'Add!', that's why the .sample(addNewTodo)
    // Without the sampler here, every keystroke in the input would add a new todo :)
    // After we receive a new message, `map` it into a todo item/object.
    inputSources.newTodoMessage
      .sample(inputSources.addNewTodo)
      .map(message => ({ checked: false, message: message }))
  )

  // TODO:
  // Now let's create a stream of todos we wish to display.
  // The scan() below simply scans/reads `allTodoData`. Whenever `allTodoData` changes, the scan runs.
  // The function you give to scan, gets two parameters. 1) the current state and 2) the new item/event that came from the `allTodoData` event stream.
  // And finally, our function inside the scan returns the new state (old state + new item = new state).
  // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/scan.md
  const todoActions = Rx.Observable.merge(
    newTodoData.map(data => ({data: data, type: 'add'})),
    inputSources.removeTodo.map(index => ({index: index, type: 'remove'}))
  )

  const todos = todoActions.scan((currentTodos, action) => {
    if (action.type == 'add') {
      console.log('Adding todo data: ', action.data)
      return ramda.concat(currentTodos, action.data) // A Ramda helper for concatting a new value into our todos array.
    } else {
      console.log('Removing todo data based on index: ', action.index)
      return ramda.remove(action.index, 1, currentTodos) // A Ramda helper for removing an item from array based on index.
    }
  }, []) // Start our todos with a seed value of [], i.e. no todos.

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
