import * as ramda from 'ramda'
import {Component, createFactory} from 'react'
import {a, span, div, header, ul, li, input, button} from '../util/vdom'
import {mapObjectToList} from '../util/util'
import * as styles from '../styles/app'
import Radium from 'radium'
import timestamp from './timestamp'
import {routes} from '../routing'
import AboutView from './about'

class AppView extends Component {
  render() {
    const view = this.props.view
    const router = this.props.router
    const inputSources = this.props.inputSources

    return div({className: 'main'},
      header({style: styles.header},
        div({style: styles.menu},
          a({href: routes.home, style: styles.menuLink, key: 'messages', onClick: router.paginate}, 'Messages'),
          a({href: routes.about, style: styles.menuLink, key: 'about', onClick: router.paginate}, 'About')
        )
      ),
      router.route == routes.home ? 'home!' : null,
      router.route == routes.about ? AboutView({}) : null,
      div({},
        // the `data` is passed to MyApp component at the bottom of the file (in ReactDOM.render())
        // and now we just 'loop' through the data, in this case, we map the messages to message elements.
        mapObjectToList(view.messages, (messages, messageId) =>
          div({key: messageId, style: styles.messageContainer},
            div({style: styles.userPhotoArea},
              div({style: styles.userPhoto})
            ),
            div({},
              div({style: styles.date}, timestamp({value: messages.created})),
              div({style: styles.message}, messages.message),
              a({
                style: styles.actionLink,
                onClick: e => inputSources.removeMessage.fromConstant(messageId) }, 'Remove')
            )
          )
        )
      ),
      div({style: styles.messageBox},
        input({
          style: styles.messageInput,
          value: view.newMessage,
          onChange: e => inputSources.newMessage.fromTargetValue(e),
          onKeyUp: e => inputSources.addNewMessage.fromOnlyKeyCode(e, 13)
        })
        //,button({
        //  style: styles.messageButton,
        //  onClick: e => inputSources.addNewMessage.fromConstant() }, 'Add!'
        //)
      )
    )
  }
}

export default createFactory(Radium(AppView))
