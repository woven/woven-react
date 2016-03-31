import * as ramda from 'ramda'
import {Component, createFactory} from 'react'
import {a, span, div, header, ul, li, input, button} from '../util/dom'
import {mapObjectToList} from '../util/util'
import moment from 'moment'

class AppView extends Component {
  render() {
    const view = this.props.view
    const inputSources = this.props.inputSources

    // Render some virtual dom stuff. Use our predefined helpers from the top of the file.
    return div({className: 'main'},
      header({}),
      ul({},
        // the `data` is passed to MyApp component at the bottom of the file (in ReactDOM.render())
        // and now we just 'loop' through the data, in this case, we map the todo items to todo elements.
        mapObjectToList(view.todos, (todo, todoId) =>
          li({key: todoId},
            span({className: 'message'}, todo.message),
            span({className: 'date'}, moment(todo.created).startOf('hour').fromNow().toString()),
            a({ onClick: inputSources.removeTodo.fromConstant(todoId) }, 'Remove')
          )
        )
      ),
      input({
        value: view.newTodoMessage,
        onChange: inputSources.newTodoMessage.fromValue, // Wire up onChange to add the input's value in newTodoMessage input source.
        onKeyUp: inputSources.addNewTodo.fromOnlyKeyCode(13)
      }),
      button({ onClick: inputSources.addNewTodo.fromEvent }, 'Add!') // Wire up the input source. We don't care about a 'value', just that it happened.
    )
  }
}

export default createFactory(AppView)
