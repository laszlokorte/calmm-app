import React from 'karet'
import K from 'kefir.combines'
import {bind, bindProps, getProps, fromIds} from 'karet.util'
import Atom from 'kefir.atom'
import R from 'ramda'
import P, * as L from 'partial.lenses'

const exampleData = {
  octaves: R.map(
    (r) => ({label: 'A', note: 1, tones: R.range(0,5000).map((c) => Math.random() > 0.5)}),
  )(R.range(0, 300))
}

const defaultSettings = {
  lineHeight: 30,
  columnWidth: 100,
}

const visibleSlice = (size, scroll, blockSize, limit) => {
  const min = Math.floor(scroll / blockSize)
  const max = min + Math.ceil(size / blockSize)

  return R.range(min, R.max(R.min(max + 1, limit), max - min))
}

export default ({
  data = Atom(exampleData),
  settings = Atom(defaultSettings),
  scrollTop = Atom(0),
  scrollLeft = Atom(0),
  clientWidth = Atom(0),
  clientHeight = Atom(0),
  children, ...props
}) => {
  let resizeListener = null
  const binding = bindProps({ref: "onScroll", scrollTop, scrollLeft})
  const readSize = getProps({
    clientWidth,
    clientHeight
  })
  const ref = (e) => {
    binding.ref(e)
    if(resizeListener) {
      window.removeEventLister('resize', resizeListener)
    }
    if(e) {
      readSize({target:e})
      resizeListener = R.partial(readSize, [{target:e}])
      window.addEventListener('resize', resizeListener)
    }
  }

  const rowCount = data.map(R.pipe(R.prop('octaves'), R.length)).map(R.add(4))
  const columnCount = data.map(({octaves}) => R.reduce(R.max, 0, octaves.map(R.pipe(R.prop('tones'), R.length)))).map(R.add(4))
  const rangeX = K(clientWidth, scrollLeft, settings.view(L.prop('columnWidth')), columnCount, visibleSlice)
  const rangeY = K(clientHeight, scrollTop, settings.view(L.prop('lineHeight')), rowCount, visibleSlice)

  const mousedown = (e) => {
    const x = e.currentTarget.getAttribute('data-x')
    const y = e.currentTarget.getAttribute('data-y')

    data.lens(P('octaves', L.index(parseInt(y)), 'tones', L.index(parseInt(x)))).modify((c) => !c)
  }

  return <div
    {...binding}
    {...props}
    ref={ref}
    style={{
      overflow: 'scroll',
      position: 'relative',
    }}>
    <div style={K(data, settings, ({octaves}, {lineHeight, columnWidth}) => ({
      width: columnWidth * R.reduce(R.max, 0, octaves.map(R.pipe(R.prop('tones'), R.length))),
      height: octaves.length * lineHeight,
    }))}>
      <div style={K(scrollLeft, scrollTop, (x,y) => ({
        position: 'absolute',
        left: x,
        top: y,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }))}><span style={{background: 'white',position:'absolute',right:0, bottom:0}}>{scrollLeft}, {scrollTop}, {clientWidth}, {clientHeight}</span></div>
      {fromIds(rangeY, (idy) =>
        <div key={idy} style={K(settings, ({lineHeight}) => ({
          position: 'absolute',
          left: 0,
          top: lineHeight * idy,
          height: lineHeight,
        }))}>
          {fromIds(rangeX, (idx) =>
            <div key={idx} style={K(data, settings, (d, {lineHeight, columnWidth}) => ({
              position: 'absolute',
              left: columnWidth * idx,
              top: 0,
              width: columnWidth,
              height: '100%',
              outline: '1px solid lightgray',
              lineHeight: lineHeight + 'px',
              textAlign: 'center',
              background: (d.octaves[idy] && d.octaves[idy].tones[idx]) ? '#0E4182' : '#777',
            }))}
            data-x={idx}
            data-y={idy}
            onMouseDown={mousedown}
            >

            </div>
          )}
        </div>
      )}
    </div>
  </div>
}
