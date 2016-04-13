import Rx from 'rx'
import {combineTemplate} from '../../shared/util/rx'
import {merge} from 'ramda'
import view from '../../shared/view/app'
import * as http from '../util/http'

const model = (properties) => {
  const fbUrl = 'https://glowing-inferno-1196.firebaseio.com/'

  return combineTemplate(merge(properties, {
    view: {
      messages: http.read(fbUrl + 'messages.json').map(JSON.parse),
      newMessage: ''
    }
  }))
}

export default (properties) => model(properties).map(view)
