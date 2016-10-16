import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload'

const live = process.env.NODE_ENV === 'development'

export default {
  entry: 'src/main.js',
  dest: 'build/bundle.js',
  format: 'iife',

  plugins: [
    commonjs({
      include: ['node_modules/**/*'],
      sourceMap: false,

    }),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV )
    }),
    !live && uglify(),
    live && serve({
      contentBase: '',
      historyApiFallback: true,
      host: 'localhost',
      port: 10001
    }),
    live && livereload({
      watch: 'build',
      applyJSLive: true,
    }),
  ]
};
