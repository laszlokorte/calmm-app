import Kefir from 'kefir'
import {AbstractMutable} from 'kefir.atom'
import UrlPattern from 'url-pattern'
import {lens, normalize} from 'partial.lenses'

const getLocation = () => {
  const l = window.location
  return {path: l.pathname, search: l.search, hash: l.hash}
}

class LocationAtom extends AbstractMutable {
  constructor() {
    super()
  }
  get() {
    return this._currentEvent.value
  }
  modify(fn) {
    const next = fn(this.get())
    this._maybeEmitValue(next)
    window.history.pushState(null, "", `${next.path}${next.search}${next.hash}`)
  }
  _handleValue(value) {
    this._maybeEmitValue(value)
  }
  _onActivation() {
    const handleValue = evt => console.log(evt) || this._handleValue(getLocation())
    this._$handleValue = handleValue
    this._$handleValue(getLocation())
    window.addEventListener("hashchange", this._$handleValue)
    window.addEventListener("popstate", this._$handleValue)
    window.addEventListener("pushstate", this._$handleValue)
  }
  _onDeactivation() {
    window.removeEventListener("pushstate", this._$handleValue)
    window.removeEventListener("popstate", this._$handleValue)
    window.removeEventListener("hashchange", this._$handleValue)
    this._$handleValue = null
    this._currentEvent = null
  }
}

export const lensPath = (pattern) => {
  const p = new UrlPattern(pattern)

  return lens(
    (path) => p.match(path) || undefined,
    (values, currentPath) => {
      try {
        return p.stringify(values)
      } catch (e) {
        return currentPath
      }
    }
  )
}

export const lensTrimLeft = (substr) => {
  const l = substr.length
  return lens(
    (path) => {
      if (path.substr(0, l) === substr) {
        return path.substr(l)
      } else {
        return path
      }
    },
    (newV) => {
      return substr + (newV || '')
    }
  )
}

export const lensStartWith = (prefix) =>
  normalize((p) => (p && p.substr(0, prefix.length) === prefix) ? p : prefix + p)

export default () => new LocationAtom()
