import React from 'karet'
import K from 'kefir.combines'
import {bind} from 'karet.util'
import * as L from 'partial.lenses'

export default ({state, children, ...props}) =>
  <div {...props}>
    <NameField placeholder="Enter your name" value={state.lens('name', L.defaults(''))} />
    {children}
  </div>

const NameField = ({value, children, ...props}) =>
  <label>
    <span>Your Name:</span><br/>
    <input type="text" {...bind({value})} {...props} /><br/>
    <span>{K(value, (v) => v ? `Hello ${v}` : '')}</span>
    {children}
  </label>
