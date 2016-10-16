import React from 'karet'
import {fromClass} from 'karet.util'

export const types = {context: React.PropTypes.any}

class Context extends React.Component {
  constructor(props) {
    super(props)
  }
  getChildContext() {
    return {context: this.props.context}
  }
  render() {
    return this.props.children
  }
}

Context.childContextTypes = types

export const withContext = originalFn => {
  const fn = (props, {context}) => originalFn(props, context)
  fn.contextTypes = types
  return fn
}

export default Context
