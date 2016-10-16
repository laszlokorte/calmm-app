import './helpers/polyfill'

import React from 'karet'
import ReactDOM from 'react-dom'
import Atom from 'kefir.atom'
import K from 'kefir.combines'
import {bind} from 'karet.util'
import P, * as L from 'partial.lenses'


import App from './components/App'
import Debugger from './components/Debugger'
import LocationEditor from './components/LocationEditor'
import Context from './components/Context'
import Location, {lensPath, lensTrimLeft, lensStartWith} from './helpers/location'

const appState = Atom({})
const location = Location()

const context = {
  location,
  path: location.lens(P(L.prop('path'), L.define('/'), lensStartWith('/'))),
  search: location.lens(P(L.prop('search'), L.replace('','?'), lensTrimLeft('?'))),
  hash: location.lens(P(L.prop('hash'), L.replace('','#'), lensTrimLeft('#'))),
}


const userId = P(
  L.required('/'),
  lensPath('/user(/:id)'),
  L.valueOr({}),
  L.prop('id')
)

const roomId = P(
  L.required('/'),
  lensPath('/room(/:id)'),
  L.valueOr({}),
  L.prop('id')
)

const talkId = P(
  L.required('/'),
  lensPath('/talk(/:id)'),
  L.valueOr({}),
  L.prop('id')
)

ReactDOM.render(
  <Context {...{context}}>
    <App state={appState}>

      <Debugger>
        <LocationEditor />
        <h2>Params</h2>
        UserId:<br/>
        <input {...bind({value: context.hash.lens(userId, L.normalize((v) => /^\d+$/.test(v) ? parseInt(v) : undefined), L.defaults(''))})} />
        <br/>
        RoomId:<br/>
        <input {...bind({value: context.hash.lens(roomId, L.normalize((v) => /^\d+$/.test(v) ? parseInt(v) : undefined), L.defaults(''))})} />
        <br/>
        TalkId:<br/>
        <input {...bind({value: context.hash.lens(talkId, L.normalize((v) => /^\d+$/.test(v) ? parseInt(v) : undefined), L.defaults(''))})} />
        <br/>
        <a href="#/user/23">test</a>
      </Debugger>
    </App>
  </Context>,
  document.getElementById("app")
)

