import * as rxdom from 'rx-dom'
import * as rxextra from './util/rx-overrides'
import {render, createElement} from 'react-dom'
import AppComponent from './app/component'

// Top-level subscribe should only happen once per the entire application imho.
// Here in index.js we create one single 'instance' of our app, and it returns us an Rx observable representing our state.
// We subscribe to the app state, and render as it changes.
// So: Rx input sources -> new state -> render
AppComponent().subscribe(vdom => render(vdom, document.getElementById('app')))
