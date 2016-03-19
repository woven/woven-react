// FYI, nice docs:
// Ramda utility docs: http://ramdajs.com/0.19.1/docs/
// RxJS free online book: http://xgrommx.github.io/rx-book/

import * as ramda from 'ramda' // Ramda is a popular JS utility for doing random things.
import * as Rx from 'rx'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {combineTemplate} from './rx-utils' // A cool Rx util I made for myself a while ago.

// For now some React helpers, later we can make this nicer.
const ul = React.createFactory('ul')
const li = React.createFactory('li')
const div = React.createFactory('div')
const input = React.createFactory('input')
const button = React.createFactory('button')

// Example helper function that gets json content from the given URL.
// This returns an Rx observable/stream.
// The pluck() is a function that reads a value from a JS object:
// {status: 200, response: ...}
// Once we have the actual response text instead of the ajax response object,
// then we map that into JSON.parse() to get native JS objects instead of string/text.
const getJson = url => Rx.DOM.get(url).pluck('response').map(JSON.parse)

// Define some Rx input sources.
const newTodoMessage = new Rx.Subject() // This resembles our new todo message.
const addNewTodo = new Rx.Subject() // This resembles actions like clicking 'Add!' button.

// Read todos once from the server.
const serverTodos = getJson('/todos')

// Let's construct all todo info we need. 1) todos from the server (a list) and 2) todo messages from the UI.
// We want to merge these two sources into one source for easier further processing.
const allTodoData = Rx.Observable.merge(
  serverTodos, // Just use server todos directly.

  // For user todos we want to process a bit.
  // `sample()` new todo messages based on when we click the 'Add!' button.
  // We wish to only act when the user presses the button 'Add!', that's why the .sample(addNewTodo)
  // Without the sampler here, every keystroke in the input would add a new todo :)
  // After we receive a new message, `map` it into a todo item/object.
  newTodoMessage
    .sample(addNewTodo)
    .map(message => ({ checked: false, message: message }))
)

// Now let's create a stream of todos we wish to display.
// The scan() below simply scans/reads `allTodoData`. Whenever `allTodoData` changes, the scan runs.
// The function you give to scan, gets two parameters. 1) the current state and 2) the new item/event that came from the `allTodoData` event stream.
// And finally, our function inside the scan returns the new state (old state + new item = new state).
// https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/scan.md
const todos = allTodoData.scan((currentTodos, newValue) => {
  console.log('Todo data is changing! ', currentTodos, newValue)

  // A lodash helper for concatting a new value into our todos array.
  return ramda.concat(currentTodos, newValue)
}, []) // Start our todos with a seed value of [], i.e. no todos.

// Define a MyApp class that resembles the main app view.
class MyApp extends React.Component {
  render() {
    // Render some virtual dom stuff. Use our predefined helpers from the top of the file.
    return div({className: 'foo'},
      ul({},
        // the `data` is passed to MyApp component at the bottom of the file (in ReactDOM.render())
        // and now we just 'loop' through the data, in this case, we map the todo items to todo elements.
        this.props.todos.map((todo, i) => li({key: i}, todo.message))
      ),
      input({
        value: this.props.newTodoMessage,
        onChange: e => newTodoMessage.onNext(e.target.value) // Rx.Subject has a onNext() method. This adds a new event to it.
      }),
      button({ onClick: e => addNewTodo.onNext() }, 'Add!')
    )
  }
}

// Define the top level state for our entire app. This state goes to the view-side.
// This is an Rx observable, which contains JS objects:
// { todos: [{id: 1, message: 'foo'}], newTodoMessage: 'user is typing a new todo item' }
const viewState = combineTemplate({
  todos: todos,
  newTodoMessage: Rx.Observable.merge(
    newTodoMessage.startWith(''), // In the beginning, our input field is empty.
    addNewTodo.map('') // When clicking 'add!' button, clear the input field!
  )
})

// This whole subscribe should only happen once per the entire application.
// todos is our whole state. Once it changes, render the new state.
// So: rx input sources -> new state -> render
viewState.subscribe(state => {
  console.log('Rendering app with this state: ', state)

  ReactDOM.render(
    React.createElement(MyApp, state),
    document.getElementById('app')
  )
})
