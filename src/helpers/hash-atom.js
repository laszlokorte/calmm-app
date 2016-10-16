import Kefir from 'kefir'
import {AbstractMutable} from 'kefir.atom'
import UrlPattern from 'url-pattern'
import {lens} from 'partial.lenses'

const locationHash =
  Kefir.fromEvents(window, "hashchange")
  .merge(Kefir.constant(true))
  .map(() => window.location.hash.substr(1))
  .toProperty()

class HashAtom extends AbstractMutable {
  constructor() {
    super()
    this._source = locationHash
    this._$handleValue = null
  }
  get() {
    if (this._currentEvent)
      return this._currentEvent.value
    else
      return this._getFromSource()
  }
  modify(fn) {
    window.location.hash = fn(this.get())
  }
  _getFromSource() {
    return this._source._currentEvent.value
  }
  _handleValue() {
    this._maybeEmitValue(this._getFromSource())
  }
  _onActivation() {
    const handleValue = value => this._handleValue(value)
    this._$handleValue = handleValue
    this._source.onValue(handleValue)
  }
  _onDeactivation() {
    this._source.offValue(this._$handleValue)
    this._$handleValue = null
    this._currentEvent = null
  }
}

export const lensPath = (pattern) => {
  const p = new UrlPattern(pattern)

  return lens(
    (path) => p.match(path) || undefined,
    (values, path) => {
      try {
        return p.stringify(values)
      } catch (e) {
        return undefined
      }
    }
  )
}

export default () => new HashAtom()
