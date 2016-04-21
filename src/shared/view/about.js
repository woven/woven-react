import {Component, createFactory} from 'react'
import {div} from '../util/vdom'
import Radium from 'radium'

class AboutView extends Component {
  render() {
    return div({},
      'About page goes here'
    )
  }
}

export default createFactory(Radium(AboutView))
