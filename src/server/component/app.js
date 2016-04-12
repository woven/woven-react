import Rx from 'rx'
import {combineTemplate} from '../../shared/util/rx'
import view from '../../shared/view/app'
import * as http from '../util/http'

const model = () => {
  const fbUrl = 'https://glowing-inferno-1196.firebaseio.com/'

  return combineTemplate({
    view: {
      todos: http.read(fbUrl + 'todos.json').map(JSON.parse),
      newTodoMessage: ''
    }
  })
}

export default () => model().map(view)
