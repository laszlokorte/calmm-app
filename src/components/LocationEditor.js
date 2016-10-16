import React from 'karet'
import K from 'kefir.combines'
import {bind} from 'karet.util'
import P, * as L from 'partial.lenses'

import Location, {lensPath} from '../helpers/location'
import {withContext} from './Context'

export default withContext(({children, ...props}, {path, search, hash}) => <div {...props}>
  <h2>Location</h2>
  Path:<br/>
  <input {...bind({value: path.lens(L.defaults(''))})} />
  <br/>f
  Query:<br/>
  <input {...bind({value: search.lens(L.defaults(''))})} />
  <br/>
  Hash:<br/>
  <input {...bind({value: hash.lens(L.defaults(''))})} />
  <br/>
  {children}
</div>)
