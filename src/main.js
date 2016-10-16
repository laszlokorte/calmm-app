import './helpers/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Atom from 'kefir.atom'
import K, {bind} from 'kefir.react.html'
import P, * as L from 'partial.lenses'


import App from './components/App'
import LocationHash, {lensPath} from './helpers/hash-atom'

const appState = Atom({})
const path = LocationHash()

const userId = P(
  L.required('/'),
  lensPath('/user(/:id)'),
  L.valueOr({}),
  L.prop('id')
)

ReactDOM.render(
  <App path={path} state={appState}>
    <br/>
    UserId:<br/>
    <K.input {...bind({value: path.lens(userId, L.defaults(''))})} />
  </App>,
  document.getElementById("app")
)
