import {createFactory} from 'react'
import {span} from '../util/vdom'
import moment from 'moment'
import BaseComponent from './base'

class Timestamp extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = this.createNewState()
  }

  createNewState() {
    return {formattedValue: moment(this.props.value).fromNow().toString()}
  }

  componentDidMount() {
    this.setTimer()
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  setTimer() {
    this.timer = setTimeout(() => {
      this.setState(this.createNewState())
      this.setTimer()
    }, 5000)
  }

  render() {
    return span({}, this.state.formattedValue)
  }
}

export default createFactory(Timestamp)
