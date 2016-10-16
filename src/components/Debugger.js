import React from 'karet'
import K from 'kefir.combines'
import {bind} from 'karet.util'
import Atom from 'kefir.atom'

export default ({open = Atom(false), children, ...props}) =>
  <div style={{background: '#ddd', zIndex: 5000, padding: '1em', position: 'absolute', bottom: '5%', right: '5%', width: '30%'}} {...props}>
    <div style={K(open, b => ({display: b ? 'block' : 'none'}))}>
      {children}
    </div>
    <label>
      <input type="checkbox" {...bind({checked: open})} /> Show Debugger
    </label>
  </div>
