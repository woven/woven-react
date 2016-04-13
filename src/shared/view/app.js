import * as ramda from 'ramda'
import {Component, createFactory} from 'react'
import {a, span, div, header, ul, li, input, button} from '../util/vdom'
import {mapObjectToList} from '../util/util'
import * as styles from '../styles/app'
import Radium from 'radium'
import timestamp from './timestamp'

class AppView extends Component {
  render() {
    const view = this.props.view
    const inputSources = this.props.inputSources

    return div({className: 'main'},
      header({style: styles.header},
        a({style: styles.menuLink, key: 'messages'}, 'Messages'),
        a({style: styles.menuLink, key: 'about'}, 'About')
      ),
      ul({},
        // the `data` is passed to MyApp component at the bottom of the file (in ReactDOM.render())
        // and now we just 'loop' through the data, in this case, we map the messages to message elements.
        mapObjectToList(view.messages, (messages, messageId) =>
          li({key: messageId, style: styles.messageContainer},
            span({style: styles.message}, messages.message),
            span({style: styles.date}, timestamp({value: messages.created})),
            a({ onClick: e => inputSources.removeMessage.fromConstant(messageId) }, 'Remove')
          )
        )
      ),
      input({
        value: view.newMessage,
        onChange: e => inputSources.newMessage.fromTargetValue(e),
        onKeyUp: e => inputSources.addNewMessage.fromOnlyKeyCode(e, 13)
      }),
      button({ onClick: e => inputSources.addNewMessage.fromConstant() }, 'Add!')
    )
  }
}

export default createFactory(Radium(AppView))
