import React from 'react'
import K, {bind} from 'kefir.react.html'
import * as L from 'partial.lenses'

export default ({path, state, children, ...props}) =>
  <K.div {...props}>
    <K.label>
      <span>URL Location Hash:</span><br/>
      <K.input type="text" {...bind({value: path})} /><br/>
    </K.label>

    <NameField placeholder="Enter your name" value={state.lens('name', L.defaults(''))} />
    {children}
  </K.div>

const NameField = ({value, children, ...props}) =>
  <label>
    <span>Your Name:</span><br/>
    <K.input type="text" {...bind({value})} {...props} /><br/>
    <K.span>{K(value, (v) => v ? `Hello ${v}` : '')}</K.span>
    {children}
  </label>
