import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Component} from 'react'

export default class BaseComponent extends Component {
  shouldComponentUpdate() {
    return PureRenderMixin.shouldComponentUpdate.apply(this, arguments)
  }
}
